

/*
  BLE Central 
  
  This example uses Don Coleman's BLE Central Plugin for Apache Cordova
  to create a central server that connects and reads data from the Light Blue Bean
  serial characteristic. 
  
  created 25 Feb 2015
  by Maria Paula Saba
  based on Don Coleman's BluefruitLE example
*/



/* global mainPage, deviceList, refreshButton */
/* global connectedPage, resultDiv, messageInput, sendButton, disconnectButton */
/* global ble  */
/* jshint browser: true , devel: true*/
'use strict';

var DEVICE = 'MyBean';
var serialServiceUUID = 'A495FF10-C5B1-4B44-B512-1370F02D74DE';
var serialCharacteristicUUID = 'A495FF11-C5B1-4B44-B512-1370F02D74DE';


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
    ble.scan([], 5, app.onDiscoverDevice, app.onError); //scans for BLE devices   
},
    
onDiscoverDevice: function(device) {
  //only shows devices with the name we're looking for
    if(device.name === DEVICE) {
        //creates a HTML element to display in the app
        var listItem = document.createElement('li'),
        html = '<b>' + device.name + '</b><br/>' +
        'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
        device.id;
        listItem.innerHTML = html;
        listItem.dataset.deviceId = device.id;         //save the device ID in the DOM element
        listItem.setAttribute("class", "result");      //give the element a class for css purposes
        deviceList.appendChild(listItem);              //attach it in the HTML element called deviceList
    }

},
    
connect: function(e) {
    //get the device ID from the DOM element
    var deviceId = e.target.dataset.deviceId,

    onConnect = function() {
        // subscribe for incoming data
        ble.startNotification(deviceId, serialServiceUUID, serialCharacteristicUUID, app.onData, app.onError);
        //saves device ID to disconnect button - needed later for disconnect function
        disconnectButton.dataset.deviceId = deviceId;
        
        resultDiv.innerHTML = "Waiting for data";

        //show next page
        app.showConnectPage();
    };
    
     //connect functions asks for the device id, a callback function for when succeeds and one error functions for when it fails
     ble.connect(deviceId, onConnect, app.onError);
},
onData: function(data) { 
    // save data received from Bean, you might have to parse it
    var receivedData = bytesToString(data);

    resultDiv.innerHTML = "Received: " + receivedData + "<br/>";
    resultDiv.scrollTop = resultDiv.scrollHeight;
    
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



// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

//ASCII only
function bytesToInt(buffer){
    var bufferArray = new Uint8Array(buffer);
    
    return bufferArray;
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}