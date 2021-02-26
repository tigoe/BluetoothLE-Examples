/*
A Web Bluetooth connection and read example

Uses the Web Bluetooth API to make Bluetooth connections 
to a plain JavaScript page. Modified from the p5.ble 
getting started example at https://itpnyu.github.io/p5ble-website/docs/getstarted.html

This script works with the ArduinoBLE library example called ButtonLED: 
https://github.com/arduino-libraries/ArduinoBLE/tree/master/examples/Peripheral/ButtonLED

Library documentaton:
https://www.arduino.cc/en/Reference/ArduinoBLE

created 25 Feb 2021 
by Tom Igoe
*/

// advertised service UUID of the  to search for:
const serviceUuid = '19b10010-e8f2-537e-4f6c-d104768a1214';
// DOM elements to interact with:
let connectButton;
let dataDiv;
let deviceDiv;
let myDevice;

// this function is called when the page is loaded. 
// event listener functions are initialized here:
function setup() {
  // put the DOM elements into global variables:
  connectButton = document.getElementById('connect');
  connectButton.addEventListener('click', connectToBle);
  deviceDiv = document.getElementById('device');
  dataDiv = document.getElementById('data');
}

// connect to the peripheral:
function connectToBle() {
  // options let you filter for a peripheral 
  // with a particular service UUID:
  let options = {
    filters: [{ 
      services: [serviceUuid] 
    }]
  };
  // start scanning:
  navigator.bluetooth.requestDevice(options)
  // when you get a device:
    .then(device => {
      myDevice = device;
      deviceDiv.innerHTML = "Device name: " + device.name;
      deviceDiv.innerHTML += "<br>Service UUID: " + serviceUuid;
      return device.gatt.connect();
    })
    // get the primary service:
    .then(server => server.getPrimaryService(serviceUuid))
    .then(service => service.getCharacteristics())
    // get the characteristics of the service:
    .then(characteristics => readCharacteristics(characteristics))
   // if there's an error:
    .catch(error => console.log('Connection failed!', error));

  function readCharacteristics(characteristics) {
    // add the characterisitic UUID to the device div:
    deviceDiv.innerHTML += "<br>characteristic UUID: " + characteristics[1].uuid;
    // subscribe to the button characteristic:
    characteristics[1].addEventListener('characteristicvaluechanged', readData);
    characteristics[1].startNotifications();
    // Get an initial value:
    return characteristics[1].readValue();
  }
}

// read incoming data:
function readData(event, error) {
  if (error) {
    console.log('error: ', error);
    return;
  }
  // get the data  from the peripheral.
  // it's declared as a byte in the Arduino sketch,
  // so look for an unsigned int, 8 bits (Uint8):
  let sensorVal = event.target.value.getUint8(0);
  dataDiv.innerHTML = 'value: ' + sensorVal;
}

// This is a listener for the page to load.
// This is the command that actually starts the script:
window.addEventListener('DOMContentLoaded', setup);