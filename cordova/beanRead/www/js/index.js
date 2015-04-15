
/*
  BLE Central 
  
  This example uses Don Coleman's BLE Central Plugin for Apache Cordova
  to create a central server that connects and reads data from the Light Blue Bean
  through ScratchData characteristics. 
  
  created 29 Mar 2015
  by Maria Paula Saba
*/



/* global mainPage, deviceList, refreshButton */
/* global connectedPage, resultDiv, messageInput, sendButton, disconnectButton */
/* global ble  */
/* jshint browser: true , devel: true*/
'use strict';

var deviceId;
var DEVICE = 'MyBean';
var GATTserviceUUID = 'A495FF10-C5B1-4B44-B512-1370F02D74DE';
var scratchServiceUUID = 'A495FF20-C5B1-4B44-B512-1370F02D74DE';
var writeCharacteristicUUID = 'A495FF21-C5B1-4B44-B512-1370F02D74DE';
var readCharacteristicUUID = 'A495FF22-C5B1-4B44-B512-1370F02D74DE';


var app = {
	initialize: function() {
		this.bindEvents(); //binding event listeners to DOM in the app
		connectedPage.hidden = true; //hides the HTML elements for the second page
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false); //runs onDeviceReady function whenever the device is ready (loaded)
		refreshButton.addEventListener('touchstart', this.refreshDeviceList, false); //on touch of the Refresh button, runs refreshDeviceList function
		deviceList.addEventListener('touchstart', this.connect, false); //on touch of device list, connect to device
		readButton.addEventListener('touchstart', this.readData, false);
		sendButton.addEventListener('touchstart', this.sendData, false);
		disconnectButton.addEventListener('touchstart', this.disconnect, false);
	},

	onDeviceReady: function() {
		app.refreshDeviceList();
	},

	refreshDeviceList: function() {
		deviceList.innerHTML = ''; // empties the list
		ble.scan([GATTserviceUUID], 5, app.onDiscoverDevice, app.onError); //scans for BLE devices
	},

	onDiscoverDevice: function(device) {
		//only shows devices with the name we're looking for
			//creates a HTML element to display in the app
			var listItem = document.createElement('li'),
			html = '<b>' + device.name + '</b><br/>' +
			'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
			device.id;
			listItem.innerHTML = html;
			listItem.dataset.deviceId = device.id;         //save the device ID in the DOM element
			listItem.setAttribute("class", "result");      //give the element a class for css purposes
			deviceList.appendChild(listItem);              //attach it in the HTML element called deviceList
		

	},

	connect: function(e) {
		//get the device ID from the DOM element
        deviceId = e.target.dataset.deviceId;

		var onConnect = function() {
			//show next page
			app.showConnectPage();
		};

		//connect functions asks for the device id, a callback function for when succeeds and one error functions for when it fails
		ble.connect(deviceId, onConnect, app.onError);
	},
	
	// write data to the bean
	sendData: function() { 
		var r = Math.random()*255;
		var g = Math.random()*255;
		var b = Math.random()*255;  

		var data = new Uint8Array(3);
		data[0] = r;
		data[1] = g;
		data[2] = b;
    
		var success = function(){
			alert("Data written");
		};
		
		ble.write(deviceId, scratchServiceUUID, writeCharacteristicUUID, data.buffer, success, app.onError);
	},
	
	//data received from the bean
	readData: function(){
	
		var success = function(data){
			//change to a unit8Array, length of 3.
			var receivedData = new Uint8Array(data, 0, 3);			
			resultDiv.innerHTML = "Previous color:" + receivedData[0] + "," + receivedData[1] + "," +
				receivedData[2] + ".";	
		}
		
		ble.read(deviceId, scratchServiceUUID, readCharacteristicUUID, success, app.onError);

	},
	disconnect: function(event) {
        alert("Disconnected");
		//gets device ID from disconnect button
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
