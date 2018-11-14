const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: String,
    password: String,
    drawings: [{type: Schema.Types.ObjectId, ref: 'drawing'}],
    stories: [{type: Schema.Types.ObjectId, ref: 'story'}]
});

const User = mongoose.model('User', userSchema);

module.exports = User;