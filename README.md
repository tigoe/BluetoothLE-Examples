# BluetoothLE-Examples

This repository contains examples for Bluetooth LE in node.js, Arduino, and Apache cordova. These were written for classes at [ITP](http://itp.nyu.edu) by Tom Igoe, Maria Paula Saba, with contributions by Don Coleman, Sandeep Mistry and Shawn Van Every.

## Software You'll Need

To run these examples, you'll need to [node.js](http://www.nodejs.org), [Arduino 1.6.0](http://arduino.cc/en/Main/Software) or later, and [Cordova 4.0](https://cordova.apache.org/) or later. We've tested the Cordova examples on iOS and Android.

The node.js examples are all written using [Sandeep Mistry](https://github.com/sandeepmistry)'s Bluetooth LE libraries for node.js, specifically [noble](https://github.com/sandeepmistry/noble), [bleno](https://github.com/sandeepmistry/bleno), and various libraries he's made deriving from those. The cordova libraries are written using [Don Coleman](https://github.com/don)'s [BLE Central plugin for Cordova](https://github.com/don/cordova-plugin-ble-central). The Arduino examples are mostly intended for use with Nordic NRF8001 and NRF51822 radios, using Sandeep's [Arduino BLE Peripheral library](https://github.com/sandeepmistry/arduino-BLEPeripheral). These examples were written using RedBear Labs' [BLE Nano](http://redbearlab.com/blenano/) boards and [RFDuino](http://www.rfduino.com/)'s boards. There are also some examples for Punchthrough's [LightBlue Bean](https://punchthrough.com/bean/) modules.
