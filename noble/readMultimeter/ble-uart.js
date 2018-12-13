
/*
Noble UART service example

This example uses Sandeep Mistry's noble library for node.js to
read and write from Bluetooth LE characteristics. It looks for a UART
characteristic based on a proprietary UART service by Nordic Semiconductor.
You can see this service implemented in Adafruit's BLEFriend library.

created 30 Nov 2015
by Tom Igoe
modified 1 Dec 2015
by Don Coleman
*/

var noble = require('noble');   //noble library
var util = require('util');     // utilities library

// make an instance of the eventEmitter library:
var EventEmitter = require('events').EventEmitter;

// uuids are easier to read with dashes
// this helper removes dashes so comparisons work
var uuid = function(uuid_with_dashes) {
  return uuid_with_dashes.replace(/-/g, '');
};

// TX and RX are from Noble's perspective
var knownUartServices = {
  nordic: {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txUUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    rxUUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
  },
  redbear: {
    serviceUUID: '713d0000-503e-4c75-ba94-3148f18d941e',
    txUUID: '713d0003-503e-4c75-ba94-3148f18d941e',
    rxUUID: '713d0002-503e-4c75-ba94-3148f18d941e'
  },
  laird: {
    serviceUUID: '569a1101-b87f-490c-92cb-11ba5ea5167c',
    txUUID: '569a2001-b87f-490c-92cb-11ba5ea5167c',
    rxUUID: '569a2000-b87f-490c-92cb-11ba5ea5167c'
  },
  bluegiga: {
    serviceUUID: '1d5688de-866d-3aa4-ec46-a1bddb37ecf6',
    txUUID: 'af20fbac-2518-4998-9af7-af42540731b3',
    rxUUID: 'af20fbac-2518-4998-9af7-af42540731b3'
  }
};

var checkService = function(name, uart) {
  var error = false;

  if (!name) {
    name = "UART Service";
  }

  if (Object.keys(uart).length === 0) {
    // Maybe the user typo'd the service name?
    console.log("Expecting service name to be one of: " + Object.keys(knownUartServices).join(", ") + ".");
    console.log("Or pass serviceUUID, txUUID, & rxUUID in object literal as second argument.");
    error = true;
  } else {
    if (!uart.serviceUUID) {
      console.log("ERROR: Expecting serviceUUID for " + name);
      error = true;
    }
    if (!uart.txUUID) {
      console.log("ERROR: Expecting txUUID for " + name);
      error = true;
    }
    if (!uart.rxUUID) {
      console.log("ERROR: Expecting rxUUID for " + name);
      error = true;
    }
  }

  // TODO handle this better...
  if (error) {
    console.log(name + " " + JSON.stringify(uart));
    process.exit(-1);
  }
};

// constructor function, so you can call new BleUart():
var BleUart = function (name, options) {

  // get known service or empty object
  var uart = knownUartServices[name] || {};
  // apply user over rides
  Object.assign(uart, options);

  checkService(name, uart);

  var serviceUUID = uuid(uart.serviceUUID); // the service you want
  var transmitUUID = uuid(uart.txUUID); // TX from noble's perspective
  var receiveUUID = uuid(uart.rxUUID);  // RX from noble's perspective
  var receive, transmit;        // transmit and receive BLE characteristics
  var writeWithoutResponse;     // flag for write characteristic (based on Bluefruit version)
  var self = this;              // reference to the instance of BleUart
  self.connected = false;       // whether the remote peripheral's connected
  self.peripheral = null;       // the remote peripheral as an object
  EventEmitter.call(self);      // make a copy of EventEmitter so you can emit events

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
  };

  // the services and characteristics exploration function:
  // once you're connected, this gets run:
  function explore(error, services) {
    // this gets run by the for-loop at the end of the
    // explore function, below:
    function getCharacteristics(error, characteristics) {

        characteristics.forEach(function(characteristic) {
          //DEBUG console.log(characteristic.toString());
          if (characteristic.uuid === receiveUUID) {
            receive = characteristic;

            if (characteristic.properties.indexOf("notify") < 0) {
              console.log("ERROR: expecting " + characteristic.uuid + " to have 'notify' property.");
            }
            receive.notify(true);  // turn on notifications

            receive.on('read', function(data, notification) {
              if (notification) {   // if you got a notification
                self.emit('data', data);  // emit a data event
              }
            });
          }

          // separate *if* since some hardware uses the same characteristic for tx and rx
          if (characteristic.uuid === transmitUUID) {
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
      // you can only send at most 20 bytes in a Bluetooth LE pacet.
      // so slice the data into 20-byte chunks:
      while (data.length > 20) {
        var output = data.slice(0, 19);
        transmit.write(new Buffer(output), writeWithoutResponse);
        data = data.slice(20);
      }
      // send any remainder bytes less than the last 20:
      transmit.write(new Buffer(data), writeWithoutResponse);
    }
  };

  // the BLE disconnect function:
  self.disconnect = function() {
    self.connected = false;
  };

  // when the radio turns on, start scanning:
  noble.on('stateChange', scan);
  // if you discover a peripheral with the appropriate service, connect:
  noble.on('discover', self.connect);
};

util.inherits(BleUart, EventEmitter);   // BleUart inherits all the EventEmitter properties
module.exports = BleUart;               // export BleUart
