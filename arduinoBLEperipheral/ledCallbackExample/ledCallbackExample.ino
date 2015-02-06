/*
  LED callback
  
  Uses Sandeep Mistry's BLE Peripheral library: https://github.com/sandeepmistry/arduino-BLEPeripheral/ 
  Based in Sandeep's LED callback example
  
  created 5 Feb 2015  
  by Maria Paula Saba
*/

// Import libraries (BLEPeripheral depends on SPI)
#include <SPI.h>
#include <BLEPeripheral.h>

// define pins (varies per shield/board, UNUSED for nRF51822)
#define BLE_REQ   10
#define BLE_RDY   2
#define BLE_RST   9

// LED pin
#define LED_PIN   3

// create peripheral instance, see pinouts above
BLEPeripheral           blePeripheral        = BLEPeripheral(BLE_REQ, BLE_RDY, BLE_RST);

// create service
BLEService              ledService           = BLEService("19b10000e8f2537e4f6cd104768a1214");

// create switch characteristic
BLECharCharacteristic   switchCharacteristic = BLECharCharacteristic("19b10001e8f2537e4f6cd104768a1214", BLERead | BLEWrite);

void setup() {
  Serial.begin(115200);
#if defined (__AVR_ATmega32U4__)
  delay(5000);  //5 seconds delay for enabling to see the start up comments on the serial board
#endif

  // set LED pin to output mode
  pinMode(LED_PIN, OUTPUT);

  // set advertised local name and service UUID
  blePeripheral.setLocalName("LED");
  blePeripheral.setAdvertisedServiceUuid(ledService.uuid());

  // add service and characteristic
  blePeripheral.addAttribute(ledService);
  blePeripheral.addAttribute(switchCharacteristic);

  // assign event handlers for connected, disconnected to peripheral
  blePeripheral.setEventHandler(BLEConnected, blePeripheralConnectHandler);
  blePeripheral.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);

  // assign event handlers for characteristic
  switchCharacteristic.setEventHandler(BLEWritten, switchCharacteristicWritten);

  // begin initialization
  blePeripheral.begin();

  Serial.println(F("BLE LED Peripheral"));
}

void loop() {
  // poll peripheral - this function will start the peripheral and handle the callbacks
  blePeripheral.poll();
}

//callback functions for connect, disconnect and written characteristic are described below:
void blePeripheralConnectHandler(BLECentral& central) {
  // central connected event handler
  Serial.print(F("Connected event, central: "));
  Serial.println(central.address());
  
  //blink so we know it's connected
  digitalWrite(LED_PIN, HIGH);
  delay(100);
  digitalWrite(LED_PIN, LOW);
  delay(50);  
  digitalWrite(LED_PIN, HIGH);
  delay(100);  
  digitalWrite(LED_PIN, LOW);
}

void blePeripheralDisconnectHandler(BLECentral& central) {
  // central disconnected event handler
  Serial.print(F("Disconnected event, central: "));
  Serial.println(central.address());
  
    
  //turn on for half second so we know it's disconnected
  digitalWrite(LED_PIN, LOW);
  delay(100);
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
}

void switchCharacteristicWritten(BLECentral& central, BLECharacteristic& characteristic) {
  // central wrote new value to characteristic, update LED
  Serial.print(F("Characteristic event, writen: "));
  
  //toggle between ON/OFF every time a value is written
  if (switchCharacteristic.value()) {
    Serial.println(F("LED on"));
    digitalWrite(LED_PIN, HIGH);
  } else {
    Serial.println(F("LED off"));
    digitalWrite(LED_PIN, LOW);
  }
}

