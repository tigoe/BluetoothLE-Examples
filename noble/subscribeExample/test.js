
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
    noble.stopScanning();                     // stop scanning
    console.log("Bluetooth radio not responding. Ending program.");
    process.exit(0);                          // end the program
  }
}

// callback function for noble discover event:
function readPeripheral (peripheral) {
  console.log('discovered ' + peripheral.advertisement.localName);
  console.log('signal strength: ' + peripheral.rssi);
  device = peripheral;    // save the peripheral to a global variable

  noble.stopScanning();                 // stop scanning
  peripheral.connect();                 // attempt to connect to peripheral
  peripheral.on('connect', readServices);  // read services when you connect
}

// the readServices function:
function readServices() {
  console.log('Checking services: ' + device.advertisement.localName);
  // Look for services and characteristics.
  // Call the explore function when you find them:
  device.discoverAllServicesAndCharacteristics(explore);
}

// the service/characteristic explore function.
// depends on the of services & characteristics, not the peripheral,
// so it doesn't have to be local to readPeripheral():
function explore(error, services, characteristics) {
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
function listen() {
  timeCharacteristic.on('data', readData);
  function readData(data) {
    console.log(data[0]);
    device.disconnect();
  }
}

// Scan for peripherals with the camera service UUID:
noble.on('stateChange', scanForPeripherals);
noble.on('discover', readPeripheral);
