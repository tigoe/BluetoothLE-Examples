/*
  BLE String Example

  Creates two string characteristics, one for receive and one for transmit.
  When a central connects, it listens for incoming on the rxCharacteristic,
  and sends incoming Serial out on the txCharacteristic. 
  Thanks to Ami Mehta for the suggestion to write this.

  created 16 Mar 2021
  by Tom Igoe
*/

#include <ArduinoBLE.h>

// set the size of the incoming and outgoing strings. Max 512:
const int characteristicSize = 128;

// create service and characteristics:
BLEService stringService("7DEF8317-7300-4EE6-8849-46FACE74CA2A"); 
BLEStringCharacteristic txCharacteristic("7DEF8317-7301-4EE6-8849-46FACE74CA2A", 
BLERead | BLENotify, characteristicSize);
BLEStringCharacteristic rxCharacteristic("7DEF8317-7302-4EE6-8849-46FACE74CA2A", 
BLEWrite, characteristicSize);

void setup() {
  // initialize serial and BLE:
  Serial.begin(9600);
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");
    while (true);
  }

  // set the local name peripheral advertises:
  BLE.setLocalName("BLE_String");
  // set the UUID for the service this peripheral advertises:
  BLE.setAdvertisedService(stringService);

  // add the characteristics to the service:
  stringService.addCharacteristic(txCharacteristic);
  stringService.addCharacteristic(rxCharacteristic);
  
  // add the service and set a value for the characteristic:
  BLE.addService(stringService);
  // start advertising
  BLE.advertise();
}

void loop() {
  // Listen for peripherals:
  BLEDevice central = BLE.central();

  // If a central connects:
  if (central) {
      // print its address:
      Serial.println(central.address());
    // while it's connected:
      while (central.connected()) {
      // if the central writes to the rxCharacteristic, print it:
      if (rxCharacteristic.written()) {
        Serial.println(rxCharacteristic.value());
      }
      // if a serial string comes in, set it in the  txCharacteristic:
      if (Serial.available()) {
        txCharacteristic.setValue(Serial.readString());         
      }  
    }
    // print a disconnect message:
    Serial.print("Central ");
    Serial.print(central.address());
    Serial.println(" disconnected");
  }
}
