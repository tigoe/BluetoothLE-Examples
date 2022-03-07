/*
  Callback test

  This example creates a BLE peripheral with three services. It demonstrates the 
  following device callback events: BLEConnected, BLEDisconnected; and 
  the following characteristic events: BLESubscribed, BLEUnsubscribed, BLEUpdated
  
  The circuit:
  - Arduino MKR WiFi 1010, Arduino Uno WiFi Rev2 board, Arduino Nano 33 IoT,
    Arduino Nano 33 BLE, or Arduino Nano 33 BLE Sense board.

  You can use a generic BLE central app, like LightBlue (iOS and Android) or
  nRF Connect (Android), to interact with the services and characteristics
  created in this sketch.

  created 7 Mar 2022
  by Tom Igoe
*/

#include <ArduinoBLE.h>

// this define is a macro. It says "take whatever is in parentheses
// and add it in the middle of this string. This way you don't have
// to write out the whole string in each characteristic:
#define MY_UUID(val) ("D65D0396-" val "-4381-9985-653653CE831F")

char bleName[] = "BLE_events";
// BLE service
BLEService myService(MY_UUID("0000"));

// create  characteristics: that differ from the service UUID by 1 digit:
BLEByteCharacteristic firstChar(MY_UUID("0001"), BLERead | BLEWrite | BLENotify);
BLEByteCharacteristic secondChar(MY_UUID("0002"), BLERead | BLEWrite | BLENotify);
BLEByteCharacteristic thirdChar(MY_UUID("0003"), BLERead | BLEWrite | BLENotify);

void setup() {

  // init serial, wait 3 secs for serial monitor to open:
  Serial.begin(9600);
  // if the serial port's not open, wait 3 seconds:
  if (!Serial) delay(3000);
  // use builtin LED for connection indicator:
  pinMode(LED_BUILTIN, OUTPUT);

  // begin BLE initialization
  if (!BLE.begin()) {
    Serial.println("starting BLE failed");
    while (true);
  }

  // set the local name peripheral advertises:
  BLE.setLocalName(bleName);
  // print it:
  Serial.println(bleName);
  // set the UUID for the service this peripheral advertises:
  BLE.setAdvertisedService(myService);
  // add the characteristic:
  myService.addCharacteristic(firstChar);
  myService.addCharacteristic(secondChar);
  myService.addCharacteristic(thirdChar);

  // add the service:
  BLE.addService(myService);

  // set characteristic values:
  firstChar.setValue(0);
  secondChar.setValue(0);
  thirdChar.setValue(0);

  // assign event handlers for connected, disconnected to peripheral
  BLE.setEventHandler(BLEConnected, connectHandler);
  BLE.setEventHandler(BLEDisconnected, disconnectHandler);

  // assign event handlers for characteristics:
  firstChar.setEventHandler(BLEUpdated, characteristicUpdated);
  firstChar.setEventHandler(BLESubscribed, characteristicSubscribed);
  firstChar.setEventHandler(BLEUnsubscribed, characteristicUnsubscribed);
  
  secondChar.setEventHandler(BLEUpdated, characteristicUpdated);
  secondChar.setEventHandler(BLESubscribed, characteristicSubscribed);
  secondChar.setEventHandler(BLEUnsubscribed, characteristicUnsubscribed);

  thirdChar.setEventHandler(BLEUpdated, characteristicUpdated);
  thirdChar.setEventHandler(BLESubscribed, characteristicSubscribed);
  thirdChar.setEventHandler(BLEUnsubscribed, characteristicUnsubscribed);

  // start advertising
  BLE.advertise();
  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
  // poll for BLE events
  BLE.poll();
}

// listen for BLE connect events:
void connectHandler(BLEDevice central) {
  // central connected event handler
  Serial.print("Connected event, central: ");
  Serial.println(central.address());
  digitalWrite(LED_BUILTIN, HIGH);
}

// listen for BLE disconnect events:
void disconnectHandler(BLEDevice central) {
  // central disconnected event handler
  Serial.print("Disconnected event, central: ");
  Serial.println(central.address());
  digitalWrite(LED_BUILTIN, LOW);
}

// listen for characteristic subscribed events:
void characteristicSubscribed(BLEDevice central, BLECharacteristic thisChar) {
  // central wrote new value to characteristic, update LED
  Serial.print("Characteristic subscribed. UUID: ");
  Serial.println(thisChar.uuid());
}

// listen for characteristic unsubscribed events:
void characteristicUnsubscribed(BLEDevice central, BLECharacteristic thisChar) {
  // central wrote new value to characteristic, update LED
  Serial.print("Characteristic unsubscribed. UUID: ");
  Serial.println(thisChar.uuid());
}

// listen for characteristic updated events:
void characteristicUpdated(BLEDevice central, BLECharacteristic thisChar) {
  // central wrote new value to characteristic, update LED
  Serial.print("Characteristic updated. UUID: ");
  Serial.print(thisChar.uuid());
  Serial.print("   value: ");
  byte incoming = 0;
  thisChar.readValue(incoming);
  Serial.println(incoming);
}
