/*
Simplified all sensors example

This example reads all sensors on a sensorTag.
Rather than doing the sensor enable, configure, notify,
and listen functions as each other's callbacks, this example
simplifies the process by calling most of these asynchronously.

This example uses a timed readSensors() function rather
than using event listeners, except for the simple keys.

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
	simple key data here, you could duplicate this pattern
	with any of the sensors.
	*/
	function enableSensors() {		// attempt to enable the sensors
		console.log('enabling sensors');
		// // enable sensor:
		tag.enableAccelerometer();
		tag.enableBarometricPressure();
		tag.enableGyroscope();
		tag.enableHumidity();
		tag.enableIrTemperature();
		tag.enableMagnetometer();

		// make an object to hold each sensor's values:
		tagRecord.accel = {sensor: 'accelerometer'};
		tagRecord.keys = {sensor: 'simple keys'};
		tagRecord.barometer = {sensor: 'barometric pressure'};
		tagRecord.gyro = {sensor: 'gyroscope'};
		tagRecord.rhSensor = {sensor: 'humidity'};
		tagRecord.irTemp = {sensor: 'IR temperature'};
		tagRecord.magneto = {sensor: 'magnetometer'};

		// then turn on notifications:
		tag.notifySimpleKey();

		// set a 5-second read sensors interval:
		setInterval(readSensors, 5000);
	}

	// read all the sensors except the keys:
	function readSensors() {
		tag.readGyroscope(reportGyroscope);
		tag.readAccelerometer(reportAccelerometer);
		tag.readBarometricPressure(reportBarometricPressure);
		tag.readHumidity(reportHumidity);
		tag.readIrTemperature(reportIrTemp);
		tag.readMagnetometer(reportMagnetometer);
	}

	function reportAccelerometer (x, y, z) {
		// read the three values and save them in the
		// sensor value object:
		tagRecord.accel.x = x;
		tagRecord.accel.y = y;
		tagRecord.accel.z = z;
		console.log(tagRecord.accel); // print it
		console.log();
	}

	function reportBarometricPressure(pressure) {
		// read the three values and save them in the
		// sensor value object:
		tagRecord.barometer.pressure = pressure;
		console.log(tagRecord.barometer); // print it
		console.log();
	}

	function reportGyroscope(x, y, z) {
		// read the three values and save them in the
		// sensor value object:
		tagRecord.gyro.x = x;
		tagRecord.gyro.y = y;
		tagRecord.gyro.z = z;
		console.log(tagRecord.gyro); // print it
		console.log();
	}

	function reportHumidity(temperature, humidity) {
		// read the three values and save them in the
		// sensor value object:
		tagRecord.rhSensor.temperature = temperature;
		tagRecord.rhSensor.humidity = humidity;
		console.log(tagRecord.rhSensor); // print it
		console.log();
	}

	function reportIrTemp(objectTemperature, ambientTemperature) {
		// read the three values and save them in the
		// sensor value object:
		tagRecord.irTemp.objectTemperature = objectTemperature;
		tagRecord.irTemp.ambientTemperature = ambientTemperature;
		console.log(tagRecord.irTemp); // print it
		console.log();
	}

	function reportMagnetometer(x, y, z) {
		// read the three values and save them in the
		// sensor value object:
		tagRecord.magneto.x = x;
		tagRecord.magneto.y = y;
		tagRecord.magneto.z = z;
		console.log(tagRecord.magneto); // print it
		console.log();
	}

	function reportSimpleKey(left, right) {
		// read the values and save them in the
		// sensor value object:
		tagRecord.keys.left = left;
		tagRecord.keys.right = right;
		console.log(tagRecord.keys); // print it
		console.log();
	}

	// Now that you've defined all the functions, start the process.
	// connect to the tag and set it up:
	tag.connectAndSetUp(enableSensors);
	// set a listener for when the keys change:
	tag.on('simpleKeyChange', reportSimpleKey);
	// set a listener for the tag disconnects:
	tag.on('disconnect', disconnect);
}

// listen for tags and handle them when you discover one:
SensorTag.discoverAll(handleTag);
