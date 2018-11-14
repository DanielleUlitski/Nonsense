const express = require('express')
const router = express.Router()

const User = require('../models/UserModel')

router.post('/api/user', (req, res) => {
    console.log(req.body);
    let user = req.body;
    User.findOne({ userName: user.userName }).exec((err, data) => {
        if (err) throw new Error(err);
        if (data) {
            res.send(data)
        } else {
            newUser = new User(user);
            newUser.save()
            res.send(user);
        }
    })
})

module.exports = router