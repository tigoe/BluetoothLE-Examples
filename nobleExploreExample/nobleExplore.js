
/*
  Noble explore example
  
  This example uses Sandeep Mistry's noble library for node.js to
  create a central server that reads and connects to BLE peripherals. 
  
  created 21 Jan 2014
  by Maria Paula Saba
*/

var noble = require('noble');   //noble library
var myPeripheral;

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
  //if(peripheral.uuid == "add_your_peripheral_id_here"){

  if(peripheral.uuid == "d3d127614b9d44478f0970e2844d2a87"){
    console.log("found my device");
    //save peripheral data to a variable
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
  
  //function to loop through all services and characteristics available
  discoverServicesAndCharacteristics();
  
  //console log signal strengh every second
  //setInterval(updateRSSI, 60);

  //when disconnected, run this function
  myPeripheral.on('disconnect', disconnectPeripheral);

};

function updateRSSI(){
    myPeripheral.updateRssi(function(error, rssi){

    //rssi are always negative values 
    if(rssi < 0)console.log(rssi);
  }); 
}

function discoverServicesAndCharacteristics(error, services){
      //discover BLE services
      //if you know a specific service UUID, you can pass it as first parameter
      //of the discoverServices function (between []).
      myPeripheral.discoverServices([], discoverServices);
}

function discoverServices(error, services){
       console.log("discovered "+ services.length + " services");

       //for every services, discover its characteristics
       //if you know a specific characteristic UUID, you can pass it as first parameter
       //of the discoverCharacteristics function (between []).
       for(var i = 0; i < services.length; i++){

          var service = services[i];
          var serviceInfo = service.uuid;

          if (service.name) {
            serviceInfo += ' (' + service.name + ')';
          }
          console.log(serviceInfo);

          service.discoverCharacteristics([], discoverCharacteristic);
        }
}

function discoverCharacteristic(error, characteristics){
       console.log("discovered "+ characteristics.length + " characteristics");

       //now read each characteristic 
        for(var i = 0; i < characteristics.length; i++){   
             
            var characteristic = characteristics[i];
            var characteristicInfo = '  ' + characteristic.uuid;

            if (characteristic.name) {
              characteristicInfo += ' (' + characteristic.name + ')';
            }

            //console.log(characteristicInfo);

            characteristic.read(function(error, data){
                  console.log(characteristicInfo+", data: "+ data); 
            });
       }
}


function disconnectPeripheral(){
      console.log('peripheral disconneted');

      //stop calling updateRSSI
      clearInterval(updateRSSI);

      //restart scan
      noble.startScanning();
}