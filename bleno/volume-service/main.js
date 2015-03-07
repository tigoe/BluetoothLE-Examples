var keypress = require('keypress');
var bleno = require('bleno');

var Volume = require('./volume');
var VolumeService = require('./volume-service');

var volume = new Volume();

// Bleno service
var volumeService = new VolumeService(volume);

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising('VolumeService', [volumeService.uuid]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    
    if (!error) {
        bleno.setServices([volumeService]);
        console.log('Adjust the volume with the up and down arrow keys');
        console.log('or connect with your phone and set via bluetooth.');
    } 
});

// Keypresses adjusts volume
keypress(process.stdin);

process.stdin.on('keypress', function (ch, key) {
    if (key && key.name === 'up') {
        volume.up();
    } else if (key && key.name === 'down') {
        volume.down();
    } else if (key && key.name === 'c' && key.ctrl === true) {
        // TODO disconnect bluetooth
        process.exit();
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();