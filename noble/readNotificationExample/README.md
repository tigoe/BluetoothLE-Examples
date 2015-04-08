# Read/notify characteristic Example

  This example uses Sandeep Mistry's noble library for node.js to
  subscribe to a characteristic that has its notify property set. The startScanning function call filters for the specific service you want (targetService), in order to ignore other devices and services.

  For a peripheral example that works with this see the 
  Arduino BLEAnalogNotify example in this repository. It works with Sandeep's [arduino-BLEPeripheral library](https://github.com/sandeepmistry/arduino-BLEPeripheral).