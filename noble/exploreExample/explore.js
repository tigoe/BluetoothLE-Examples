
/*
  Noble explore characteristics  example
  
  This example uses Sandeep Mistry's noble library for node.js to
  create a central server that blinks a LED (writes 0 and 1) in a peripheral with name LED
  
  created 21 Feb 2015
  by Maria Paula Saba
*/

var noble = require('noble');   //noble library

var myPeripheral;
var peripheralName = "LED";
var blink = true;
var interval;

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
   
  //run the blink function every second
  interval = setInterval(blinkLED, 1000);


  //when disconnected, run this function
  myPeripheral.on('disconnect', disconnectPeripheral);

};

function blinkLED(){
    myPeripheral.discoverServices([], function(error, services) {
          //console.log(services);    
          if(services.length){
                var service = services[0];

                //discover service characteristic
                service.discoverCharacteristics([], function(error, characteristics) {
                      //console.log('discovered characteristic');
                      var characteristic = characteristics[0];  

                      //write 1 to light up led
                      if(blink){
                          characteristic.write(new Buffer([0x01]), false, function(error) {
                          console.log('wrote 1');
                           }); 


                        }
                      else{
                          characteristic.write(new Buffer([0x00]), false, function(error) {
                          console.log('wrote 0');
                           });
                      } 

                      characteristic.read(function(error, data){
                        console.log(data[0]);
                        if(data[0] == 1)  blink = false;
                        else blink = true;
                      });

                });
          }
      });
}

function disconnectPeripheral(){
      console.log('peripheral disconneted');

      //stop calling updateRSSI
      clearInterval(interval);

      //restart scan
      noble.startScanning();
}