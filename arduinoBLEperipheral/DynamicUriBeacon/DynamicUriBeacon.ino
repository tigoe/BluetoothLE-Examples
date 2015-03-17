/*
  Dynamic Uri Beacon
  Context:  Arduino, for Nordic Bluetooth LE derivatives (BLE Nano, RFDuino, etc)

  This example shows how to use Sandeep Mistry's Arduino BLEPeripheral library
  to dynamically change the URI of a Physical Web beacon.
  There is a single service, BEAC, and a characteristic, 0101.
  When the value of the characteristic changes from '0'(ASCII 48) to '1' (ASCII 49),
  the URI of the beacon changes from null to http://example.com
  Note that the characteristic changes only when the central that's changing it disconnects.
  
  The circuit:
  * RedBear Labs BLE Nano or BLEnd Micro or RFDuino 
    or other Nordic radio-based Arduino derivative

  created  13-15 Mar 2015
  by Sandeep Mistry, Maria Paula Saba
  modified 16 Mar 2015
  by Tom Igoe
 */

// Import libraries (BLEPeripheral depends on SPI)
#include <SPI.h>
#include <URIBeacon.h>

// define pins (varies per shield/board)
#define URI_BEACON_REQ   10
#define URI_BEACON_RDY   2
#define URI_BEACON_RST   9

// set up peripheral as a beacon. It UriBeacon contains a BlePeripheral:
URIBeacon uriBeacon(URI_BEACON_REQ, URI_BEACON_RDY, URI_BEACON_RST);

// create service:
BLEService service = BLEService("BEAC");
// create characteristic:
BLECharCharacteristic characteristic = BLECharCharacteristic("0101", BLERead | BLEWrite);
// keep track of the previous value of the characteristic:
char prevValue = '0';  

void setup() {
  uriBeacon.setLocalName("beacon");       // set the beacon name
  // URI beacon is non-connectable by default, make it connectable:
  uriBeacon.setConnectable(true);
  uriBeacon.addAttribute(service);        // add the service  
  uriBeacon.addAttribute(characteristic); // add the characteristic

  // initialize perhipheral with no URL:
  uriBeacon.begin(0x00, 0x20, "");
}

void loop() {
  uriBeacon.loop();    // continually advertise and update beacon

  // if a central writes to the characteristic:
  if (characteristic.written()) {
    // get the current characteristic value:
    char currentValue = characteristic.value();
    // see if it's changed since last time through the loop:
    if (currentValue != prevValue) {
      // if it's changed and it's currently '0' (ASCII 48):
      if (currentValue == '0') {
        // change the URI:
        uriBeacon.setURI("");
        // if it's changed and it's currently '1' (ASCII 49):
      } else if (currentValue == '1') {
        // change the URI:
        uriBeacon.setURI("http://example.com");
      }
    }
    // save the current characteristic value for next time through the loop:
    prevValue = currentValue;
  }
}
