var BleUart = require('./ble-uart');
var bleSerial = new BleUart('nordic');
var bleData;

var express = require('express');	// using the express framework
var app = express();							// initalize express


// serve static pages from public/ directory:
app.use('/',express.static('public'));

// if a client requests /data, return the data:
app.get('/data', function(request, response){
  console.log("Someone asked for the data");
  response.end(bleData);
})

// this function gets called when new data is received from
// the Bluetooth LE serial service:
bleSerial.on('data', function(data){
  bleData = data;
  console.log("Got new data: " + data);
});

// this function gets called when the program
// establishes a connection with the remote BLE radio:
bleSerial.on('connected', function(data){
  console.log("Connected to BLE. Sending a hello message");
  bleSerial.write("Hello BLE!");
});

// thus function gets called if the radio successfully starts scanning:
bleSerial.on('scanning', function(status){
  console.log("radio status: " + status);
});

// start the server listening:
app.listen(8080);
