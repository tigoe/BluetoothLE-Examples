/*
  A simplified example of the Adaffuit Bluetooth LE UART library
  for the Feather Bluetooth LE module. Works with software serial
  on any Arduino, or hardware serial on the 32U4 and Mega boards.

  based on Kevin Townsend's blueuart_datamode example
  modified by Tom Igoe
  1 Dec 2015
 */

#include <SoftwareSerial.h>

#include <Adafruit_BLE.h>
#include <Adafruit_BluefruitLE_UART.h>
// pins for software serial. You don't need these if you are
// using hardware serial:
const int txPin = 2;        // Bluefruit software serial transmit pin
const int rxPin = 3;        // Bluefruit software serial receive pin
const int ctsPin = 4;       // Bluefruit software serial clear-to-send pin
const int rtsPin = 5;       // Bluefruit software serial request-to-send pin

// you need this pin for hardware or software serial:
const int uartModePin = 6;  // Bluefruit software serial mode pin

// Create the bluefruit object, either software serial
SoftwareSerial bluefruitSS = SoftwareSerial(txPin, rxPin);
Adafruit_BluefruitLE_UART ble(bluefruitSS, uartModePin, ctsPin, rtsPin);

// to use hardware Serial (Serial1) on the Mega or 32U4 boards (Leonardo, Micro, Yun, etc),
// comment out the last two lines and uncomment this line:
// Adafruit_BluefruitLE_UART ble(Serial1, uartModePin);


void setup() {
  while (!Serial);      // wait for serial monitor to open
  Serial.begin(9600);   // initialize serial communications

  if ( !ble.begin(false)) {       // initialize Bluefruit radio
    Serial.println("Couldn't find Bluefruit");
    while(true);                  // do nothing more
  }
  
  // set radio into data mode:
  ble.setMode(BLUEFRUIT_MODE_DATA);
}

void loop(void) {
  // send anything that comes in the serial port 
  // out the BLE radio:
  if (Serial.available()) {
    char input = Serial.read();
    // Send input data to host via Bluefruit
    ble.write(input);
  }

   // send anything that comes in the BLE radio  
  // out the serial port:
  while (ble.available()) {
    char input = ble.read();
    Serial.print(input);
  }
}
