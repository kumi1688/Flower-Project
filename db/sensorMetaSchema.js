const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SensorMetaSchema = new Schema({
    totalDeviceNumber: Number,
    deviceList : Array,
});

SensorMetaSchema.statics.getTotalDeviceNum = function getTotalDeviceNum(){
    return this.findOne();
};

SensorMetaSchema.statics.getDeviceList = function getDeviceList(){
    return this.findOne();
};

module.exports = mongoose.model('SensorMeta', SensorMetaSchema);
