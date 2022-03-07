# ArduinoBLE Duplex Communication

This pair of examples shows how to communicate between a central device and a peripheral device, both written with the ArduinoBLE library. 

Both the central and the peripheral device have a pushbutton attached to pin 2, and on the other side of the button, to ground; and an LED on the built-in LED pin of the board. 

When the central device starts up, it scans for the peripheral and tries to connect. When it connects, you can push the button on the central to change the LED on the peripheral, and vice versa. 

* [CentralDuplex example](CentralDuplex)
* [PeripheralDuplex example](PeripheralDuplex)