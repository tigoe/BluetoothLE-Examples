/*
	sensorTag Accelerometer example

	This example uses Sandeep Mistry's sensortag library for node.js to
	read data from a TI sensorTag.

	Although the sensortag library functions are all asynchronous,
	there is a sequence you need to follow in order to successfully
	read a tag:
		1) discover the tag
		2) connect to and set up the tag
		3) turn on the sensor you want to use (in this case, accelerometer)
		4) turn on notifications for the sensor
		5) listen for changes from the sensortag

	This example does all of those steps in sequence by having each function
	call the next as a callback. Discover calls connectAndSetUp, and so forth.

	This example is heavily indebted to Sandeep's test for the library, but
	achieves more or less the same thing without using the async library.

	created 15 Jan 2014
	by Tom Igoe
*/


var SensorTag = require('sensortag');		// sensortag library

// listen for tags:
SensorTag.discover(function(tag) {
	// when you disconnect from a tag, exit the program:
	tag.on('disconnect', function() {
		console.log('disconnected!');
		process.exit(0);
	});

	function connectAndSetUpMe() {			// attempt to connect to the tag
     console.log('connectAndSetUp');
     tag.connectAndSetUp(enableAccelMe);		// when you connect and device is setup, call enableAccelMe
   }

   function enableAccelMe() {		// attempt to enable the accelerometer
     console.log('enableAccelerometer');
     // when you enable the accelerometer, start accelerometer notifications:
     tag.enableAccelerometer(notifyMe);
   }

	function notifyMe() {
   	tag.notifyAccelerometer(listenForAcc);   	// start the accelerometer listener
		tag.notifySimpleKey(listenForButton);		// start the button listener
   }

   // When you get an accelermeter change, print it out:
	function listenForAcc() {
		tag.on('accelerometerChange', function(x, y, z) {
	     console.log('\tx = %d G', x.toFixed(1));
	     console.log('\ty = %d G', y.toFixed(1));
	     console.log('\tz = %d G', z.toFixed(1));
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
	connectAndSetUpMe();
});