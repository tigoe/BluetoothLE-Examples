//importing node modules (libraries)
var noble = require('noble'),
	express = require('express'),
    http = require('http'),
    async = require('async'),
    open = require("open");

// create a server calling the function onRequest
var app = express();
var server = http.createServer(app); 

// start the server 
server.listen(8080);
console.log('Server is listening to http://localhost on port 8080');
open("http://localhost:8080");

//read index.html page
app.use('/public/js', express.static(__dirname + '/public/js'));
app.use('/public/css', express.static(__dirname + '/public/css'));

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});



var peripherals = [];
var connected = "";

//Bluetooth ON or OFF
noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    console.log("start scanning");
    noble.startScanning();
  } else {
    noble.stopScanning();
    console.log("stop scanning, is Bluetooth on?");
  }
});


noble.on('discover', function(peripheral) {
	var peripheralData = {
		"name": peripheral.advertisement.localName,
		"uuid": peripheral.uuid
	}


    var newPeripheral = true;

    peripherals.forEach(function(element){
    	if(element.uuid === peripheral.uuid){
    		newPeripheral = false;
    	}
    });

    if(newPeripheral){
		//save to array in server
		peripherals.push(peripheral);

		//send peripheral discovered to client
		io.sockets.emit('peripheral', peripheralData);
	}
});


function connectPeripheral(peripheral) {
	noble.stopScanning();

	//connect to peripheral
    peripheral.connect(function(error){
        console.log('connected to peripheral');  
        connected = peripheral.uuid;

		//log some data from it
		logData(peripheral);
		
		//start reading sensors
		//startDataAcquisition();  

		peripheral.once('disconnect', function() {
 		console.log('peripheral disconneted');
 		connected = "";

        io.sockets.emit('disconnectedPeripheral', peripheral.uuid);
        noble.startScanning();
		});
  	});
}


function logData(peripheral){
    var advertisement = peripheral.advertisement;
    var localName = advertisement.localName;
    var txPowerLevel = advertisement.txPowerLevel;
    var manufacturerData = advertisement.manufacturerData;
    console.log("Peripheral "+localName + " with UUID " + peripheral.uuid  + " found");
    console.log("TX Power Level "+ txPowerLevel + ", Manufacturer "+ manufacturerData);

    var data = "Peripheral "+localName + " with UUID " + peripheral.uuid  + " found. <br/> TX Power Level "+ txPowerLevel + ", Manufacturer "+ manufacturerData;

    io.sockets.emit('dataLogged',data)
}




// WebSocket Portion
var io = require('socket.io').listen(server);

// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function. This object has an id

	function (socket) {	
		//check if clients are connected
		console.log("We have a new client: " + socket.id);	

		socket.on('scan', function() {
			// Request to rescan
			peripherals = [];
 		    console.log("start scanning client");
			noble.startScanning();
		});
		
		socket.on('explorePeripheral', function(data) {
			//find the right peripheral to connect
			peripherals.forEach(function(element){
				if(element.uuid === connected){
					element.disconnect();
				}

		    	else if(element.uuid === data){
		    		connectPeripheral(element);
		    	}

	    	});


		});

		socket.on('disconnectPeripheral', function(data) {
			//find the right peripheral to disconnect
			peripherals.forEach(function(element){
		    	if(element.uuid === data){
		    		element.disconnect();
    			    console.log('peripheral disconnet requested by client');
		    	}
	    	});


		});


		socket.on('disconnect', function() {
			//check if clients have disconnected
			//console.log("Client has disconnected");
		});
	}
);