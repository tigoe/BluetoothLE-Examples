
/*
  Noble explore-async example
  
  This example uses Sandeep Mistry's noble library for node.js to
  create a central server that reads and connects to BLE peripherals 
  to read all services and characteristics available using async, a module 
  to manage asynchronous operations in Node.
  Learn more about async here: https://github.com/caolan/async 
  and http://justinklemm.com/node-js-async-tutorial/
  
  created 26 Jan 2015
  by Maria Paula Saba
*/

var noble = require('noble');   //noble library
    async = require('async');   //async library

var myPeripheral;
var peripheralUUID = "726c753237974031ad9c3eae0e068749"; //"add_your_peripheral_UUID_here";

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
  if(peripheral.uuid == peripheralUUID){
    console.log('found device with UUID ' + peripheral.uuid);
    
	//console log device basic information
	var advertisement = peripheral.advertisement;
    var localName = advertisement.localName;
    var txPowerLevel = advertisement.txPowerLevel;
    var manufacturerData = advertisement.manufacturerData;
    var serviceData = advertisement.serviceData;
    var serviceUuids = advertisement.serviceUuids;

    if (localName) console.log('  Local Name        = ' + localName);
    if (txPowerLevel) console.log('  TX Power Level    = ' + txPowerLevel);
	if (manufacturerData) console.log('  Manufacturer Data = ' + manufacturerData.toString('hex'));
    if (serviceData) console.log('  Service Data      = ' + serviceData);
    if (localName) console.log('  Service UUIDs     = ' + serviceUuids);
	  
	//stop scanning for other devices  
    noble.stopScanning();
	  
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
    console.log("services and characteristics from "+myPeripheral.advertisement.localName + " :");
  
    //loop through all services and characteristics available
    myPeripheral.discoverServices([], function(error, services) {
      //variable to keep count of the services we've been through
	  var serviceIndex = 0;
	  
	  //while function for async for looping through services
      async.whilst(
		//test if it should keep running, i.e. if service index is less than services available
		function () { return (serviceIndex < services.length); },
		  
		//function to run  
        function(callback) {
		  //get service information	and console log
          var service = services[serviceIndex];
          var serviceInfo = 'Service: '+ service.uuid;
	
          if (service.name) {
            serviceInfo += ' (' + service.name + ')';
          }
          console.log(serviceInfo);

		  //read characteristics from this service
          service.discoverCharacteristics([], function(error, characteristics) {
            //variable to keep count of the characteristics we've been through
            var characteristicIndex = 0;
			  
  	       //now loop through all characteristics
            async.whilst(
			    // it should keep running while characteristic index is less than characteristics available	
                function () { return (characteristicIndex < characteristics.length); },
				
			    //function to run	
                function(callback) {
				//get characteristic information 
                var characteristic = characteristics[characteristicIndex];
				  
                var characteristicInfo = '  Characteristic: ' + characteristic.uuid;

                if (characteristic.name) {
                  characteristicInfo += ' (' + characteristic.name + ')';
                }
				  
				//Run the functions below in series, each one running once the previous function has completed.
                async.series([
					
				  //async function 1
                  function(callback) {
					  
					//discover characteristic descriptors  
                    characteristic.discoverDescriptors(function(error, descriptors) {
						
					  //async detect runs a callback function whenever a value in array passes the test
                      async.detect(
						//array containting descriptors of the characteristic  
                        descriptors,
						  
						//test function, is descriptor uuid equals to '2901'(GATT number for user descriptors)  
                        function(descriptor, callback) { return callback(descriptor.uuid === '2901'); },
						  
						//callback function  
                        function(userDescriptionDescriptor){
							
						  //read values from descriptor	and add to characteristic info
                          if (userDescriptionDescriptor) {
                            userDescriptionDescriptor.readValue(function(error, data) {
                              if (data) {
                                characteristicInfo += ' (' + data.toString() + ')';
                              }
                              callback();
                            });//close userDescriptionDescriptor.readValue function
                          } else {
                            callback();
                          }
                        } //closes callback function;
                      ); //closes async detect
                    }); //closes characteristic.discoverDescriptors function
                  }, //closes async function 1
				  //async function 2
                  function(callback) {
                        characteristicInfo += '\n    properties  ' + characteristic.properties.join(', ');

                    if (characteristic.properties.indexOf('read') !== -1) {
                      characteristic.read(function(error, data) {
                        if (data) {
                          var string = data.toString('ascii');

                          characteristicInfo += '\n    value       ' + data.toString('hex') + ' | \'' + string + '\'';
                        }
                        callback();
                      }); //closes characteristic.read function
                    } else {
                      callback();
                    }
                  }, //closes async function 2
				  //async function 3 - last one as there is no callback function
                  function() {
                    console.log(characteristicInfo);
                    characteristicIndex++;
                    callback();
                  }
                ]); //close async series	
               },
              function(error) {
                serviceIndex++;
                callback();
              }
			); //closes async characteristic loop
          }); // closes service.discoverCharacteristic function
        }, //closes async whilst services callback function
        //error function -  disconnect if get an error
		function (err) {			
          myPeripheral.disconnect();
        });//closes async whilst services
		//console.log("done exploring services and characteristics");
    }); //closes peripheral.discoverServices function
 
  //when disconnected, run this function
  myPeripheral.on('disconnect', disconnectPeripheral);

}; //closes explorePeripheral function

function disconnectPeripheral(){
      console.log('peripheral disconneted');
      console.log('shutting down program');
      process.exit(0);

}




