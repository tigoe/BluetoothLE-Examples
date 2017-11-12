/*
  Simplified IR Temperature Sensor example

  This example reads the IR temperature on a sensorTag.
  Rather than doing the sensor enable, configure, notify,
  and listen functions as each other's callbacks, this example
  simplifies the process by calling most of these asynchronously.

  created 12 Nov 2017
  by Tom Igoe
*/

var SensorTag = require('sensortag');					// sensortag library
var tags = new Array;						        // list of tags connected

// ------------------------ sensorTag functions
function handleTag(tag) {
	console.log('new tag connected');
	var tagRecord = {};		// make an object to hold sensor values
	tags.push(tagRecord);	// add it to the tags array

	function disconnect() {
		console.log('tag disconnected!');
	}
	/*
	This function enables and configures the sensors, and
	sets up their notification listeners. Although it only shows
	the IR temperature sensor data here, you could duplicate this pattern
	with any of the sensors.
	*/
	function enableSensors() {		// attempt to enable the sensors
		console.log('enabling sensors');
		// enable sensor:
		tag.enableIrTemperature();
		// make an object to hold this sensor's values:
		tagRecord.irTemp  = {sensor: 'IR temperature sensor'};
		// set its period:
		tag.setIrTemperaturePeriod(300);
		// then turn on notifications:
		tag.notifyIrTemperature();
	}

	function readIrTemp(objectTemperature, ambientTemperature) {
		// read the three values and save them in the
		// sensor value object:
		tagRecord.irTemp.objectTemperature = objectTemperature;
		tagRecord.irTemp.ambientTemperature = ambientTemperature;
		console.log(tagRecord.irTemp); // print it
	}

	// Now that you've defined all the functions, start the process.
	// connect to the tag and set it up:
	tag.connectAndSetUp(enableSensors);
	// set a listener for when the sensor changes:
	tag.on('irTemperatureChange', readIrTemp);
	// set a listener for the tag disconnects:
	tag.on('disconnect', disconnect);
}

// listen for tags and handle them when you discover one:
SensorTag.discoverAll(handleTag);
