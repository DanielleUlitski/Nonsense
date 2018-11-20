const express = require('express')
const router = express.Router()

const User = require('../models/UserModel')
const Story = require('../models/StoryModel')

router.get('/:userName', (req,res)=>{
    let userName = req.params.userName;

    User.findOne({userName}).populate('stories').exec((err, user)=>{
        if (err) throw new Error(err);
        res.send(user.stories)
    })
})

router.post('/openstory', (req,res)=>{
    let newStory = new Story({})
    newStory.writers.push(req.body.userName);
    newStory.save(((err, story)=>{
        if (err) throw new Error(err);
        res.send(story)
    }))
})

router.post('/endstory', (req, res) => {
    let story = req.body.story;
    Story.findOneAndUpdate({_id: story._id}, {text: story.text , writers: story.writers}).exec((err, story)=>{
        if (err) throw new Error(err);
        res.send(story)
    })
})

module.exports = router