
/*
BLE control of a RoboSmart Bluetooth light bulb.
Thanks to Don Coleman for the structure.

created 8 Feb 2017
by Tom Igoe
*/

var noble = require('noble');   // noble library
var lampUuid = 'ff10';          // the lamp's service uuid
var switchUuid = 'ff11';        // the switch characteristic uuid
var brightnessUuid = 'ff12';    // the brightness characteristic uuuid
var lamp;                       // the peripheral once you connect

// The scanning function
function scan(state){
  if (state === 'poweredOn') {    // if the radio's on, scan for lamp service
    noble.startScanning([lampUuid], false);
    console.log("Started scanning");
  } else {                        // if the radio's off, let the user know:
    noble.stopScanning();
    console.log("Is Bluetooth on?");
  }
}

// the main discover function
function findLamp(peripheral) {
  console.log('discovered ' + peripheral.advertisement.localName);
  peripheral.connect();     // start connection attempts
  lamp = peripheral;        // save peripheral in a global variable
  peripheral.on('connect', connectToLamp);  // listener for connection
}

// the connect function. This is local to the discover function
// because it needs the peripheral to discover services:
function connectToLamp() {
  noble.stopScanning();
  console.log('Checking for characteristics on ' +  lamp.advertisement.localName);
  // start discovering services:
  lamp.discoverSomeServicesAndCharacteristics([lampUuid],[switchUuid, brightnessUuid], exploreLamp);

  // when a peripheral disconnects, run disconnectMe:
  lamp.on('disconnect', disconnectMe);
}


// the service/characteristic exploration function:
function exploreLamp(error, services,characteristics) {
  var lampState = 0;
  var brightness = 0;
  var difference = -1;
  console.log("found");
  console.log('services: ' + services);
  console.log('characteristics: ' + characteristics);

  // switch on-off is the first characteristic:
  var switchCharacteristic =  characteristics[0];
  var brightnessCharacteristic = characteristics[1];

  //setInterval(blink, 1000);   // call blink once per second
  fade(); // call fade once. After that it calls itself as a callback

  function blink(){
    var data = new Buffer(1); // .write() requires a Buffer
    lampState = !lampState;   // invert lampState
    data[0] = lampState;      // put lampState in the buffer
    // write to the characteristic, without a callback:
    switchCharacteristic.write(data, true);
  }

  function fade(){
    var data = new Buffer(1); // .write() requires a buffer
    // if brightness is at either extreme:
    if (brightness == 0 || brightness == 255) {
      difference = -difference; // change gthe sign on difference
    }
    // add difference to brightness:
    brightness = brightness + difference;
    data[0] = brightness;     // put brightness in the buffer
    console.log('Brightness: ' + brightness);
    // write to the characteristic, with a callback:
    brightnessCharacteristic.write(data, false, fade);
  }

}

// disconnect callback function:
function disconnectMe() {
  console.log('peripheral disconnected');
  process.exit(0);    // exit the scrip
}

/* ----------------------------------------------------
The actual commands that start the program are below:
*/

noble.on('stateChange', scan);  // when the BT radio turns on, start scanning
noble.on('discover', findLamp);   // when you discover peripheral, run findMe()
