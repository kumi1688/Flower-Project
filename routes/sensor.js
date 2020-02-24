const express = require('express');
const router = express.Router();
const Sensor = require('../db/sensorSchema');
const SensorMeta = require('../db/sensorMetaSchema');
const db = require('../db/db');

router.get('/', (req, res, next)=>{
   const data = {
      temperature : 10,
      humidity : 20,
      light: 30
   };

   // Sensor.getLastData().then(result => {
   //    // console.log(result);
   //    res.send(result);
   // });
   Sensor.getSortedByDevice().then(result=>{
      res.send(result);
   })

});



module.exports = router;
