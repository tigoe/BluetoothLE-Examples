/*
Peripheral example

runs Bluetooth radio as a Bluetooth 4.0 peripheral with one service.
Service has a single characteristic, which has a single-byte value.

created 16 Apr 2015
by Tom Igoe
*/

var bleno = require('bleno');

var PrimaryService = bleno.PrimaryService;    // instantiate PrimaryService
var Characteristic = bleno.Characteristic;    // instantiate PrimaryCharacteristic

var name = 'myService';                       // peripheral's localName
var data = new Buffer(1);   // Buffer for characteristic value
data[0] = 22;               // actual value of the characteristic

// define the service's characteristic:
var myCharacteristic = new Characteristic({
  uuid: 'A495FF25-C5B1-4B44-B512-1370F02D74DE', //  characteristic UUID; chosen randomly
  properties: [ 'notify','read' ],              //  characteristic properties
  value: data                                   // characteristic value
});

// define the service:
var myService = new PrimaryService({
  uuid: 'A495FF20-C5B1-4B44-B512-1370F02D74DE', // service UUID; chosen randomly
  characteristics: [ myCharacteristic]          // service characteristic
});

// event handler for Bluetooth state change:
bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising(name, [myService.uuid]);
    console.log('advertising ' + name);
  } else {
    bleno.stopAdvertising();
  }
});

// event handler for advertising start:
bleno.on('advertisingStart', function(error) {
  console.log('Bluetooth on. advertisingStart: ')
  if (error) {
    console.log('error ' + error);
  }  else {
    // if advertising start succeeded, start the services
    console.log('success');
    bleno.setServices([myService], function(serviceError){
      console.log('Starting services: ')
      if (serviceError) {
        console.log('error ' + serviceError);
      } else {
        console.log('service set.');
      }
    });
  }
});
