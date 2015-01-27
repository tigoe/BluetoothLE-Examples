/*
  Noble stickNfind scan example
  
  This example uses Sandeep Mistry's noble library for node.js to
  create a central server that finds stickNfind peripherals.
  
  created 26 Jan 2015
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
noble.on('discover', foundStickNfind);

function foundStickNfind(peripheral) {
  
    if(peripheral.advertisement.localName === "StickNfind"){
       console.log('\n\t found StickNfind UUID:' + peripheral.uuid);   
  
	  if(peripheral.rssi) {
		console.log('\t RSSI: ' + peripheral.rssi); //RSSI is the signal strength
	  }
	  if(peripheral.state){
	   console.log('\t state: ' + peripheral.state);    
	  }
    }
	else{
       //console.log('\n\t found another device with UUID:' + peripheral.uuid);   


	}

};
