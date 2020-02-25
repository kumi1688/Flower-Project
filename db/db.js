const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/flower',  { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('db connected');
});

module.exports = db;
