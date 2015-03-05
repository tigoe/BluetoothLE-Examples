# LightBlue Bean Example

This example discovers and connects to [LightBlue bean](https://punchthrough.com/bean/) using Apache Cordova

These instructions assume that [Apache Cordova](http://cordova.io) is installed and configured on your system.

## BLE Plugin

Add the Bluetooth Low Energy Plugin

    cordova plugin add com.megster.cordova.ble

## iOS

Add the iOS platform

   cordova platform add ios

Open the project in Xcode

   open platforms/ios/Bean.xcodeproj

Deploy to an iOS device

## Android

Add the Android platform

    cordova platform add android

Compile and run on device

    cordova run android --device
