/*
  BLE String Example

  Creates two string characteristics, one for receive and one for transmit.
  When a central connects, it listens for incoming on the rxCharacteristic,
  and sends incoming Serial out on the txCharacteristic.

  rewritten to use event handlers Mar 2022.
  
  Thanks to Ami Mehta for the suggestion to write this.

  created 16 Mar 2021
  modified 22 Mar 2022
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
  // use the builtin LED as a connect/disconnect handler:
  pinMode(LED_BUILTIN, OUTPUT);

  // set the local name peripheral advertises:
  BLE.setLocalName("BLE_String");
  // set the UUID for the service this peripheral advertises:
  BLE.setAdvertisedService(stringService);

  // add the characteristics to the service:
  stringService.addCharacteristic(txCharacteristic);
  stringService.addCharacteristic(rxCharacteristic);

  // assign event handlers for connected, disconnected to peripheral
  BLE.setEventHandler(BLEConnected, connectHandler);
  BLE.setEventHandler(BLEDisconnected, disconnectHandler);

  // assign event handlers for characteristic
  rxCharacteristic.setEventHandler(BLEWritten, incomingDataHandler);

  // add the service and set a value for the characteristic:
  BLE.addService(stringService);
  // start advertising
  BLE.advertise();
}

void loop() {
  // Listen for events:
  BLE.poll();

  // if a serial string comes in, set it in the txCharacteristic:
  if (Serial.available()) {
    txCharacteristic.setValue(Serial.readString());
  }
}

void connectHandler(BLEDevice central) {
  // central connected event handler
  Serial.print("Connected event, central: ");
  Serial.println(central.address());
  digitalWrite(LED_BUILTIN, HIGH);
}

void disconnectHandler(BLEDevice central) {
  // central disconnected event handler
  Serial.print("Disconnected event, central: ");
  Serial.println(central.address());
  digitalWrite(LED_BUILTIN, LOW);
}

void incomingDataHandler(BLEDevice central, BLECharacteristic characteristic) {
  // central wrote new value to characteristic, update LED
  Serial.print("Characteristic event, written: ");
  Serial.println(rxCharacteristic.value());
}
