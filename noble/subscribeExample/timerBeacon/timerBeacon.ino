
// Import libraries:
#include <SPI.h>
#include <BLEPeripheral.h>

// define SPI pins (varies per shield/board)
#define BLE_REQ   10
#define BLE_RDY   2
#define BLE_RST   9
const int connectedLED = 13;

// create peripheral instance:
BLEPeripheral peripheral = BLEPeripheral(BLE_REQ, BLE_RDY, BLE_RST);
// create service:
BLEService counterService = BLEService("1cbffaa8-b17d-11e6-80f5-76304dec7eb7");
// create characteristic:
BLEIntCharacteristic counterCharacteristic = BLEIntCharacteristic("1cbffaa8-b17e-11e6-80f5-76304dec7eb7", BLERead | BLENotify);

void setup() {
  Serial.begin(9600);           // initialize serial
  pinMode(connectedLED, OUTPUT);// set LED as output

  // set advertised local name and service UUID:
  peripheral.setLocalName("Counter");
  peripheral.setAdvertisedServiceUuid(counterService.uuid());

  // add service and characteristic:
  peripheral.addAttribute(counterService);
  peripheral.addAttribute(counterCharacteristic);

  // start peripheral:
  peripheral.begin();
}

void loop() {
  BLECentral central = peripheral.central();
  // Only take action if there's a central connected:
  if (central) {
    // central connected to peripheral
    Serial.print("Connected to central: ");
    Serial.println(central.address());

    while (central.connected()) {
      digitalWrite(connectedLED, HIGH);
      // get the seconds since the board was reset:
      int seconds = millis() / 1000;
      // if it's changed, put it in the counter characteristic:
      if (seconds != counterCharacteristic.value()) {
        counterCharacteristic.setValue(seconds);
      }
    }
    // when the central disconnects, turn the LED off:
    digitalWrite(connectedLED, LOW);
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }
}
