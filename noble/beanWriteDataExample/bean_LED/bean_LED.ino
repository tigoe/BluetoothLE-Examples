/*
  Bean write data example
  
  This example uses the first (of five available) Scratch characteristic to receive from a central (noble or cordova).
  Read more about ScratchData: https://punchthrough.com/bean/the-arduino-reference/setscratchdata/
  
  created 30 Mar 2015
  by Maria Paula Saba based on Evothings examples
  
*/

String beanName = "MyBean";
const uint8_t ledScratch = 1;

void setup() {
  // Setup bean
  Bean.setBeanName(beanName);
  Bean.enableWakeOnConnect(true);

  // Reset the scratch data area 1. 
  uint8_t resetLedBuffer[] = {0, 0, 0};
  Bean.setScratchData(ledScratch, resetLedBuffer, 3);
}

// the loop routine runs over and over again forever:
void loop() {

  bool connected = Bean.getConnectionState();
  if(connected) {
    // Update LED
    ScratchData receivedData = Bean.readScratchData(ledScratch); 

    uint8_t redLed = receivedData.data[0];
    uint8_t greenLed = receivedData.data[1];
    uint8_t blueLed = receivedData.data[2];

    Bean.setLed(redLed, greenLed, blueLed);
  }
  else {
    // Turn LED off and put to sleep. 
    Bean.setLed(0, 0, 0);
    Bean.sleep(0xFFFFFFFF); 
  }
}

