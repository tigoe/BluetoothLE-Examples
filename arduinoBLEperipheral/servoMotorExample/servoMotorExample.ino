/*
  Servo Motor control 
  
  Uses Sandeep Mistry's BLE Peripheral library: https://github.com/sandeepmistry/arduino-BLEPeripheral/ 
  to send data and control the angle of a servo motor.
  
  created 6 Feb 2015  
  by Maria Paula Saba
*/

// Import libraries (BLEPeripheral depends on SPI)
#include <SPI.h>
#include <BLEPeripheral.h>
#include <Servo.h>      // include the servo library

// define pins (varies per shield/board, UNUSED for nRF51822)
#define BLE_REQ   10
#define BLE_RDY   2
#define BLE_RST   9

// creates an instance of the servo object to control a servo
Servo servoMotor;     
#define SERVO_PIN 6

// create peripheral instance, see pinouts above
BLEPeripheral           blePeripheral        = BLEPeripheral(BLE_REQ, BLE_RDY, BLE_RST);

// create service
BLEService              servoService           = BLEService("19b10000e8f2537e4f6cd104768a1214");

// create switch characteristic
BLECharCharacteristic   servoCharacteristic = BLECharCharacteristic("19b10001e8f2537e4f6cd104768a1214", BLERead | BLEWrite);

void setup() {
  Serial.begin(115200);
#if defined (__AVR_ATmega32U4__)
  delay(5000);  //5 seconds delay for enabling to see the start up comments on the serial board
#endif

  // attaches the servo on pin 6 to the servo object
  servoMotor.attach(SERVO_PIN);

  // set advertised local name and service UUID
  blePeripheral.setLocalName("Servo");
  blePeripheral.setAdvertisedServiceUuid(servoService.uuid());

  // add service and characteristic
  blePeripheral.addAttribute(servoService);
  blePeripheral.addAttribute(servoCharacteristic);

  // assign event handlers for connected, disconnected to peripheral
  blePeripheral.setEventHandler(BLEConnected, blePeripheralConnectHandler);
  blePeripheral.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);

  // assign event handlers for characteristic
  servoCharacteristic.setEventHandler(BLEWritten, characteristicWritten);

  // begin initialization
  blePeripheral.begin();

  Serial.println(F("BLE Servo Peripheral"));
}

void loop() {
  // poll peripheral - this function will start the peripheral and handle the callbacks
  blePeripheral.poll();
  servoMotor.write(0);  

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

void characteristicWritten(BLECentral& central, BLECharacteristic& characteristic) {
  // central wrote new value to characteristic
  Serial.print(F("Characteristic event, writen: "));
  if(servoCharacteristic.value() == 1){
   servoMotor.write(90);
  }
  else if(servoCharacteristic.value() == 2){
   servoMotor.write(179);
  }
  else{
     servoMotor.write(0);  
  }
  
  delay(1000);
}

