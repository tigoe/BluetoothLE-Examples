# ArduinoBLE Examples

These examples were written using the [ArduinoBLE library](https://www.arduino.cc/reference/en/libraries/arduinoble/), which runs on the Nano 33 IoT, Nano 33 BLE and BLE Sense, Arduino Uno WiFi Rev2, and MKR 1010 boards`. 

[BLE_accelerometer](BLE_accelerometer) - This example creates a BLE peripheral with service that contains three
  characteristics, each an analog input value to the microcontroller. It was designed with the ADXL337 accelerometer in mind, but any three analog inputs will work as well.

[BLE_LIS3DH_accelerometer](BLE_LIS3DH_accelerometer) - This example creates a BLE peripheral with service that contains three characteristics, each an analog input value to the microcontroller. It works with the LIS3DH accelerometer

[BLE_RTC](BLE_RTC) - shows how to use the ArduinoBLE library in conjunction with the RTCZero library to make a clock. Works on any of the SAMD M0+ boards, which have a built-in real-time clock. 

[BLE_String](BLE_String) - This example creates two String characteristics to act as a transmit buffer and a receive buffer. It sort of duplicates serial communication over Bluetooth, using a 128-byte transmit buffer and 128-byte receive buffer. 

[BLEDuplex](BLEDuplex) - a pair of examples, one central and one peripheral, for connecting two Arduinos directly. 