const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlowerSchema = new Schema({
    device: String,
    sensorData:{
        temperature: Number,
        humidity: Number,
        light: Number
    },
    date: {type:Date, default:Date.now()}
});

module.exports = mongoose.model('flower', FlowerSchema);
