/*
The sketch demonstrates iBecaon from an RFduino
Modified from RFduino's iBeacon Settings example
*/

#include <RFduinoBLE.h>

// pin 3 on the RGB shield is the green led
int led = 3;

void setup() {
  // led used to indicate that iBeacon has started
  pinMode(led, OUTPUT);

  // do iBeacon advertising
  RFduinoBLE.iBeacon = true;
  
  // override the default iBeacon settings
  uint8_t uuid[16] = {0xad, 0x5d, 0x9e, 0xce, 0x93, 0x31, 0x48, 0xc2, 0xb5, 0x97, 0x28, 0x45, 0xaa, 0xc4, 0xa8, 0xf0};
  memcpy(RFduinoBLE.iBeaconUUID, uuid, sizeof(RFduinoBLE.iBeaconUUID));
  RFduinoBLE.iBeaconMajor = 0x12;
  RFduinoBLE.iBeaconMinor = 0x08;
  RFduinoBLE.iBeaconMeasuredPower = 0xC6;
  
  // start the BLE stack
  RFduinoBLE.begin();
}

void loop() {
  // switch to lower power mode
  RFduino_ULPDelay(INFINITE);
}

void RFduinoBLE_onAdvertisement(bool start)
{
  // turn the green led on if we start advertisement, and turn it
  // off if we stop advertisement
  
  if (start)
    digitalWrite(led, HIGH);
  else
    digitalWrite(led, LOW);
}
