# BluetoothLE-Examples

This repository contains examples for Bluetooth LE in a variety of platforms. They were written for classes at [ITP](http://itp.nyu.edu) by Tom Igoe, Maria Paula Saba, with contributions by Don Coleman, Sandeep Mistry, Shawn Van Every, Jingwen Zhu and Yining Shi. They span a few technologies, some no longer available.

The examples are divided into the following categories:

## ArduinoBLE
[ArduinoBLE Library](https://www.arduino.cc/en/Reference/ArduinoBLE) These examples work with the Arduino MKR1010, Nano 33 IoT and Nano 33 BLE boards, and presumably other boards using the same radios as those boards. You'll need [Arduino 1.8.13](http://arduino.cc/en/Main/Software) or later. These all should pair well with Yining Shi and Jingwen Zhu's [p5ble library for Web Bluetooth](https://itpnyu.github.io/p5ble-website/).

* [ArduinoBLE Library Examples](https://github.com/tigoe/BluetoothLE-Examples/tree/master/ArduinoBLE_library_examples)

## ArduinoBLEPeripheral Library
These examples work with the Nordic NRF8001 and NRF51822 radios, using Sandeep's [Arduino BLE Peripheral library](https://github.com/sandeepmistry/arduino-BLEPeripheral). These examples were written using RedBear Labs' [BLE Nano](http://redbearlab.com/blenano/) boards and [RFDuino](http://www.rfduino.com/)'s boards. There are also some examples for Punchthrough's [LightBlue Bean](https://punchthrough.com/bean/) modules. These may be deprecated, as they have not tested in a few years.

* [ArduinoBLEPeripheral Library Examples](arduinoBLEperipheral)

## Web Bluetooth Examples
These examples were written the Web Bluetooth framework and p5.js. They're useful for seeing the core Web Bluetooth API, but the [p5ble library](https://itpnyu.github.io/p5ble-website/) makes it simpler to do. It can be used without the p5.js framework as well.

* [p5.js Web Bluetooth Examples](https://github.com/tigoe/BluetoothLE-Examples/tree/master/p5-web-bluetooth_examples)

## Node.js, Noble, Bleno
Written for [node.js](http://www.nodejs.org), using [Sandeep Mistry](https://github.com/sandeepmistry)'s Bluetooth LE libraries for node.js, specifically [noble](https://github.com/sandeepmistry/noble), [bleno](https://github.com/sandeepmistry/bleno), and various libraries he's made deriving from those. For Windows users, Don Coleman's done a nice [video explaining how to set up Windows for Bluetooth LE and Node Development](https://www.youtube.com/watch?v=mL9B8wuEdms) using noble.

* [Noble Examples](noble)
* [Bleno Examples](bleno)
* [SensorTag Examples](sensorTag)

## Cordova
[Cordova 4.0](https://cordova.apache.org/) or later. These were written using [Don Coleman](https://github.com/don)'s [BLE Central plugin for Cordova](https://github.com/don/cordova-plugin-ble-central). We've tested the Cordova examples on iOS and Android, though they may be out of date since Cordova.

* [Cordova Examples](https://www.arduino.cc/en/Reference/cordova)


## Bluetooth References 
* [Make: Bluetooth](https://www.makershed.com/products/make-bluetooth) (book) by Alasdair Allan, Don Coleman, and Sandeep Mistry
* [BLEDocs](https://github.com/tigoe/BLEDocs/wiki), a repository introducing Bluetooth LE
* [LightBlue](https://itunes.apple.com/us/app/lightblue/id639944780?mt=12), a Bluetooth LE diagnostic app for MacOS by Punchthrough Design
* The [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) for JavaScript
* Yining Shi's [example](https://github.com/yining1023/arduino101CuriePME/tree/master/example1) for Web Bluetooth and p5.js
* Uri Shaked's [introduction to Web Bluetooth](https://medium.com/@urish/start-building-with-web-bluetooth-and-progressive-web-apps-6534835959a6)
