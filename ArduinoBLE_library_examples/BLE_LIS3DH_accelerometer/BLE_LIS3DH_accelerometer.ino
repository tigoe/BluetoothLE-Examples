/*
  Accelerometer service

  This example creates a BLE peripheral with service that contains three
  characteristics, each an analog input value to the microcontroller. It
  was designed with the LIS3DH accelerometer in mind.

  The circuit:
  - Arduino MKR WiFi 1010 (firmware version 1.2.0 or later)
     or Arduino Uno WiFi Rev2 board
  - LIS3DH accelerometer attached to SDA and SCL

  Based on Sandeep Mistry's ArduinoBLE examples
  
  created 27 Nov. 2018
  by Tom Igoe
*/

#include <ArduinoBLE.h>

#include "SparkFunLIS3DH.h"
#include "Wire.h"

// create service:
BLEService accelService("082b91ae-e83c-11e8-9f32-f2801f1b9fd1");

// create characteristics and allow remote device to read and get notifications:
BLEIntCharacteristic accelX("082b9438-e83c-11e8-9f32-f2801f1b9fd1", BLERead | BLENotify);
BLEIntCharacteristic accelY("082b9622-e83c-11e8-9f32-f2801f1b9fd1", BLERead | BLENotify);
BLEIntCharacteristic accelZ("082b976c-e83c-11e8-9f32-f2801f1b9fd1", BLERead | BLENotify);

LIS3DH accelerometer; 
void setup() {
  Serial.begin(9600);
  accelerometer.begin();
  pinMode(LED_BUILTIN, OUTPUT);
  // begin initialization
  while (!BLE.begin()) {
    Serial.println("Waiting for BLE to start");
    delay(1);
  }

  // set the local name that the peripheral advertises:
  BLE.setLocalName("MKR1010Accelerometer");
  // set the UUID for the service:
  BLE.setAdvertisedService(accelService);

  // add the characteristics to the service
  accelService.addCharacteristic(accelX);
  accelService.addCharacteristic(accelY);
  accelService.addCharacteristic(accelZ);
  // add the service
  BLE.addService(accelService);

  // start advertising the service:
  BLE.advertise();
}

void loop() {
  BLEDevice central = BLE.central();

  // if a central is connected to the peripheral:
  if (central) {
    // print the central's BT address:
    Serial.print("Connected to central: ");
    Serial.println(central.address());
    // turn on LED to indicate connection:
    digitalWrite(LED_BUILTIN, HIGH);
    
    // while the central remains connected:
    while (central.connected()) {
      // read sensors:
      int xReading = accelerometer.readRawAccelX();
      int yReading = accelerometer.readRawAccelY();
      int zReading = accelerometer.readRawAccelZ();
      // write sensor values to service characteristics:
      accelX.writeValue(xReading);
      accelY.writeValue(yReading);
      accelZ.writeValue(zReading);
    }
  } else {
    // turn off the LED
    digitalWrite(LED_BUILTIN, LOW);
  }
}
