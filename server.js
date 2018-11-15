const express = require('express');
const app = express();
const server = app.listen(8000);
const path = require('path');
const bodyParser = require('body-parser');
const io = require('socket.io').listen(server)
const mongoose = require('mongoose');

mongoose.connect('mongodb://nonsensus:zyaHJa4YzsZPDQ5@ds127961.mlab.com:27961/nonsense', () => {
  console.log("DB connection established!!!");
})

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
        users.push({
          userName: user.userName,
          session: socketId,
        });
        socket.user = user;
        socket.room = 'Lobby';
        socket.join('Lobby');
        rooms['Lobby'].push(socket.user.userName);
        socket.session = socketId;
        socket.emit('login', user);
      }
    })
  })

  socket.on('newRoom', (newRoom) => {
    console.log(newRoom);
    socket.leave('Lobby');
    rooms['Lobby'].splice(rooms['Lobby'].indexOf(socket.user.userName), 1);
    socket.room = newRoom;
    rooms[newRoom] = [];
    rooms[newRoom].push(socket.user.userName);
    socket.join(newRoom);
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

  socket.on('enteredRoom', () => {

  })

  socket.on('joinRoom', (roomType, roomId) => {
    switch (roomType) {
      case "drawing":
        Drawing.findById(roomId, (err, room) => {
          if (err) throw new Error(err);
          room.artists.push(socket.user.userName);
        })
    }

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

  socket.on('updateRoom', (x, y) => {
    io.sockets.in(socket.room).emit('incomingUpdates', x, y);
  })
})