
#include <ArduinoBLE.h>
#include <Arduino_LSM6DS3.h>

// this define is a macro. It says "take whatever is in parentheses
// and add it in the middle of this string. This way you don't have
// to write out the whole string in each characteristic.
// To get a full UUID, go to http://uuidgenerator.net or open a command
// line interface and type uuidgen
#define MY_UUID(val) ("C861307B-" val "-43AD-BB73-F2D5F53D6270")

// fill in your name here. It will be combined with
// the Nano's MAC address to set the peripheral BLE name:
String peripheralName = "Nano-33-IoT-";

String msg = "Hello there";
String sndr = "aa:bb:cc:dd:ee:ff";

BLEService              service(MY_UUID("0000"));
BLECharacteristic msgCharacteristic(MY_UUID("0001"), BLEWrite || BLENotify, sizeof(msg));
BLEStringCharacteristic senderCharacteristic(MY_UUID("0002"), BLERead || BLENotify, sizeof(sndr));
void setup() {
  Serial.begin(9600);
  // wait 3 seconds if serial port not open:
  if (!Serial) delay(3000);

  if (!BLE.begin()) {
    Serial.println("Failed to initialized BLE!");
  }

  String address = peripheralName + BLE.address();
  // convert String to an constant char array
  // in order to set name:
  BLE.setLocalName(address.c_str());
  Serial.print("address = ");
  Serial.println(BLE.address());

  // set the advertised service:
  BLE.setAdvertisedService(service);
 
  // add the characteristics:
  service.addCharacteristic(msgCharacteristic);
  service.addCharacteristic(senderCharacteristic);
  // add the service to the peripheral and advertise it:
  BLE.addService(service);
  BLE.advertise();
}

void loop() {
  // wait for a BLE central to connect:
  BLEDevice central = BLE.central();

  // if you're connected to a central:
  if (central) {
    Serial.println(central.address());
    senderCharacteristic.writeValue(central.address());
    while (central.connected()) {
      if (msgCharacteristic.valueUpdated()) {
        Serial.println(msgCharacteristic.read());
      }
    }
  }
}
