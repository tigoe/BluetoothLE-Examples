/*
  A simplified example of the Adaffuit Bluetooth LE SPI library
  for the Feather Bluetooth LE module. Can also work with the 
  Bluefruit SPI board.

  based on Kevin Townsend's blueuart_datamode example
  modified by Tom Igoe
  1 Dec 2015
 */

#include <SPI.h>

#include <Adafruit_BLE.h>
#include <Adafruit_BluefruitLE_SPI.h>
const int csPin = 8;     // Bluefruit SPI chip select pin
const int irqPin = 7;    // Bluefruit SPI Interrupt Request pin
const int rstPin = 4;    // Bluefruit SPI Reset pin. Optional

// This initializes communication with the Bluefruit radio over SPI
// The Feather Bluefruit works this way.
Adafruit_BluefruitLE_SPI ble(csPin, irqPin, rstPin);

// You can also use software serial or hardware serial for this sketch.
// See the BleUart2 sketch for details.


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
