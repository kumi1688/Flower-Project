"use strict";

var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", function () {
    client.subscribe("mqtt", null, function (err) {
        if (err) throw err;
    });
});;