const express = require('express');
const app = express();
const server = app.listen(8000);
const path = require('path');
const bodyParser = require('body-parser');
const io = require('socket.io').listen(server)
const mongoose = require('mongoose');

mongoose.connect('mongodb://nonsensus:zyaHJa4YzsZPDQ5@ds127961.mlab.com:27961/nonsense')

const usersAPI = require('./routes/usersAPI')
const storyAPI = require('./routes/storyAPI')
const drawingAPI = require('./routes/drawingAPI')
const users = [];
const rooms = { "Lobby": [] };
const User = require('./models/UserModel')
const Drawing = require('./models/DrawingModel')
const Story = require('./models/StoryModel')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(usersAPI);
app.use('/api/story', storyAPI);
app.use('/api/drawing', drawingAPI);
app.use(express.static(path.join(__dirname, './client/build')))

const findWithAttr = (array, attr, value) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}

io.sockets.on('connection', (socket) => {

  socket.on('validateLogin', (user, socketId) => {
    User.findOne({ $and: [{ userName: user.userName }, { password: user.password }] }).exec((err, user) => {
      if (err) throw new Error(err);
      if (!user) {
        socket.emit("wrong user");
      } else {
        if (findWithAttr(users, 'userName', user.userName) !== -1) {
          socket.emit('you are already logged In')
        } else {
          users.push({
            userName: user.userName,
            session: socketId,
          });
          socket.user = user;
          socket.room = 'Lobby';
          socket.join('Lobby');
          console.log(rooms);
          rooms['Lobby'].push(socket.user.userName);
          socket.session = socketId;
          socket.emit('login', user);
        }
      }
    })
  })

  socket.on('disconnect', () => {
    if (socket.user) {
      users.splice(findWithAttr(users, 'userName', socket.user.userName), 1);
      rooms[socket.room].splice(rooms[socket.room].indexOf(socket.user.userName), 1);
      if (socket.room !== 'Lobby') {
        io.sockets.in(`${socket.room}`).emit("userJoined", rooms[socket.room])
      }
      if (rooms[socket.room].length <= 0) {
        delete rooms[socket.room];
      }
    }
  })

  socket.on('logOut', () => {
    users.splice(findWithAttr(users, 'userName', socket.user.userName), 1);
    rooms[socket.room].splice(rooms[socket.room].indexOf(socket.user.userName), 1);
    if (socket.room !== 'Lobby') {
      io.sockets.in(`${socket.room}`).emit('userJoined', rooms[socket.room]);
    }
    socket.leave(socket.room);
    socket.room = undefined;
  })

  socket.on('newRoom', (newRoom, roomType) => {
    User.findOne({ userName: socket.user.userName }, (err, user) => {
      if (err) throw new Error(err);
      switch (roomType) {
        case 'drawing':
          user.drawings.push(newRoom);
          break;
        case 'story':
          user.stories.push(newRoom);
          break;
        default: console.error('no Room Type');
      }
      user.save();
    })
    socket.leave('Lobby');
    rooms['Lobby'].splice(rooms['Lobby'].indexOf(socket.user.userName), 1);
    socket.room = newRoom;
    rooms[newRoom] = [];
    rooms[newRoom].push(socket.user.userName);
    socket.join(newRoom);
    socket.emit('userJoined', [socket.user.userName]);
  })

  socket.on('sendInvite', (user, roomType) => {
    User.findOne({ userName: user }).exec((err, foundUser) => {
      if (err) throw new Error(err);
      if (!foundUser) {
        socket.emit("usernotfound")
      } else {
        let index = findWithAttr(users, "userName", foundUser.userName);
        if (index >= 0) {
          let socketId = users[index].session;
          io.to(`${socketId}`).emit('gotInvite', socket.user.userName, socket.room, roomType);
        }
      }
    })
  })

  socket.on('joinRoom', (roomType, roomId) => {
    switch (roomType) {
      case "drawing":
        Drawing.findById(roomId, (err, room) => {
          if (err) throw new Error(err);
          room.artists.push(socket.user.userName);
          room.save();
        })
    }
    User.findOne({ userName: socket.user.userName }, (err, user) => {
      if (err) throw new Error(err);
      user.drawings.push(roomId);
      user.save();
    })
    socket.leave('Lobby');
    socket.room = roomId;
    rooms['Lobby'].splice(rooms['Lobby'].indexOf(socket.user.userName), 1);
    socket.join(roomId);
    rooms[roomId].push(socket.user.userName);
    io.sockets.in(roomId).emit('userJoined', rooms[roomId]);
    socket.emit('loadRoom', socket.room)
  })

  socket.on('start', () => {
    io.sockets.in(socket.room).emit('start');
  })

  socket.on('updateDrawing', (x, y, isNewLine, color) => {
    io.sockets.in(socket.room).emit('incomingUpdates', x, y, isNewLine, color);
  })

  socket.on('updateStory', (sentence, key) => {
    Story.findById(socket.room, (err, story) => {
      if (err) throw new Error(err);
      story.text.push(sentence);
      story.save();
    })
    io.sockets.in(socket.room).emit('storyUpdates', key);
  })

  socket.on('pass', (usersInRoom) => {
    let nextUserIndex;
    let currentUserIndex = usersInRoom.indexOf(socket.user.userName);
    if (currentUserIndex >= usersInRoom.length - 1) {
      nextUserIndex = 0;
    }
    else {
      nextUserIndex = currentUserIndex + 1;
    }
    let nextUser = users[findWithAttr(users, "userName", usersInRoom[nextUserIndex])];
    if (nextUser) {
      io.to(`${nextUser.session}`).emit('yourTurn');
    }
  })

  socket.on('finish', (gameType, arr) => {
    // delete rooms[socket.room];
    switch (gameType) {
      case "drawing":
        Drawing.findById(socket.room, (err, drawing) => {
          if (err) throw new Error(err);
          drawing.sequences = arr;
          drawing.save(() => {
            io.sockets.in(socket.room).emit('finish', drawing.sequences);
          });
        })
        break;
      case "story":
        Story.findOne({ _id: socket.room }, (story) => {
          io.sockets.in(socket.room).emit('finish', story);
        })
        break;
      default: console.error('missing gameType');
    }
  })

  socket.on('finalize', () => {
    socket.leave(socket.room);
    rooms[socket.room].splice(rooms[socket.room].indexOf(socket.user.userName), 1);
    if (!rooms[socket.room].length) {
      // rooms.splice(rooms.indexOf(socket.room), 1);
      delete rooms[socket.room]
    }
    console.log(rooms);
    socket.room = 'Lobby';
  })
})