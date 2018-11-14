const express = require('express');
const app = express();
const server = app.listen(8000);
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

app.use('/api/user', usersAPI);
app.use('/api/story', storyAPI);
app.use('/api/drawing', drawingAPI);
app.use()

io.sockets.on('connection', (socket) => {
  socket.on('validateLogin', (user, socketId) => {
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
        socket.emit('login', user);
      }
    })
  })

  socket.emit('firstemit', socket);
})