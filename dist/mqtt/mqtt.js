"use strict";

var _sensorSchema = require("../db/sensorSchema");

var _sensorSchema2 = _interopRequireDefault(_sensorSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://test.mosquitto.org");


client.on("connect", function () {
    client.subscribe("RASP1");
});;

client.on("message", function (topic, message) {
    // message is Buffer
    var temp = message.toString().split(',');
    var tempArr = [];
    temp.forEach(function (element) {
        tempArr.push(Number(element));
    });
    var result = {
        temperature: tempArr[0],
        humidity: tempArr[1],
        light: tempArr[2]
    };
    console.log(result);
    //{ temperature: 23, humidity: 44, light: 75 }
    var newFlower = (0, _sensorSchema2.default)({
        rawData: {
            temperature: result.temperature,
            humidity: result.humidity,
            light: result.light
        },
        device: topic
    });
    newFlower.save();
});