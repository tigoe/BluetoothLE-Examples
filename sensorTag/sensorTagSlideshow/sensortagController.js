/*
	sensorTag Keynote Slide Controller

	This example uses Sandeep Mistry's sensortag library for node.js to
	control AppleScrpt.

	Although the sensortag library functions are all asynchronous,
	there is a sequence you need to follow in order to successfully
	read a tag:
		1) discover the tag
		2) connect to and set up the tag
		3) turn on the sensor you want to use (in this case, accelerometer)
		4) turn on notifications for the sensor
		5) listen for changes from the sensortag

	This example does all of those steps in sequence by having each function
	call the next as a callback. Discover calls connectAndSetUpMe and so forth.

	This example is heavily indebted to Sandeep's test for the library, but
	achieves more or less the same thing without using the async library.
	It is also heavily indebted to Marco Stagni's notes on AppleScript and node.js
	here: http://marcostagni.com/applescript-and-node-js/

	To run this, node sensortagController.js, then start a slideshow in Keynote
	or PowerPoint. This script will send the right and left keystrokes when you press
	the buttons on the sensorTag.

	created 27 Feb 2015
	by Tom Igoe
*/


var SensorTag = require('sensortag');		// sensortag library
var applescript = require('applescript');	// applescript library

function runFile(filename) {
	applescript.execFile( filename, function(err, data) {
	    if (err, data) {
	        //handle error event
	    } else {
	        //handle data from applescript
	        //this is both succesful data and error data.
	    }
	});
}
// listen for tags:
SensorTag.discover(function(tag) {
	// when you disconnect from a tag, exit the program:
	tag.on('disconnect', function() {
		console.log('disconnected!');
		process.exit(0);
	});

	function connectAndSetUpMe() {			// attempt to connect to the tag
     console.log('connectAndSetUp');
     tag.connectAndSetUp(notifyMe);		// when you connect, call notifyMe
   }

	function notifyMe() {
 		tag.notifySimpleKey(listenForButton);		// start the button listener
   }

	// when you get a button change, print it out:
	function listenForButton() {
		tag.on('simpleKeyChange', function(left, right) {
			// if both buttons are pressed, disconnect:
			if (left && right) {
				console.log('both');
				tag.disconnect();
			} else				// if left, send the left key
			if (left) {
				console.log('left: ' + left);
				runFile('left.scpt');
			}  else
			if (right) {		// if right, send the right key
				console.log('right: ' + right);
				runFile('right.scpt');
			}
	   });
	}

	// Now that you've defined all the functions, start the process:
	connectAndSetUpMe();
});
