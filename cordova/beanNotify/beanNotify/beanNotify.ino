
String beanName = "MyBean";
const uint8_t writeScratch = 1;
uint8_t previousColor[] = {0, 0, 0};

void setup() {
  // Setup bean
  Bean.setBeanName(beanName);
  Bean.enableWakeOnConnect(true);


  Bean.setScratchData(writeScratch, previousColor, 3);
}

// the loop routine runs over and over again forever:
void loop() {

  bool connected = Bean.getConnectionState();
  if(connected) {
    // read the color sent from the central
    ScratchData receivedData = Bean.readScratchData(writeScratch); 

    uint8_t redLed = receivedData.data[0];
    uint8_t greenLed = receivedData.data[1];
    uint8_t blueLed = receivedData.data[2];

    
    Bean.setLed(redLed, greenLed, blueLed);
    
    //if color is different
    if(redLed != previousColor[0] && greenLed != previousColor[1] && blueLed != previousColor[2]){
         uint8_t newColor[] = {redLed, greenLed, blueLed};
         Serial.print(redLed);
         Serial.print(greenLed);
         Serial.print(blueLed);
         previousColor[0] = redLed;
         previousColor[1] = greenLed;
         previousColor[2] = blueLed;
    }
    
  }
  else {
    
    // Turn LED off and put to sleep. 
    Bean.setLed(0, 0, 0);
    Bean.sleep(0xFFFFFFFF); 
  }
}

