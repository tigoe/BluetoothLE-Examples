# BLE Peripheral Examples

These examples use [Sandeep Mistry's Arduino BLE Peripheral library](https://github.com/sandeepmistry/arduino-BLEPeripheral) to create peripheral with custom services and characteristics. 

These examples can be used with nRF8001 and nRF51822 chips - see Sandeep’s repo for list of compatible hardware.



## Getting started with nRF51822 boards

### [BLE Nano](http://redbearlab.com/blenano/) and [RedBearLab nRF51822](http://redbearlab.com/redbearlab-nrf51822)

Follow instructions in [this tutorial](http://redbearlab.com/getting-started-nrf51822/) to install an Arduino Add-on.

Then install the bootloader in your hardware:

In the "bootloader" folder, there is a firmware for the RBL nRF51822 board, it allows you to load firmware using Arduino IDE. To load the bootloader, connect the board to your PC/Mac, it will prompt a drive, drag the bootloader firmware to the drive.

Note that you need to have at least OSX 10.9 and for OSX 10.10 (Yosemite), you need to do this by using Terminal: sudo mount -u -w -o sync /Volumes/MBED ; cp -X bootloader.hex /Volumes/MBED/

### [Rfduino] (http://www.rfduino.com/)

Download the [RFduino Add-on for Arduino] (http://www.rfduino.com/download-rfduino-library/) and follow instructions in [this PDF](http://www.rfduino.com/wp-content/uploads/2014/04/RFduino.Quick_.Start_.Guide_.pdf) to install it. 

Attention! For both RFduino and RedBearLab boards, you need to have at least Arduino version 1.5.7 (it won’t work with previous versions, but it works with 1.5.8)




## Examples

#### LED callback

This example allows one to light up a LED from a BLE central by writing a value to a characteristic. The callback example uses functions that are called every time an event occur (e.g. every time a central connects, it runs the function blePeripheralConnectHandler)

#### LED switch 

This example allows one to light up a LED from a BLE central or physical button by writing a value to a characteristic. It uses a boolean function that checks if the characteristic was written (characteristic.written()). It is also possible to read the button value.


#### Servo motor

This example allows one to control a servo motor from a BLE central by writing a value to a characteristic.


#### Sensor 

This example stores sensor data (analog readings) into a characteristic, which can be read by a BLE central. It can also subscribe for notifications (it will get data every time a characteristic is set). A timer is needed because otherwise data transfer is too fast and it freezes the sketch.
