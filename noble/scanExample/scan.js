
/*
  Noble simple scan example

  This example uses Sandeep Mistry's noble library for node.js to
  create a central server that reads BLE peripherals advertisements.

  created 21 Jan 2015
  by Maria Paula Saba
*/

var noble = require('noble');   //noble library

// here we start scanning. we check if Bluetooth is on
noble.on('stateChange', scan);

function scan(state){
  if (state === 'poweredOn') {
    noble.startScanning();
    console.log("Started scanning");
  } else {
    noble.stopScanning();
    console.log("Is Bluetooth on?");
  }
}


// for every peripheral we discover, run this callback function
noble.on('discover', foundPeripheral);

function foundPeripheral(peripheral) {

  //uncomment the line below if you want to see all data provided.
  //console.log(peripheral);

  //here we output the some data to the console.
  console.log('\n Discovered new peripheral with UUID ' + peripheral.uuid+ ':');
  console.log('\t Peripheral Bluetooth address:' + peripheral.address);
  
  if(peripheral.advertisement.localName){
    console.log('\t Peripheral local name:' + peripheral.advertisement.localName);
  }
  if(peripheral.rssi) {
    console.log('\t RSSI: ' + peripheral.rssi); //RSSI is the signal strength
  }
  if(peripheral.state){
   console.log('\t state: ' + peripheral.state);
  }
  if(peripheral.advertisement.serviceUuids.length){
  console.log('\t Advertised services:' + JSON.stringify(peripheral.advertisement.serviceUuids));
  }

  var serviceData = peripheral.advertisement.serviceData;
  if (serviceData && serviceData.length) {
    console.log('\t Service Data:');
    for (var i in serviceData) {
      console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
    }
  }
  if (peripheral.advertisement.manufacturerData) {
    console.log('\t Manufacturer data: ' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
  }
  if (peripheral.advertisement.txPowerLevel !== undefined) {
    console.log('\t TX power level: ' + peripheral.advertisement.txPowerLevel);
  }

};
