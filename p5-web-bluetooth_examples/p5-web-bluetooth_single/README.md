# P5.js and Web Bluetooth Example

This example shows how to connect a p5.js sketch to a Bluetooth LE peripheral using the  Web Bluetooth API. 

The Bluetooth peripheral in the sketch has a three-axis accelerometer attached. It has one service for the accelerometer, and that service has three characteristics the X, Y, and Z axis values. The characteristics are read as 32-bit integers.

You can build this peripheral using an [Arduino MKR WiFi 1010](https://store.arduino.cc/usa/arduino-mkr-wifi-1010), which also can communicate via Bluetooth LE as of firmware version 1.2.0, using the [ArduinBLE library](https://github.com/arduino-libraries/ArduinoBLE).  Here are [instructions to upgrade the firmware of the MKR 1010](http://forum.arduino.cc/index.php?topic=579306.0). You can use any accelerometer. The [ADXL337 accelerometer](https://www.sparkfun.com/products/12786) was used for this example because it is simple; it has three analog voltage outputs for the three axes. Here is an [example using the ADXL337 with the ArduinoBLE library](https://github.com/tigoe/BluetoothLE-Examples/tree/master/ArduinoBLE_library_examples/BLE_accelerometer)

## References: 
* [Make: Bluetooth](https://www.makershed.com/products/make-bluetooth) (book) by Alasdair Allan, Don Coleman, and Sandeep Mistry
* [BLEDocs](https://github.com/tigoe/BLEDocs/wiki), a repository introducing Bluetooth LE
* [LightBlue](https://itunes.apple.com/us/app/lightblue/id639944780?mt=12), a Bluetooth LE diagnostic app for MacOS by Punchthrough Design
* The [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) for JavaScript
* Yining Shi's [example](https://github.com/yining1023/arduino101CuriePME/tree/master/example1) for Web Bluetooth and p5.js
* The [ArduinBLE library](https://github.com/arduino-libraries/ArduinoBLE)
* [Instructions to upgrade the firmware of the MKR 1010](http://forum.arduino.cc/index.php?topic=579306.0)
* Uri Shaked's [introduction to Web Bluetooth](https://medium.com/@urish/start-building-with-web-bluetooth-and-progressive-web-apps-6534835959a6)