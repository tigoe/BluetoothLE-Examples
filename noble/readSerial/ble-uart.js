
/*
Noble cread UART service  example

This example uses Sandeep Mistry's noble library for node.js to
read and write from Bluetooth LE characteristics. It looks for a UART
characteristic based on a proprietary UART service by Nordic Semiconductor.
You can see this service implemented in Adafruit's BLEFriend library.

created 30 Nov 2015
by Tom Igoe
*/

var noble = require('noble');   //noble library
var util = require('util');     // utilities library

// make an instance of the eventEmitter library:
var EventEmitter = require('events').EventEmitter;

// uuids are easier to read with dashes
// this helper removes dashes so comparisons work
var uuid = function(uuid_with_dashes) {
  return uuid_with_dashes.replace(/-/g, '');
}

// constructor function, so you can call new BleUart():
var BleUart = function (optional_service_uuid) {
  // UUIDs for Nordic UART service
  var serviceUUID = uuid('6e400001-b5a3-f393-e0a9-e50e24dcca9e'); // the service you want
  var transmitUUID = uuid('6e400002-b5a3-f393-e0a9-e50e24dcca9e'); // TX from noble's perspective
  var receiveUUID = uuid('6e400003-b5a3-f393-e0a9-e50e24dcca9e');  // RX from noble's perspective
  var receive, transmit;        // transmit and receive BLE characteristics
  var writeWithoutResponse;     // flag for write characteristic (based on Bluefruit version)
  var self = this;              // reference to the instance of BleUart
  self.connected = false;       // whether the remote peripheral's connected
  self.peripheral = null;       // the remote peripheral as an object
  EventEmitter.call(self);      // make a copy of EventEmitter so you can emit events

  if (optional_service_uuid) {  // if the constructor was called with a different UUID,
    serviceUUID = uuid(optional_service_uuid);  // then set that as the service to search for
  }

  // The scanning function:
  function scan(state) {
    if (state === 'poweredOn') {    // if the radio's on, scan for this service
      noble.startScanning([serviceUUID], false);
    }
    // emit a 'scanning' event:
    self.emit('scanning', state);
  }

  // the connect function:
  self.connect = function(peripheral) {
    self.peripheral = peripheral;
    peripheral.connect();       // start connection attempts

    // the connect function. This is local to the discovery function
    // because it needs to know the peripheral to discover services:
    function discover() {
      // once you know you have a peripheral with the desired
      // service, you can stop scanning for others:
      noble.stopScanning();
      // get the service you want on this peripheral:
      peripheral.discoverServices([serviceUUID],explore);
    }

    // called only when the peripheral has the service you're looking for:
    peripheral.on('connect', discover);
    // when a peripheral disconnects, run disconnect:
    peripheral.on('disconnect', self.disconnect);
  }

  // the services and characteristics exploration function:
  // once you're connected, this gets run:
  function explore(error, services) {
    // this gets run by the for-loop at the end of the
    // explore function, below:
    function getCharacteristics(error, characteristics) {

        characteristics.forEach(function(characteristic) {
          console.log(characteristic.toString());
          if (characteristic.uuid === receiveUUID) {
            console.log("Discovered Receive Characteristic");
            receive = characteristic;
            receive.notify(true);    // turn on notifications

            receive.on('read', function(data, notification) {
              console.log(JSON.stringify(data));
              if (notification) {   // if you got a notification
                self.emit('data', String(data));  // emit a data event
              }
            });
          } else if (characteristic.uuid === transmitUUID) {
            console.log("Discovered Transmit Characteristic");
            transmit = characteristic;
            // Older Adafruit hardware is writeWithoutResponse
            if (characteristic.properties.indexOf("writeWithoutResponse") > -1) {
              writeWithoutResponse = true;
            } else {
              writeWithoutResponse = false;
            }
          }
        });

        // if you've got a valid transmit and receive characteristic,
        // then you're truly connected. Emit a connected event:
        if (transmit && receive) {
            self.connected = true;
            self.emit('connected', self.connected);
        }
    } // end of getCharacteristics()

    // iterate over the services discovered. If one matches
    // the UART service, look for its characteristics:
    for (var s in services) {
      if (services[s].uuid === serviceUUID) {
        services[s].discoverCharacteristics([], getCharacteristics);
        return;
      }
    }
  }

  // the BLE write function. If there's a valid transmit characteristic,
  /// then write data out to it as a Buffer:
  self.write = function(data) {
    if (transmit) {
      console.log("writeWithoutResponse =", writeWithoutResponse)
      transmit.write(new Buffer(data), writeWithoutResponse);
    }
  }

  // the BLE disconnect function:
  self.disconnect = function() {
    self.connected = false;
  }

  // when the radio turns on, start scanning:
  noble.on('stateChange', scan);
  // if you discover a peripheral with the appropriate service, connect:
  noble.on('discover', self.connect);
}

util.inherits(BleUart, EventEmitter);   // BleUart inherits all the EventEmitter properties
module.exports = BleUart;               // export BleUart
