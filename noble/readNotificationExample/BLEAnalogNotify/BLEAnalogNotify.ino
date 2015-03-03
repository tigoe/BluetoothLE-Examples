/*
  BLE Analog Notify

 Read an analog input and when there's significant change,
 updates a characteristic of a Bluetooth LE peripheral radio.

 Tested on a REdBear BLE nano, but should work on an RFDuino
 or any Nordic BLE radio (nRF8001, nRf51822)

 The circuit:  potentiometer on analog pin A4

 created 2 Mar 2015
 by Tom Igoe

 */

// Import libraries (BLEPeripheral depends on SPI)
#include <SPI.h>
#include <BLEPeripheral.h>

// define pins (varies per shield/board)
#define BLE_REQ   10
#define BLE_RDY   2
#define BLE_RST   9

// create peripheral instance
BLEPeripheral blePeripheral = BLEPeripheral(BLE_REQ, BLE_RDY, BLE_RST);

// create service:
BLEService service = BLEService("fff0");

// create characteristic:
BLEFloatCharacteristic characteristic = BLEFloatCharacteristic("fff1", BLERead | BLENotify);

// create descriptor (optional but helpful)
BLEDescriptor descriptor = BLEDescriptor("2901", "sensor value");

float lastVoltage = 0.0;    // voltage from previous reading
float threshold = 0.05;     // voltage threshold for updating the characteristic

void setup() {
  Serial.begin(9600);
  blePeripheral.setLocalName("BLEArduino"); // optional but helpful
  blePeripheral.setAdvertisedServiceUuid(service.uuid()); // optional but helpful

  // add attributes (services, characteristics, descriptors) to peripheral
  blePeripheral.addAttribute(service);
  blePeripheral.addAttribute(characteristic);
  blePeripheral.addAttribute(descriptor);

  // set initial value
  characteristic.setValue(0);

  // begin initialization
  blePeripheral.begin();
}

void loop() {
  BLECentral central = blePeripheral.central();
  int sensorValue = 0;
  if (central) {      // if a central device connects to this peripheral
    while (central.connected()) {          // as long as the connection lasts
      // for RFDuino, change parameter to GPIO pin number (1-6)
      int sensorValue = analogRead(A4);    // read an analog input
      // convert to a voltage:
      float voltage = sensorValue * (3.0 / 1024.0);

      // if the difference between the current reading and the last
      // is above a threshold, update the BLE characteristic:
      if (abs(voltage - lastVoltage) > threshold) {
        // set value on characteristic
        characteristic.setValue(voltage);
        Serial.println(voltage);
      }
      lastVoltage = voltage;   // save the current voltage for next comparison
      delay(20);               // delay between readings (a crude analog debounce)
    }
  }
}
