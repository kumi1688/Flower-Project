'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var Flower = new _mongoose.Schema({
    sensorData: {
        temperature: { type: Number },
        humidity: { type: Number },
        light: { type: Number }
    },
    device: { type: String },
    date: { type: Date, default: Date.now }
});

exports.default = Flower;