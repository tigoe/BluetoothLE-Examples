/*
   BLE & RTC Combination

   This example creates a BLE clock. The time can be set
   by sending the Unix epoch to the peripheral, or read
   by reading it. The timezone can be set or read as well

   created 12 Mar 2021
   by Tom Igoe
*/
#include <ArduinoBLE.h>
#include <RTCZero.h>
// this define is a macro. It says "take whatever is in parentheses
// and add it in the middle of this string. This way you don't have
// to write out the whole string in each characteristic:
#define MY_UUID(val) ("555a0002-" val "-467a-9538-01f0652c74e8")

// fill in your name here. It will be combined with
// the Arduino's MAC address to set the peripheral BLE name:
const char myName[] = "BLE-clock";

// set up the service and the characteristics:
BLEService                     service                 (MY_UUID("0000"));
BLEUnsignedLongCharacteristic  epochCharacteristic     (MY_UUID("0001"), BLERead | BLEWrite | BLENotify);
BLEIntCharacteristic           timeZoneCharacteristic  (MY_UUID("0002"), BLERead | BLEWrite);

// initialize the realtime clock and set the timezone:
RTCZero rtc;
int timeZone = 0;

void setup() {
  Serial.begin(9600);
  // wait 3 seconds if serial port not open:
  if (!Serial) delay(3000);

  // start the realtime clock:
  rtc.begin();

  // start the BLE radio:
  if (!BLE.begin()) {
    Serial.println("Failed to start BLE");
  }
  // set the peripheral's local name:
  BLE.setLocalName(myName);

  // set the advertised service:
  BLE.setAdvertisedService(service);
  // add the characteristics:
  service.addCharacteristic(epochCharacteristic);
  service.addCharacteristic(timeZoneCharacteristic);

  // set initial values for the characteristics:
  epochCharacteristic.writeValue(0);
  epochCharacteristic.writeValue(0);

  // add the service to the peripheral and advertise it:
  BLE.addService(service);
  BLE.advertise();
}

void loop() {
  // poll for connections:
  BLE.poll();
  // if you're connected to a central:
  if (BLE.connected()) {
    // if the central writes to the epochCharacteristic, update the time:
    if (epochCharacteristic.written()) {
      rtc.setEpoch(epochCharacteristic.value());
      rtc.setHours(rtc.getHours() + timeZoneCharacteristic.value());
    }

    // if the central writes to the timeZoneCharacteristic, make updates:
    if (timeZoneCharacteristic.written()) {
      // adjust for the timezone and update the time:
      int timeDiff = timeZoneCharacteristic.value() - timeZone;
      rtc.setHours(rtc.getHours() + timeDiff);

      // adjust for BLE byte representation (big endian vs little endian):
      if (timeZoneCharacteristic.value() > 12) {
        timeZone = timeZoneCharacteristic.value() - 256;
      } else {
        timeZone = timeZoneCharacteristic.value();
      }
    }
  }
  // once a seond, print the time:
  if (millis() % 1000 < 3) {
    Serial.print(getTimeStamp());
    // add the timezone:
    Serial.print(" GMT");
    if (timeZone > 0) {
      Serial.print("+");
    }
    if (timeZone != 0) {
      Serial.print(timeZone);
    }
    Serial.println();

    // update the epochCharacteristic with the time from the RTC:
    epochCharacteristic.writeValue(rtc.getEpoch());
  }
}

// format the time as hh mm ss, easiest for text-to-speech:
String getTimeStamp() {
  String timestamp = "";
  if (rtc.getHours() <= 9) timestamp += "0";
  timestamp += rtc.getHours();
  timestamp += ":";
  if (rtc.getMinutes() <= 9) timestamp += "0";
  timestamp += rtc.getMinutes();
  timestamp += ":";
  if (rtc.getSeconds() <= 9) timestamp += "0";
  timestamp += rtc.getSeconds();
  return timestamp;
}
