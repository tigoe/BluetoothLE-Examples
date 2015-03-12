/*
  BLE Sensor

  Read values from Maria Paula Saba's BLE Sensor service
  https://github.com/tigoe/BluetoothLE-Examples/blob/master/arduinoBLEperipheral/sensorExample/sensorExample.ino

*/
/* global startPage, deviceList, refreshButton */
/* global connectedPage, sensorValue, disconnectButton */
/* global ble  */
/* jshint browser: true , devel: true*/
'use strict';

// BLE service details
var sensor = {
    service: '19b10000-e8f2-537e-4f6c-d104768a1214',
    value: '19b10001-e8f2-537e-4f6c-d104768a1214'
};

var app = {

    initialize: function() {
        this.bindEvents(); //binding event listeners to DOM in the app
        connectedPage.hidden = true; //hides the HTML elements for the second page
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false); //runs onDeviceReady function whenever the device is ready (loaded)
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false); //on touch of the Refresh button, runs refreshDeviceList function
        deviceList.addEventListener('touchstart', this.connect, false); //on touch of device list, connect to device
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
    },

    onDeviceReady: function() {
        app.refreshDeviceList();
    },

    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empties the list
        // scan for devices with the sensor service
        ble.scan([sensor.service], 5, app.onDiscoverDevice, app.onError);
    },

    onDiscoverDevice: function(device) {
        //creates a HTML element to display in the app
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' + 'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' + device.id;
        listItem.innerHTML = html;
        listItem.dataset.deviceId = device.id; //save the device ID in the DOM element
        listItem.setAttribute("class", "result"); //give the element a class for css purposes
        deviceList.appendChild(listItem); //attach it in the HTML element called deviceList
    },

    connect: function(e) {
        //get the device ID from the DOM element
        var deviceId = e.target.dataset.deviceId,

            onConnect = function() {
                // subscribe for incoming data
                ble.startNotification(deviceId, sensor.service, sensor.value, app.onData, app.onError);
                //saves device ID to disconnect button - needed later for disconnect function
                disconnectButton.dataset.deviceId = deviceId;

                sensorValue.innerHTML = "Waiting for data";

                //show next page
                app.showConnectPage();
            };

        //connect functions asks for the device id, a callback function for
        // when succeeds and one error functions for when it fails
        ble.connect(deviceId, onConnect, app.onError);
    },

    onData: function(buffer) { // data received from Arduino
        // Create typed array from the ArrayBuffer
        var data = new Uint8Array(buffer);
        // get the integer value and set into the UI
        sensorValue.innerHTML = data[0];
    },

    disconnect: function(event) {
        //gets device ID from disconnect button
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showStartPage, app.onError);
    },

    showStartPage: function() {
        startPage.hidden = false;
        connectedPage.hidden = true;
    },

    showConnectPage: function() {
        startPage.hidden = true;
        connectedPage.hidden = false;
    },

    onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    }
};

app.initialize();
