var logDisplay;		// an HTML element for displaying data
var currentDevice;
var deviceMenu;

function setup() {
	createCanvas(windowWidth, windowHeight);
	// create an HTML div for placing text in:
	createHTML();
}

function draw() {
	background('#0077ff');
	printData(JSON.stringify(accelerometer));
}

// create some HTML elements in the sketch:
function createHTML() {
	// make the connect and disconnect buttons and the device menu
	var connectButton = createButton('connect');
	var disconnectButton = createButton('disconnect');
	deviceMenu = createSelect();
	deviceMenu.option('Devices:');	
	connectButton.position(0, 0);
	connectButton.mouseReleased(connect);
	disconnectButton.position(80, 0);
	disconnectButton.mouseReleased(disconnectDevice);
	deviceMenu.changed(selectDevice);
	deviceMenu.position(160,0);
	// make a div to display text:
	logDisplay = createElement('div', 'incoming data goes here');
	// make it WCAG-compliant:
	logDisplay.attribute('aria-label', 'incoming data');
	logDisplay.attribute('aria-role', 'alert');
	logDisplay.attribute('aria-live', 'polite');
	// make the text white:
	logDisplay.style('color', 'white');
	// position it:
	logDisplay.position(10, 40);
}

function printData(inString) {
	// put the input in the logDisplay div:
	logDisplay.html('log: ' + inString);
}

function addDevice(thisDevice) {
	deviceMenu.option(thisDevice.name);
	deviceMenu.value(thisDevice.name);
	currentDevice = thisDevice;
}

function selectDevice() {
	// TODO set currentDevice here from deviceMenu.value()
	console.log(deviceMenu.value());
	for (let dev of devices) {
		if (dev.name == deviceMenu.value()) {
			currentDevice = dev;
		}
	}
} 

function disconnectDevice() {
	disconnect(currentDevice);
}
