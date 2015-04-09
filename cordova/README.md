# BLE Central for Cordova Examples


## Getting started with Phonegap/Cordova

Follow instructions in [this page](http://phonegap.com/install/) to install Phonegap or [this](http://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html) for Cordova CLI. Then install BLE-central plugin following instructions [https://github.com/don/cordova-plugin-ble-central](https://github.com/don/cordova-plugin-ble-central).

Once you create a project, copy the www files to the application main folder and build the project in the platform you want. 

## Examples

#### Bean //TBD: clean data

- Bean write: This example connects and writes data to the Bean. 
- Bean read: Besides connecting and writing, this example reads data whenever requested. 
- Bean notify: Besides connecting and writing, this example subscribes for data changes in the "fake serial" characteristic. 
- Bean serial: This example reads the "fake Serial" characteristic from the Bean by subscribing to it.

In all Bean examples, the arduino sketch to be uploaded to bean is in the respective folder.


#### Sensor

This example discovers and connects to BLE Sensor Service.


#### Volume

This example discovers and connects to BLE Volume Service.

