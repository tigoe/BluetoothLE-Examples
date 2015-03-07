// Physical-Web example for RFDigital RFduino
// https://github.com/google/uribeacon/blob/master/beacons/RFduino/physical_web/physical_web.ino

#include <RFduinoBLE.h>

// Manually set beacon data in Bluetooth Header
// http://www.mta.info/r/8
uint8_t advdata[] =
{
  0x03,  // length
  0x03,  // Param: Service List
  0xD8, 0xFE,  // URI Beacon ID
  0x0D,  // length 
  0x16,  // Service Data
  0xD8, 0xFE, // URI Beacon ID
  0x00,  // flags
  0xEE,  // power -18
  0x00,  // http://www.
  'm',
  't',
  'a',
  0x04,  // ".info/"
  'r',
  '/',
  '8'
};

void setup() {
  RFduinoBLE_advdata = advdata;
  RFduinoBLE_advdata_len = sizeof(advdata);
  RFduinoBLE.advertisementInterval = 1000; // advertise every 1000ms
  RFduinoBLE.connectable = false;
  RFduinoBLE.begin();
}

void loop() {
  RFduino_ULPDelay(INFINITE);   // switch to lower power mode
}
