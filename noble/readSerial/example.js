var BleUart = require('./ble-uart');
var bleSerial = new BleUart('6e400001b5a3f393e0a9e50e24dcca9e');

// this function gets called when new data is received from
// the Bluetooth LE serial service:
bleSerial.on('data', function(data){
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
})
