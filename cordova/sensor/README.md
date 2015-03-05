# Sensor Example

This example discovers and connects to BLE Sensor Service using Apache Cordova.

Run the [Sensor Example](https://github.com/tigoe/BluetoothLE-Examples/blob/master/arduinoBLEperipheral/sensorExample/sensorExample.ino) on an RFduino, BLE Nano or compatible hardware.

These instructions assume that [Apache Cordova](http://cordova.io) is installed and configured on your system.

## BLE Plugin

Add the Bluetooth Low Energy Plugin

    cordova plugin add com.megster.cordova.ble

## iOS

Add the iOS platform

    cordova platform add ios

Open the project in Xcode

    open platforms/ios/Sensor.xcodeproj

Deploy to an iOS device using Xcode.

Edit the HTML and JavaScript in www/. Run `cordova prepare` to copy changes into the Xcode project.

## Android

Add the Android platform

    cordova platform add android

Compile and run on device

    cordova run android --device
