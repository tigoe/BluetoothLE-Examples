// (c) 2015 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global mainPage, deviceList, refreshButton */
/* global detailPage, accelerometerData, buttonState, disconnectButton */
/* global ble  */
/* jshint browser: true , devel: true*/
'use strict';

// Volume Service
var volume = {
    service: "f1f3c6d0-8193-487e-a931-16017119cffe",
    level: "f1f3c6d1-8193-487e-a931-16017119cffe"
};

var app = {
    initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling

        upButton.addEventListener('touchstart', this.volumeUp, false);
        downButton.addEventListener('touchstart', this.volumeDown, false);
    },
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empties the list
        ble.scan([volume.service], 5, app.onDiscoverDevice, app.onError);
    },
    onDiscoverDevice: function(device) {

        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                device.id;

        listItem.dataset.deviceId = device.id;
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);

    },
    connect: function(e) {
        app.deviceId = e.target.dataset.deviceId;

        var onConnect = function() {

                // subscribe to be notified when volume changes
                ble.startNotification(app.deviceId, volume.service, volume.level, app.onVolumeChange, app.onError);
                // read the volume once to get the initial value
                ble.read(app.deviceId, volume.service, volume.level, app.onVolumeChange, app.onError);
                app.showDetailPage();
            };

        ble.connect(app.deviceId, onConnect, app.onError);
    },
    onVolumeChange: function(data) {
        console.log(data);
        var message;
        var a = new Uint8Array(data);
        volumeLevel.innerHTML = a[0];
    },
    volumeUp: function() {
        var level = parseInt(volumeLevel.innerHTML) || 12;
        level++;
        app.changeVolume(level);
    },
    volumeDown: function() {
        var level = parseInt(volumeLevel.innerHTML) || 12;
        level--;
        app.changeVolume(level);
    },
    changeVolume: function(level) { // send data over bluetooth
        function success() {
            console.log("Volume changed");
            if (cordova.platformId === 'android') {
                volumeLevel.innerHTML = level;
            }
        }
        function failure(reason) {
            console.log("Error changing volume " + reason);
        }
        var data = new Uint8Array(1);
        data[0] = level;
        ble.writeWithoutResponse(app.deviceId, volume.service, volume.level, data.buffer, success, failure);
    },
    disconnect: function(event) {
        ble.disconnect(app.deviceId, app.showMainPage, app.onError);
    },
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function() {
        mainPage.hidden = true;
        detailPage.hidden = false;
    },
    onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    }
};
