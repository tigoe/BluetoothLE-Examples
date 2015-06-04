# BLE Peripheral Examples

These examples use [Sandeep Mistry's Arduino BLE Peripheral library](https://github.com/sandeepmistry/arduino-BLEPeripheral) to create peripheral with custom services and characteristics.

These examples can be used with nRF8001 and nRF51822 chips - see Sandeep’s repo for list of compatible hardware.



## Getting started with nRF51822 boards

### [BLE Nano](http://redbearlab.com/blenano/) and [RedBearLab nRF51822](http://redbearlab.com/redbearlab-nrf51822)

In order to program the BLE Nano with Arduino 1.6.0 or later, you'll need to install an add-on. The simplest way is to use Sandeep Mistry's [nrf51822 add-on](https://github.com/sandeepmistry/nRF51822-Arduino). Download from GitHub, and unzip it, and in the resulting directory, you'll find the following directory (among other things): /arduino-1.5.x/hardware/RBL/RBL_nRF51822. Copy this RBL_nRF51822 directory to the hardware subdirectory of your Arduino sketch directory, then re-start Arduino. You should see the BLE Nano and RedBear nRF51822 boards in the boards menu now. If that fails, follow the instructions in [this tutorial](http://redbearlab.com/getting-started-nrf51822/) to install an Arduino Add-on.

Then install the bootloader in your hardware:

In the "bootloader" folder, there is a firmware for the RBL nRF51822 board, it allows you to load firmware using Arduino IDE. To load the bootloader, connect the board to your PC/Mac, it will prompt a drive, drag the bootloader firmware to the drive.

Note that you need to have at least OSX 10.9 and for OSX 10.10 (Yosemite) and you need to do this by using Terminal, from the folder with the bootloader file: sudo mount -u -w -o sync /Volumes/MBED ; cp -X bootloader.hex /Volumes/MBED/

### [Rfduino] (http://www.rfduino.com/)

Follow instructions in [this link](https://github.com/RFduino/RFduino/blob/master/README.md) to install it. You need to install FTDI drivers for Windows only. This is for versions with Board Manager only

- Open Arduino
- Go to menu Edit > Preferences (or Arduino > Preferences), and add http://rfduino.com/package_rfduino_index.json to Additional Board Manager URLs and save.
- Open the Boards Manager under Tools->Board menu.
- Select the RFduino package at the end of the list, and click Install to install it.
- Your new board will now show up in the Tools->Board menu. 

Attention! These instructions are for Arduino 1.6.3 or newer.




## Examples

#### LED callback

This example allows one to light up a LED from a BLE central by writing a value to a characteristic. The callback example uses functions that are called every time an event occur (e.g. every time a central connects, it runs the function blePeripheralConnectHandler)

#### LED switch

This example allows one to light up a LED from a BLE central or physical button by writing a value to a characteristic. It uses a boolean function that checks if the characteristic was written (characteristic.written()). It is also possible to read the button value.


#### Servo motor

This example allows one to control a servo motor from a BLE central by writing a value to a characteristic.


#### Sensor

This example stores sensor data (analog readings) into a characteristic, which can be read by a BLE central. It can also subscribe for notifications (it will get data every time a characteristic is set). A timer is needed because otherwise data transfer is too fast and it freezes the sketch.
