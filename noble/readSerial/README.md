
# Noble UART Example

This example uses Sandeep Mistry's [noble library for node.js](https://github.com/sandeepmistry/noble) to read and write from Bluetooth LE characteristics. It looks for a UART Bluetooth LE Services, like the proprietary UART service by Nordic Semiconductor that mimick Bluetooth Classic's Serial Port Profile (SPP).
You can see this service implemented in [Adafruit's Adafruit_BluefruitLE_nRF51 library](https://github.com/adafruit/Adafruit_BluefruitLE_nRF51). This should work with any Adafruit's BLE board including [Bluefruit LE UART Friend](https://www.adafruit.com/products/2479), [Bluefruit LE nRF8001 Breakout](https://www.adafruit.com/search?q=nrf8001) and the new [Feather 32u4 Bluefruit LE](https://www.adafruit.com/product/2829) as well. This will also work with boards running the UART services from [RedBearLab](http://redbearlab.com/), Laird and BlueGiga.

On OSX, the operating system will not recognize custom UART services as a serial port. Hence the need for this example.

*Note:* UART service is not a great use of Bluetooth LE. It invalidates the low energy aspect of Bluetooth LE. A better way to do things is to make your own custom services and characteristics, in my opinion.

This is a very bare-bones implementation.

TODO:
* add support for buffering received strings until a given delimiter is received.

created 30 Nov 2015
by Tom Igoe


### Installing

Clone this git repository and change to the `readSerial` directory.

```
git clone https://github.com/tigoe/BluetoothLE-Examples.git
cd BluetoothLE-Examples/noble/readSerial
```

### Run the command line example

```
$ npm install
$ node example.js
```
Then make your own example using the example.js file as a template.

### Run the web example

```
$ npm install
$ node exampleServer.js
```
Open your web browser to port http://localhost:8080. Customize exampleServer.js for your project.

## Properties
### .connected
  Returns whether you're connected to the remote peripheral or not.

### .peripheral
  Returns the peripheral to which you're connected. See the [noble library for node.js](https://github.com/sandeepmistry/noble) for the properties of the peripheral object.

## Functions
### new BleUart(uartServiceName)
  Constructor function. Makes an instance of the module and turns on the Bluetooth radio for scanning. When an appropriate radio is discovered, it connects automatically.

  Predefined UART services are nordic, redbear, laird, and bluegiga.

### new BleUart(name, definition)
  You can define a custom uart service. Tx and Rx are from noble's perspective.

    var uart = {
       serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
       txUUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
       rxUUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
    };
    var bleSerial = new BleUart('foo', uart);

### .connect()
  Connects to the discovered peripheral. No need to call this, it's called automatically by the constructor.

### .disconnect()
  Disconnected from the peripheral you're currently connected to.

### .write(data)
  Writes a string of data out to the remote peripheral. Accepts a string as data.

## Events

### .on('data', data)
  Called when new data arrives from the remote peripheral. Returns the data as Buffer.

  If you are expecting the data to be a string, use `String(data)` to convert.

### .on('connected', connected)
  Called when your computer connects to the remote peripheral. Returns true or false.

### .on('scanning', state)
  Called when your computer's Bluetooth radio is on and scanning. Returns the status of your computer's Bluetooth radio.
