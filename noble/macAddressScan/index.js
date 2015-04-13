/*
  MAC Address example

  This example uses Sandeep Mistry's noble library for node.js to
  scan for peripherals and report their MAC address and signal strength.
  OSX and iOS obfuscate the MAC address, so Sandeep added the .address
  feature to de-obfuscate it. This example is a test to see if it works

  created 13 April 2015
  by Tom Igoe
*/
var noble = require('noble');		// import the noble library

//Bluetooth ON or OFF
noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {		// if Bluetooth is on
    console.log("start scanning");
    noble.startScanning();			// start scanning
  } else {							// if Bluetooth is off
    noble.stopScanning();			// stop scanning
    console.log("Please check that Bluetooth is turned on.");
  }
});

// runs when a peripheral is discovered from a scan:
noble.on('discover', function(peripheral) {
	// bundle the name, UUID, MAC address,
  // and received signal strength up in a JSON object:
	var peripheralData = {
		"name": peripheral.advertisement.localName,
		"uuid": peripheral.uuid,
    "MAC address": peripheral.address,
		"rssi": peripheral.rssi
	}
	// print it out:
	console.log(JSON.stringify(peripheralData));
});
