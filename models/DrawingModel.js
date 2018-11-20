const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const drawingSchema = new Schema({
    artists: [],
    sequences: []
});

const Drawing = mongoose.model('drawing', drawingSchema);

module.exports = Drawing;