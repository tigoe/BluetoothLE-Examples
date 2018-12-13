/*
	sensorTag attitude example using accelerometer, gyrometer, and magnetometer

	This example uses Sandeep Mistry's sensortag library for node.js to
	read data from a TI sensorTag, and Simon Werner's ahrs library
	to calculate heading, pitch, and roll.
	https://github.com/sandeepmistry/node-sensortag
	https://www.npmjs.com/package/ahrs

	created 11 Nov 2017
	by Tom Igoe
*/

var SensorTag = require('sensortag');		// sensortag library

var AHRS = require('ahrs');
var orientation = new AHRS({
    sampleInterval: 10,
    algorithm: 'Madgwick',
    beta: 0.4,
		kp: 0.5,
    ki: 0
});

// listen for tags:
SensorTag.discover(function(tag) {
	// when you disconnect from a tag, exit the program:
	tag.on('disconnect', function() {
		console.log('disconnected!');
		process.exit(0);
	});

	 function report() {
		 if (!tag.accel || !tag.gyro || !tag.magnetometer) {
			 console.log('sensors not ready');
			 return;
		 }
		 orientation.update(tag.gyro.x, tag.gyro.y, tag.gyro.z, tag.accel.x, tag.accel.y, tag.accel.z, tag.magnetometer.x, tag.magnetometer.y, tag.magnetometer.z);
		 var attitude = orientation.getEulerAngles();
		 attitude.heading = attitude.heading / (Math.PI / 180);
		 attitude.pitch = attitude.pitch / (Math.PI / 180);
		 attitude.roll = attitude.roll / (Math.PI / 180);

		 console.log(attitude);
		 console.log();
	 }

   function enableSensors() {		// attempt to enable the sensors
     // when you enable each sensor,
		 // set sensor period and start sensor notifications:
     tag.enableAccelerometer(function() {
			 tag.setAccelerometerPeriod(10, function() {
				 	tag.accel = {};
				  tag.notifyAccelerometer(listenForAccelerometer);
			 });
		 });

		 tag.enableGyroscope(function() {
			 tag.setGyroscopePeriod(100, function(){
				 tag.gyro = {};
				 tag.notifyGyroscope(listenForGyro);
			 });
		 });

		 tag.enableMagnetometer(function() {
			 tag.setMagnetometerPeriod(10, function() {
				 tag.magnetometer = {};
	 		 	 tag.notifyMagnetometer(listenFormagnetometer);
			 });
		 });

		 tag.notifySimpleKey(listenForButton);
   }

   // When you get an accelermeter change, print it out:
	function listenForAccelerometer() {
		tag.on('accelerometerChange', function(x, y, z) {
			tag.accel.x = x;
			tag.accel.y = y;
			tag.accel.z = z;
	   });
	}

	// When you get an accelermeter change, print it out:
 function listenForGyro() {
	 tag.on('gyroscopeChange', function(x, y, z) {
		 tag.gyro.x = x;
		 tag.gyro.y = y;
		 tag.gyro.z = z;
		 report();
		});
 }

 // When you get an accelermeter change, print it out:
 function listenFormagnetometer() {
	tag.on('magnetometerChange', function(x, y, z) {
		tag.magnetometer.x = x;
		tag.magnetometer.y = y;
		tag.magnetometer.z = z;
	 });
 }

	// when you get a button change, print it out:
	function listenForButton() {
		tag.on('simpleKeyChange', function(left, right) {
			if (left) {
				console.log('left: ' + left);
			}
			if (right) {
				console.log('right: ' + right);
			}
			// if both buttons are pressed, disconnect:
			if (left && right) {
				tag.disconnect();
			}
	   });
	}

	// Now that you've defined all the functions, start the process:
	tag.connectAndSetUp(enableSensors);
});
