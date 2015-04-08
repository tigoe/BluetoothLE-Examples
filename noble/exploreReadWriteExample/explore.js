
/*
Noble characteristic read/write  example

This example uses Sandeep Mistry's noble library for node.js to
read and write to a characteristic of a peripheral. It's designed
to work with the led example from Sandeep's arduino-BLEPeripheral example,
in which there's one service, with one characteristic, and the
characteristic can have the value 0 or 1. An LED attached to a BLE Nano
or RFDuino is controlled by this characteristic.

The startScanning function call filters for the specific service
you want, in order to ignore other devices and services.

For a peripheral example that works with this see the
Arduino led example in Sandeep's Arduino-BLEPeripheral library:
https://github.com/sandeepmistry/arduino-BLEPeripheral

created 21 Feb 2015
by Maria Paula Saba
modified 12 Mar 2015
by Tom Igoe

Modified from Maria Paula Saba's exploreExample.

*/

var noble = require('noble');   //noble library
var peripheralName = "LED";     // the local name of the peripheral you want
var targetService = '19b10000e8f2537e4f6cd104768a1214';         // the service you want
var targetCharacteristic = '19b10001e8f2537e4f6cd104768a1214';  // the characteristic you want

// The scanning function
function scan(state){
  if (state === 'poweredOn') {    // if the radio's on, scan for this service
    noble.startScanning([targetService], false);
    console.log("Started scanning");
  } else {                        // if the radio's off, let the user know:
    noble.stopScanning();
    console.log("Is Bluetooth on?");
  }
}

// the main discovery function
function findMe (peripheral) {
  console.log('discovered ' + peripheral.advertisement.localName);
  peripheral.connect();     // start connection attempts

  // called only when the peripheral has the service you're looking for:
  peripheral.on('connect', connectMe);

  // the connect function. This is local to the discovery function
  // because it needs the peripheral to discover services:
  function connectMe() {
    noble.stopScanning();
    console.log('Checking for services on ' + peripheral.advertisement.localName);
    // start discovering services:
    // you could also use peripheral.discoverSomeServicesAndCharacteristics here,
    // and filter by the target service and characteristic:
    peripheral.discoverAllServicesAndCharacteristics(exploreMe);
  }

  // when a peripheral disconnects, run disconnectMe:
  peripheral.on('disconnect', disconnectMe);
}

// the service/characteristic exploration function:
function exploreMe(error, services, characteristics) {
  console.log('services: ' + services);
  console.log('characteristics: ' + characteristics);

  for (c in characteristics) {
    // since there's only one characteristic, start it blinking:
    startBlink(characteristics[c]);
  }
}

function startBlink(characteristic) {
  // this function reads the characteristic:
  function blink() {
    characteristic.read(changeState);
  }

  // this function changes the characteristic once it's read:
  function changeState(error, data) {
    if (error) throw error;
    var ledState = data[0];
    // if the current state is 1, make it 0, and vice versa:
    data[0] = !ledState;
    // write it back out to the peripheral:
    characteristic.write(data, false, callback);
  }

  // this function calls the blink function again
  // once the characteristic has been successfully read:
  function callback(data, error) {
    if (error) throw error;
    // wait 50ms, then call blink() again:
    interval = setTimeout(blink, 50);
  }

  // this makes the first call to start the blink loop
  blink();
}


function disconnectMe() {
  console.log('peripheral disconnected');
  // exit the script:
  process.exit(0);
}

/* ----------------------------------------------------
The actual commands that start the program are below:
*/

noble.on('stateChange', scan);  // when the BT radio turns on, start scanning
noble.on('discover', findMe);   // when you discover a peripheral, run findMe()
