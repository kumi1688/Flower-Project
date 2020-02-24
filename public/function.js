var socket = io.connect('http://localhost');
console.log('io socket connected');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});
