const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
    text: [],
    writers: []
});

const Story = mongoose.model('story', storySchema);

module.exports = Story;