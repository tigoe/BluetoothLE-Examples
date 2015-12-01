
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

// constructor function, so you can call new BleUart():
var BleUart = function (uuid) {
  var service = '6e400001b5a3f393e0a9e50e24dcca9e';     // the service you want
  var receive, transmit;        // transmit and receive BLE characteristics
  var self = this;              // reference to the instance of BleUart
  self.connected = false;       // whether the remote peripheral's connected
  self.peripheral;              // the remote peripheral as an object
  EventEmitter.call(self);      // make a copy of EventEmitter so you can emit events

  if (uuid) {                   // if the constructor was called with a different UUID,
    service = uuid;             // then set that as the service to search for
  }

  // The scanning function:
  function scan(state) {
    if (state === 'poweredOn') {    // if the radio's on, scan for this service
      noble.startScanning([service], false);
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
      peripheral.discoverServices([service],explore);
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
      for (var c in characteristics) {        // loop over the characteristics
        if (characteristics[c].notify) {      // if one has the notify property
          receive = characteristics[c];       // then it's the receive characteristic
          receive.notify(true);    // turn on notifications

          // whenever a notify event happens, get the result.
          // this handles repeated notifications:
          receive.on('data', function(data, notification) {
            console.log("notification");
            if (notification) {   // if you got a notification
              self.emit('data', String(data));  // emit a data event
            }
          });
        }

        if (characteristics[c].write) {     // if a characteristic has a write property
          transmit = characteristics[c];    // then it's the transmit characteristic
        }
      }   // end of getCharacteristics()

    // if you've got a valid transmit and receive characteristic,
    // then you're truly connected. Emit a connected event:
    if (transmit && receive) {
        self.connected = true;
        self.emit('connected', self.connected);
      }
    }

    // iterate over the services discovered. If one matches
    // the UART service, look for its characteristics:
    for (var s in services) {
      if (services[s].uuid === service) {
        services[s].discoverCharacteristics([], getCharacteristics);
        return;
      }
    }
  }

  // the BLE write function. If there's a valid transmit characteristic,
  /// then write data out to it as a Buffer:
  self.write = function(data) {
    if (transmit) {
      transmit.write(new Buffer(data));
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
