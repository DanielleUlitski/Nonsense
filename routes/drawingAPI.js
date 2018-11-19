const express = require('express')
const router = express.Router()

const User = require('../models/UserModel')
const Drawing = require('../models/DrawingModel')

router.get('/:userName', (req, res) => {
    let userName = req.params.userName;

    User.findOne({ userName }).populate('drawings').exec((err, user) => {
        if (err) throw new Error(err);
        res.send(user.drawings)
    })
})

router.post('/opendrawing', (req, res) => {
    let newDrawing = new Drawing({})
    newDrawing.artists.push(req.body.userName);
    newDrawing.save((err, drawing) => {
        if (err) throw new Error(err);
        res.send(drawing)
    })
})

// router.get('/getFinal/:drawingId', (req, res) => {
//     Drawing.findOne({ _id: req.params.drawingId }, (drawing) => {
//         res.send(drawing);
//     })
// })

module.exports = router;