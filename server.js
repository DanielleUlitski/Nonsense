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
  // console.log(socket);
  socket.on('validateLogin', (user, socketId) => {
    console.log(user.password);
    User.findOne({ $and: [{ userName: user.userName }, { password: user.password }] }).exec((err, user) => {
      if (err) throw new Error(err);
      if (!user) {
        socket.emit("wrong user");
      } else {
        users.push({
          userName: user.userName,
          sessionId: socketId,
        }),
          socket.user = user;
        socket.room = 'Lobby';
        socket.leaveAll();
        socket.join('Lobby');
        socket.session = socketId;
        console.log(user);
        socket.emit('login', user);
      }
    })
  })

  socket.on('sendInvite', (user) => {
    User.findOne({ userName: user }).exec((err, foundUser) => {
      if (err) throw new Error(err);
      if (!foundUser) {
        socket.emit("usernotfound")
      } else {
        let index = findWithAttr(users, userName, foundUser.userName);
        if (index) {
          io.to(users[index].sessionId).emit('gotInvite', )
        }
      }
    })
  })

  socket.on('joinRoom', (userName, roomId) => {
    socket.leaveAll();
    socket.room = roomId;
    socket.join(roomId);
    io.sockets.in(roomId).emit('userJoined', socket.userName, socket.sessionId);
  })
})