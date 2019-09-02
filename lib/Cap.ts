const { EventEmitter } = require("events");
const addon = require("../build/Release/cap.node");
const Cap = addon.Cap;

Cap.prototype.__proto__ = EventEmitter.prototype;
Cap.findDevice = addon.findDevice;
Cap.deviceList = addon.deviceList;

export { Cap };
