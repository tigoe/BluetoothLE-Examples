
# Noble Read UART Service

This example uses Sandeep Mistry's [noble library for node.js](https://github.com/sandeepmistry/noble) to read and write from Bluetooth LE characteristics. It looks for a UART
characteristic based on a proprietary UART service by Nordic Semiconductor.
You can see this service implemented in [Adafruit's Adafruit_BluefruitLE_nRF51 library](https://github.com/adafruit/Adafruit_BluefruitLE_nRF51). This code works with Adafruit's [Bluefruit LE UART Friend](https://www.adafruit.com/products/2479), and should work with the [Feather 32u4 Bluefruit LE](https://www.adafruit.com/product/2829) as well.

On OSX, the operating system will not recognize this service as a serial port. Hence the need for this example.

*Note:* UART service is not a great use of Bluetooth LE. It invalidates the low energy aspect of Bluetooth LE. A better way to do things is to make your own custom services and characteristics, in my opinion.

This is a very bare-bones implementation.

TODO:
* add support for buffering received strings until a given delimiter is received.

created 30 Nov 2015
by Tom Igoe


To install:
* download this file, example.js, and the packge.json

```
$ npm install
$ node example.js
```

Then make your own example using the example.js file as a template.

## Properties
### .connected
  Returns whether you're connected to the remote peripheral or not.

### .peripheral
  Returns the peripheral to which you're connected. See the [noble library for node.js](https://github.com/sandeepmistry/noble) for the properties of the peripheral object.

## Functions
### new BleUart(serviceUUID)
  Constructor function. Makes an instance of the module and turns on the Bluetooth radio for scanning. When an appropriate radio is discovered, it connects automatically.

  serviceUUID is the UUID of the UART service. If none is given, defaults to the Nordic Semiconductor UART service, 6e400001b5a3f393e0a9e50e24dcca9e.

### .connect()
  Connects to the discovered peripheral. No need to call this, it's called automatically by the constructor.

### .disconnect()
  Disconnected from the peripheral you're currently connected to.

### .write(data)
  Writes a string of data out to the remote peripheral. Accepts a string as data.

## Events

### .on('data', data)
  Called when new data arrives from the remote peripheral. Returns a string as data.

### .on('connected', connected)
  Called when your computer connects to the remote peripheral. Returns true or false.

### .on('scanning', state)
  Called when your computer's Bluetooth radio is on and scanning. Returns the status of your computer's Bluetooth radio.
