var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { Worker } = require('worker_threads');

const total_rasp_num = 3;
let mqtt_thread = [];
let mqtt_thread_status = [];

for(let i = 1; i <= total_rasp_num; i++){
  mqtt_thread[i] = new Worker(__dirname + '/mqtt/mqtt.js', {workerData: i});
  mqtt_thread_status[i] = true;
}

var indexRouter = require('./routes/index');
const sensorRouter = require('./routes/sensor')
const mqttRouter = require('./routes/mqtt');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sensor', sensorRouter);
app.use('/mqtt/:id', (req, res)=>{
  const id = req.params.id;
  if(mqtt_thread_status[id] === true){
    mqtt_thread[id].terminate();
    mqtt_thread_status[id] = false;
    console.log(`mqtt ${id} 종료`);
    res.send(`mqtt ${id} 종료`);
  }else{
    mqtt_thread[id] = new Worker(__dirname + '/mqtt/mqtt.js', {workerData: id});
    mqtt_thread_status[id] = true;
    console.log(`mqtt ${id} 재실행`);
    res.send(`mqtt ${id} 재실행`);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.io = require('socket.io')();
app.io.on('connection', function(socket) {
  console.log("a user connected");
  setInterval(() => {
    socket.emit('hi', {message: 'hello websocket!'})
  }, 1000);


  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('news', function (msg) {

  });
});
module.exports = app;
