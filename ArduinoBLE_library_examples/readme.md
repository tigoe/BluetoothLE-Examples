# ArduinoBLE Examples

These examples were written using the [ArduinoBLE library](https://www.arduino.cc/reference/en/libraries/arduinoble/), which runs on the Nano 33 IoT, Nano 33 BLE and BLE Sense, Arduino Uno WiFi Rev2, and MKR 1010 boards`. 

[BLE_accelerometer](BLE_accelerometer) - This example creates a BLE peripheral with service that contains three
  characteristics, each an analog input value to the microcontroller. It was designed with the ADXL337 accelerometer in mind, but any three analog inputs will work as well.

[BLE_LIS3DH_accelerometer](BLE_LIS3DH_accelerometer) - This example creates a BLE peripheral with service that contains three characteristics, each an analog input value to the microcontroller. It works with the LIS3DH accelerometer

BLE_OLED

* BLE_RTC
* BLE_String
* [BLEDuplex](BLEDuplex) - a pair of examples, one central and one peripheral, for connecting two Arduinos directly. 