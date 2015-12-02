var BleUart = require('./ble-uart');
var bleSerial = new BleUart('nordic');
var bleData;

var express = require('express');	// using the express framework
var app = express();							// initalize express


// serve static pages from public/ directory:
app.use('/',express.static('public'));

// if a client requests /data and follows it with a string of data,
// send the string out the BLE radio:
app.get('/data/:data', function(request, response){
  if (request.params.data) {
    if (bleSerial.connected) {
      console.log("writing to BLE");
      var output = String(request.params.data);
      bleSerial.write(output);
    }
  }
  console.log("Someone sent data");
  response.end("latest data from web client: " + output);
});

// if a client requests /data return the data:
app.get('/data/', function(request, response){
  console.log("Someone asked for the data");
  response.end("latest data from BLE radio: " + bleData);
});
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
