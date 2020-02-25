const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SensorMeta = require('./sensorMetaSchema');

const SensorSchema = new Schema({
    device: String,
    sensorData:{
        temperature: Number,
        humidity: Number,
        light: Number
    },
    date: {type:Date, default:Date.now()}
});

SensorSchema.statics.getTotalDeviceNum = async function getTotalDeviceNum(){
     return await SensorMeta.findOne({});
};

SensorSchema.statics.getSortedByDevice =  async function getSortedByDevice(){
    const result = await this.getTotalDeviceNum();
    const totalDeviceNumber = result._doc.totalDeviceNumber;
    // console.log(totalDeviceNumber);
    let deviceDataList = [];
    for(let i = 0; i < totalDeviceNumber; i++){
        deviceDataList[i] = await this.find({device: `RASP${i+1}`}).sort({date: -1}).limit(10);
    }
    return {deviceDataList: deviceDataList, totalDeviceNumber: totalDeviceNumber};
};

SensorSchema.statics.updateDeviceStatus = function updateDeviceStatus(type, name) {

    this.findOne({totalDeviceNumber: {$gte: 0}}).then(result => {
        if(type === 'inc'){
            // console.dir(result._doc);
            const newData = {
                    totalDeviceNumber: result._doc.totalDeviceNumber+1,
                    deviceList: result._doc.deviceList.concat(name)};
            // console.log(newData);
                this.findOneAndReplace({totalDeviceNumber: {$gte: 0}}, newData, null, (result)=>{
                    // console.log(result);
                });
        } else {
            let newDeviceList = result.deviceList.split(result.deviceList.indexOf(name), 1);
            const newData = {...result, totalDeviceNumber: result.totalDeviceNumber-1,
                deviceList: newDeviceList};
            // this.findOneAndReplace({totalDeviceNumber: {$gte: 0}}, newData);
        }
    })
};

SensorSchema.statics.getDeviceList = async function getDeviceList(){
    return await this.find({totalDeviceNumber: {$gte: 0}});
};

SensorSchema.statics.getLastData = async function getLastData(){
    return await this.find().limit(6);
};

module.exports = mongoose.model('Sensor', SensorSchema);
