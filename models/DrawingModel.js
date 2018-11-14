const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const drawingSchema = new Schema({
    img: { data: Buffer, contentType: String },
    artists: [],
    secuences: []
});

const Drawing = mongoose.model('drawing', drawingSchema);

module.exports = Drawing;