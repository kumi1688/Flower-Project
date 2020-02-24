'use strict';

var mongoose = require('mongoose');

var connectDB = async function connectDB() {
    await mongoose.connect('mongodb://localhost/flower', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('DB connected');
};

module.exports = connectDB;