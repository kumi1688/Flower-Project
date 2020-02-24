const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");
const Sensor = require('../db/sensorSchema');
const SensorMeta = require('../db/sensorMetaSchema');
const db = require('../db/db');
const { Worker, isMainThread, workerData } = require('worker_threads');

let deviceList = [];
const getDeviceList = () => new Promise(async (resolve, reject)=>{
    try{
        const result = await SensorMeta.findOne();

        deviceList = result._doc.deviceList;
        resolve(deviceList);
    }catch(e) {
        reject(e);
    }
});

const setDeviceList = async () => {
    await getDeviceList();
};
setDeviceList();

client.on("connect", function() {
    console.log(`connected to RASP${workerData}`);
    client.subscribe(`RASP${workerData}`);
});

client.on("message",   async function(topic, message) {
    // message is Buffer
    let temp = message.toString().split(',');
    let tempArr = [];
    temp.forEach(element => {
        tempArr.push(Number(element));
    });
    const result2 = await SensorMeta.findOne({});

    let flags = false;
    result2._doc.deviceList.forEach(element=>{
        if(element === topic) flags = true;
    });

    if(flags === false){
        SensorMeta.findByIdAndUpdate(result2._id, {
            deviceList: result2.deviceList.concat(topic),
            totalDeviceNumber: result2.totalDeviceNumber+1
        }).exec();
    }

    let result = {
        temperature: tempArr[0],
        humidity: tempArr[1],
        light: tempArr[2]
    };

    const newSensor = new Sensor({
        sensorData: result,
        device: topic,
    });

     newSensor.save(function(err){
         if(err) throw err;
     })
});
