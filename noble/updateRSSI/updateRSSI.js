
/*
  Noble update RSSI example
  
  This example uses Sandeep Mistry's noble library for node.js to
  create a central server that connects and reads the signal strengh
  from BLE peripherals according to their local name. 
  
  created 21 Jan 2015
  by Maria Paula Saba
*/

var noble = require('noble');   //noble library

var myPeripheral;
var peripheralName = "LED";

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

noble.on('discover', discoverPeripherals);


function discoverPeripherals(peripheral) {
  //here we check if this is the peripheral we want
  if(peripheral.advertisement.localName == peripheralName){
    console.log("found my device");
	  
    //stop scanning for other devices
    noble.stopScanning();
	  
	  //save peripheral  to a variable
    myPeripheral = peripheral;

    //connect to peripheral
    peripheral.connect(explorePeripheral);
  }
  else{
    console.log("found a different device with UUID "+ peripheral.uuid);
  }
};


function explorePeripheral(error) {
  console.log("connected to "+myPeripheral.advertisement.localName);
   
  //console log signal strengh every second
  setInterval(updateRSSI, 60);

  //when disconnected, run this function
  myPeripheral.on('disconnect', disconnectPeripheral);

};

function updateRSSI(){
    myPeripheral.updateRssi(function(error, rssi){

    //rssi are always negative values 
    if(rssi < 0) console.log("here is my RSSI: "+rssi);
  }); 

}


function disconnectPeripheral(){
      console.log('peripheral disconneted');

      //stop calling updateRSSI
      clearInterval(updateRSSI);

      //restart scan
      noble.startScanning();
}