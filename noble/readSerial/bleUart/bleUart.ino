/*
  A simplified example of the Adaffuit Bluetooth LE UART library
  for the Feather Bluetooth LE module.

  based on Kevin Townsend's blueuart_datamode example
  modified by Tom Igoe
  30 Nov 2015
 */

#include <SPI.h>
#include <SoftwareSerial.h>

#include <Adafruit_BLE.h>
#include <Adafruit_BluefruitLE_SPI.h>
#include <Adafruit_BluefruitLE_UART.h>
#define BLUEFRUIT_SPI_CS  8
#define BLUEFRUIT_SPI_IRQ 7
#define BLUEFRUIT_SPI_RST 4    // Optional but recommended, set to -1 if unused

/* hardware SPI, using SCK/MOSI/MISO hardware SPI pins 
and then user selected CS/IRQ/RST */
Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);

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
