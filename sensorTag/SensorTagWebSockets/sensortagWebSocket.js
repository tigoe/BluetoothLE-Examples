/*
sensorTag WebSocket example

This example uses Sandeep Mistry's sensortag library for node.js to
read data from a TI sensorTag and send it to webSocket clients.

The 'public' directory contains a p5.js sketch and HTML page that will connect to this server and put the sensor data in the HTML page.

created 11 Nov 2017
by Tom Igoe
*/
var WebSocketServer = require('ws').Server;   // webSocket library
var SensorTag = require('sensortag');					// sensortag library

// configure the webSocket server:
const wssPort = 8081;             // port number for the webSocket server
const wss = new WebSocketServer({port: wssPort}); // the webSocket server
var clients = new Array;         // list of client connections
var tags = new Array;						 // list of tags connected

// ------------------------ sensorTag functions
function handleTag(tag) {
	console.log('new tag connected');
	broadcast('new tag connected');
	var tagRecord = {};		// make an object to hold sensor values
	tags.push(tagRecord);	// add it to the tags array

	function disconnect() {
		// get the tag's position in the array and delete it from the array:
		var position = tags.indexOf(tagRecord);
		tags.splice(position, 1);
		console.log('tag disconnected!');
		broadcast('tag disconnected');
	}
	/*
	This function enables and configures the sensors, and
	sets up their notification listeners. Although it only shows
	accelerometer data here, you could duplicate this pattern
	with any of the sensors.
	*/
	function enableSensors() {		// attempt to enable the sensors
		console.log('enabling sensors');
		// read the unique ID of this tag:
		tag.readSystemId(readID);
		// enable sensor:
		tag.enableAccelerometer();
		// make an object to hold this sensor's values:
		tagRecord.accel = {sensor: 'accelerometer'};
		// set its period:
		tag.setAccelerometerPeriod(10);
		// then turn on notifications:
		tag.notifyAccelerometer();
	}

	function readAccelerometer (x, y, z) {
		// read the three values and save them in the
		// sensor value object:
		tagRecord.accel.x = x;
		tagRecord.accel.y = y;
		tagRecord.accel.z = z;
		// broadcast the latest values to any webSocket clients:
		broadcast(tagRecord);
	}

	// add the tag ID to the tagRecord, so webSocket clients can get it
	function readID(error, systemID) {
		if (!error) {
			tagRecord.serialNumber = systemID;
		} else {
			console.log(error);
		}
	}

	// Now that you've defined all the functions, start the process.
	// connect to the tag and set it up:
	tag.connectAndSetUp(enableSensors);
	// set a listener for when the accelerometer changes:
	tag.on('accelerometerChange', readAccelerometer);
	// set a listener for the tag disconnects:
	tag.on('disconnect', disconnect);
}

// listen for tags and handle them when you discover one:
SensorTag.discoverAll(handleTag);

// ------------------------ webSocket Server functions
function handleConnection(client) {
	console.log("New Connection");        // you have a new client
	clients.push(client);    // add this client to the clients array

	function endClient() {
		// when a client closes its connection
		// get the client's position in the array
		// and delete it from the array:
		var position = clients.indexOf(client);
		clients.splice(position, 1);
		console.log("connection closed");
	}

	// if a client sends a message, print it out:
	function clientResponse(data) {
		console.log(data);
	}

	// set up client event listeners:
	client.on('message', clientResponse);
	client.on('close', endClient);
}

// This function broadcasts messages to all webSocket clients
function broadcast(data) {
	// iterate over the array of clients & send data to each
	for (c in clients) {
		clients[c].send(JSON.stringify(data));
	}
}

// listen for clients and handle them:
wss.on('connection', handleConnection);
