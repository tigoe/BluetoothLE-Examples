void setup() {
  Serial.begin();
}

void loop() {
   Serial.print(0);
   Bean.sleep(1000);
   Serial.print(1);
   Bean.sleep(1000);

}
