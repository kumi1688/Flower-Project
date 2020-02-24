const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");
const Flower = require('../db/sensorSchema');
const db = require('../db/db');
const { Worker, isMainThread, workerData } = require('worker_threads');

client.on("connect", function() {
    console.log(`RASP${workerData}`);
    client.subscribe(`RASP${workerData}`);
});

client.on("message",   async function(topic, message) {
    // message is Buffer
    let temp = message.toString().split(',');
    let tempArr = [];
    temp.forEach(element => {
        tempArr.push(Number(element));
    });

    let result = {
        temperature: tempArr[0],
        humidity: tempArr[1],
        light: tempArr[2]
    };

    const newFlower = new Flower({
        sensorData: result,
        device: topic,
    });

     newFlower.save(function(err){
         if(err) throw err;
     })
});
