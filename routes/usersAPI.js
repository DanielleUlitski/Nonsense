const express = require('express')
const router = express.Router()

const User = require('../models/UserModel')

router.post('', (req, res) => {
    let user = req.body.user;
    User.findOne({ userName: user.userName }).exec((err, user) => {
        if (err) throw new Error(err);
        if (user) res.send(user)
    })
    user = new User(user);
    user.save().exec(()=>{
        res.send(user);
    });
})

module.exports = router