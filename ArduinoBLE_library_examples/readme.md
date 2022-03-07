# ArduinoBLE Examples

These examples were written using the [ArduinoBLE library](https://www.arduino.cc/reference/en/libraries/arduinoble/), which runs on the Nano 33 IoT, Nano 33 BLE and BLE Sense, Arduino Uno WiFi Rev2, Nano RP2040 Connect, and MKR 1010 boards. 

[BLE_accelerometer](BLE_accelerometer) - This example creates a BLE peripheral with service that contains three
  characteristics, each an analog input value to the microcontroller. It was designed with the ADXL337 accelerometer in mind, but any three analog inputs will work as well.

[BLE_LIS3DH_accelerometer](https://github.com/tigoe/BluetoothLE-Examples/tree/main/ArduinoBLE_library_examples/BLE_LIS3DH_accelerometer) - This example creates a BLE peripheral with service that contains three characteristics, each an analog input value to the microcontroller. It works with the LIS3DH accelerometer

[BLE_RTC](https://github.com/tigoe/BluetoothLE-Examples/tree/main/ArduinoBLE_library_examples/BLE_RTC) - shows how to use the ArduinoBLE library in conjunction with the RTCZero library to make a clock. Works on any of the SAMD M0+ boards, which have a built-in real-time clock. 

[BLE_String](https://github.com/tigoe/BluetoothLE-Examples/tree/main/ArduinoBLE_library_examples/BLE_String) - This example creates two String characteristics to act as a transmit buffer and a receive buffer. It sort of duplicates serial communication over Bluetooth, using a 128-byte transmit buffer and 128-byte receive buffer. 

[BLEDuplex](https://github.com/tigoe/BluetoothLE-Examples/tree/main/ArduinoBLE_library_examples/BLEDuplex) - a pair of examples, one central and one peripheral, for connecting two Arduinos directly. 

## Handling the BLE Connection on a Peripheral

The ArduinoBLE library examples show two methods for handling the connection to a Central device when you're making a peripheral device: using the main `loop()` function, and using event handler functions. 

### Central Devices in the Loop Function

One approach to listening for central devices is to wait for a central to connect, then go into a while loop as long as it's connected. Here's a typical example:

````arduino
 // listen for a BLE central to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to the peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());

    // while the central is connected to peripheral:
    while (central.connected()) {
     // do stuff here that you want to happen
     // when the central and peripheral are connected
    }

    // when the central disconnects, print it out:
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }
````

This approach is simple to understand, but to use it well you need to make sure that *everything* that you need to happen while the two devices are connected is inside the `while()` loop. A common mistake beginners make is to do other repeated actions, like reading sensors or managing outputs, outside the while loop. If you do that, those tasks will not be performed while the devices are connected. Remember, the only time they are connected is while `central.connected()` is true.

### Central Devices using Callbacks

You can also manage the connection to a central device using callback functions and the `ble.poll()` function. To do this, you create handlers for BLE events. You can create a callback for the following events on a BLE device:
* BLEConnected
* BLEDisconnected

And the following on a BLE characteristic:
* BLESubscribed
* BLEUnsubscribed
* BLEWritten
* BLEUpdated
BLEWritten and BLEUpdated are the same. 

You typically define BLE device event handlers and characteristic handlers in the `setup()` like so:

````arduino
 // assign event handlers for device connection and disconnection:
  BLE.setEventHandler(BLEConnected, connectHandler);
  BLE.setEventHandler(BLEDisconnected, disconnectHandler);
  ````

````arduino
// assign event handlers for characteristic
  myCharacteristic.setEventHandler(BLEWritten, myCharacteristicWritten);
  myCharacteristic.setEventHandler(BLESubscribed, myCharacteristicSubscribed);
  myCharacteristic.setEventHandler(BLEUnsubscribed, myCharacteristicUnsubscribed);
````

You can see an example of how to manage handler events in the [BLECallbackTest](BLECallbackTest) example. 

### Timing

Timing is important when managing a BLE connection. Avoid long delays between calls to `ble.poll()` or to `BLE.central()` or `central.connected()`. These are the functions that are listening for the state of your connection. If you have a long delay for some other function in your code, you are neglecting the BLE connection. Anywhere in your code that you have a `delay()` function longer than about 10 milliseconds is a time you might lose your connection. 

A simple way to remove long delays is to use the `millis()` function. For example, instead of `delay(2000)`, do this:

Set a global variable like so:

````arduino
long timestamp = 0;
````

Then in your loop, check the timestamp against the `millis()` function like this:

````arduino
if (millis() - timestamp > 2000) {
  // do whatever you want to happen once every 2000ms
  timestamp = millis();
}
````