# Volume Example

This example discovers and connects to BLE Volume Service using Apache Cordova.

Run the [Volume Service](https://github.com/tigoe/BluetoothLE-Examples/tree/master/bleno/volume-service) on a Mac or Linux machine.

These instructions assume that [Apache Cordova](http://cordova.io) is installed and configured on your system.

## BLE Plugin

Add the Bluetooth Low Energy Plugin

    cordova plugin add com.megster.cordova.ble

## iOS

Add the iOS platform

    cordova platform add ios

Open the project in Xcode

    open platforms/ios/Volume.xcodeproj

Deploy to an iOS device using Xcode.

Edit the HTML and JavaScript in www/. Run `cordova prepare` to copy changes into the Xcode project.

## Android

Add the Android platform

    cordova platform add android

Compile and run on device

    cordova run android --device
