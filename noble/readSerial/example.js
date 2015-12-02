var BleUart = require('./ble-uart');

// use a predefined UART service (nordic, redbear, laird, bluegiga)
var bleSerial = new BleUart('nordic');

// optionally define a custom service
// var uart = {
//   serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
//   txUUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
//   rxUUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
// }
// var bleSerial = new BleUart('foo', uart);

// this function gets called when new data is received from
// the Bluetooth LE serial service:
bleSerial.on('data', function(data){
  console.log("Got new data: " + String(data));
});

// this function gets called when the program
// establishes a connection with the remote BLE radio:
bleSerial.on('connected', function(data){
  console.log("Connected to BLE. Sending a hello message");
  bleSerial.write("Hello BLE!");
  //bleSerial.write([1,2,3,4,5]);
  //bleSerial.write(new Uint8Array([5,4,3,2,1]));
  //bleSerial.write(new Buffer([6,7,8,9]))
});

// thus function gets called if the radio successfully starts scanning:
bleSerial.on('scanning', function(status){
  console.log("radio status: " + status);
})
