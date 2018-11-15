# MKR1010 Bluetooth LE with Accelerometer

This example shows how use an [Arduino MKR WiFi 1010](https://store.arduino.cc/usa/arduino-mkr-wifi-1010) to make a Bluetooth LE peripheral that offers an accelerometer service. It uses the [ArduinBLE library](https://github.com/arduino-libraries/ArduinoBLE).

You will need to upgrade your MKR 1010 to firmware version 1.2.0, using the Firmware updater tool in the Arduino IDE.  Here are [instructions to upgrade the firmware of the MKR 1010](http://forum.arduino.cc/index.php?topic=579306.0).  This was built using an [ADXL337 accelerometer](https://www.sparkfun.com/products/12786) was used for this example because it is simple; Any of the ADXL accelerometers can be substituted (the drawing shows an ADXL335). This family of accelerometers has three analog voltage outputs for the three axes. 

Accelerometer connected to MKR board, Schematic view
<img src="MKR1010_accelerometer_schem.svg" alt="Accelerometer connected to MKR board, schematic view" width="300">

<img src="MKR1010_accelerometer_bb.svg" width="300" alt="Accelerometer connected to MKR board, breadboard view")

You can use this with this [p5.js Web Bluetooth example](https://github.com/tigoe/BluetoothLE-Examples/tree/master/p5-web-bluetooth).

## References: 
* [Make: Bluetooth](https://www.makershed.com/products/make-bluetooth) (book) by Alasdair Allan, Don Coleman, and Sandeep Mistry
* [BLEDocs](https://github.com/tigoe/BLEDocs/wiki), a repository introducing Bluetooth LE
* [LightBlue](https://itunes.apple.com/us/app/lightblue/id639944780?mt=12), a Bluetooth LE diagnostic app for MacOS by Punchthrough Design
* The [ArduinoBLE library](https://github.com/arduino-libraries/ArduinoBLE)
* [Instructions to upgrade the firmware of the MKR 1010](http://forum.arduino.cc/index.php?topic=579306.0)
