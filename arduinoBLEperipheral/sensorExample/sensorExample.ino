/*
  Sensor reading
  
  Uses Sandeep Mistry's BLE Peripheral library: https://github.com/sandeepmistry/arduino-BLEPeripheral/ 
  to read data from a sensor.
  
  created 6 Feb 2015  
  by Maria Paula Saba
*/


// Import libraries (BLEPeripheral depends on SPI)
#include <SPI.h>
#include <BLEPeripheral.h>

// define pins (varies per shield/board, UNUSED for nRF51822)
#define BLE_REQ   10
#define BLE_RDY   2
#define BLE_RST   9

//define sensor pin
#define SENSOR_PIN 5

//variable for a timer
long previousMillis = 0;

 // interval at which we change (send) data (milliseconds)
long interval = 100;          

// create peripheral instance, see pinouts above
BLEPeripheral           blePeripheral        = BLEPeripheral(BLE_REQ, BLE_RDY, BLE_RST);

// create service
BLEService              sensorService           = BLEService("19b10000e8f2537e4f6cd104768a1214");

// create switch characteristic
BLECharCharacteristic   sensorCharacteristic = BLECharCharacteristic("19b10001e8f2537e4f6cd104768a1214", BLERead | BLENotify);

void setup() {
  Serial.begin(115200);
#if defined (__AVR_ATmega32U4__)
  delay(5000);  //5 seconds delay for enabling to see the start up comments on the serial board
#endif

   //set sensor pin
   pinMode(SENSOR_PIN, INPUT);
   
  // set advertised local name and service UUID
  blePeripheral.setLocalName("Sensor");
  blePeripheral.setAdvertisedServiceUuid(sensorService.uuid());

  // add service and characteristic
  blePeripheral.addAttribute(sensorService);
  blePeripheral.addAttribute(sensorCharacteristic);

  // assign event handlers for connected, disconnected to peripheral
  blePeripheral.setEventHandler(BLEConnected, blePeripheralConnectHandler);
  blePeripheral.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);

  // assign event handlers for characteristic
  sensorCharacteristic.setEventHandler(BLESubscribed, characteristicSubscribed);
  sensorCharacteristic.setEventHandler(BLEUnsubscribed, characteristicUnsubscribed);

  // begin initialization
  blePeripheral.begin();

  Serial.println(F("BLE Sensor Peripheral"));
}

void loop() {
  // poll peripheral - this function will start the peripheral and handle the callbacks
  blePeripheral.poll();

  //timer function
  unsigned long currentMillis = millis();
 if(currentMillis - previousMillis > interval) {
   // save the last time 
    previousMillis = currentMillis;   
  
    // read the analog input
   int analogValue = analogRead(SENSOR_PIN); 
   //save it in the characteristic
    sensorCharacteristic.setValue(analogValue);
  
   Serial.println(analogValue);
 
 }
  
}

//callback functions for connect, disconnect and written characteristic are described below:
void blePeripheralConnectHandler(BLECentral& central) {
  // central connected event handler
  Serial.print(F("Connected event, central: "));
  Serial.println(central.address());

}

void blePeripheralDisconnectHandler(BLECentral& central) {
  // central disconnected event handler
  Serial.print(F("Disconnected event, central: "));
  Serial.println(central.address());
}


void characteristicSubscribed(BLECentral& central, BLECharacteristic& characteristic) {
  // characteristic subscribed event handler
  Serial.println(F("Characteristic event, subscribed"));
}

void characteristicUnsubscribed(BLECentral& central, BLECharacteristic& characteristic) {
  // characteristic unsubscribed event handler
  Serial.println(F("Characteristic event, unsubscribed"));
}


