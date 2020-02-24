var server = require('../bin/www');
var io = require('socket.io')(server);

server.listen(80);

io.on('connection', function (socket) {
    console.log('websocket connected');
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});
