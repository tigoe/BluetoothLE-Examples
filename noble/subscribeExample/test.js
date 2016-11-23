
/*
Noble Bluetooth LE scanner
context: node.js
*/

// include libraries:
var noble = require('noble');
var device;                   // the peripheral to which you're connecting
var timeCharacteristic = {    // the characteristic that you care about
  uuid: '1cbffaa8b17e11e680f576304dec7eb7'
};

//  callback function for noble stateChange event:
function scanForPeripherals(state){
  if (state === 'poweredOn') {                // if the Bluetooth radio's on,
    noble.startScanning(['1cbffaa8b17d11e680f576304dec7eb7'], false); // scan for service
    console.log("Started scanning");
  } else {                                    // if the radio's off,
    console.log("Bluetooth radio not responding. Ending program.");
    process.exit(0);                          // end the program
  }
}

// callback function for noble discover event:
function readPeripheral (peripheral) {
  device = peripheral;    // save the peripheral to a global variable

  console.log('discovered ' + device.advertisement.localName);
  console.log('signal strength: ' + device.rssi);
  console.log('device address: ' + device.address);

  noble.stopScanning();                // stop scanning
  device.connect();                    // attempt to connect to peripheral
  device.on('connect', readServices);  // read services when you connect
}

// the readServices function:
function readServices() {
  // Look for services and characteristics.
  // Call the explore function when you find them:
  device.discoverAllServicesAndCharacteristics(explore);
}

// the service/characteristic explore function:
function explore(error, services, characteristics) {
  console.log("explore");
  // list the services and characteristics found:
  console.log('services: ' + services);
  console.log('characteristics: ' + characteristics);

  // check if each characteristic's UUID matches the shutter UUID:
  for (c in characteristics) {
    // if the uuid matches, copy the whole characteristic into timeCharacteristic:
    if (characteristics[c].uuid === timeCharacteristic.uuid){
      timeCharacteristic = characteristics[c];
      timeCharacteristic.subscribe(listen);
    }
  }
}

// listen to the characteristic
// TODO: can we inherit the characteristic from the subscription call?
function listen() {
  // set a listener for the characteristic:
  timeCharacteristic.on('data', readData);

  function readData(data) {
    console.log(data.readIntLE());  // read buffer as an int
  }
}

// Scan for peripherals with the camera service UUID:
noble.on('stateChange', scanForPeripherals);
noble.on('discover', readPeripheral);
