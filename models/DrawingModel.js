const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const drawingSchema = new Schema({
    img: { data: Buffer, contentType: String },
    artists: [],
    sequences: []
});

const Drawing = mongoose.model('drawing', drawingSchema);

module.exports = Drawing;