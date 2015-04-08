# Read/write characteristic Example

This example uses Sandeep Mistry's noble library for node.js to
read and write to a characteristic of a peripheral. It's designed
to work with the led example from Sandeep's [arduino-BLEPeripheral library](https://github.com/sandeepmistry/arduino-BLEPeripheral), in which there's one service, with one characteristic, and the characteristic can have the value 0 or 1. An LED attached to a BLE Nano
or RFDuino is controlled by this characteristic.

It looks for a peripheral with specific service name ('19b10000e8f2537e4f6cd104768a1214')
as in the Arduino led example in Sandeep's Arduino-BLEPeripheral library: https://github.com/sandeepmistry/arduino-BLEPeripheral/blob/master/examples/led/led.ino
