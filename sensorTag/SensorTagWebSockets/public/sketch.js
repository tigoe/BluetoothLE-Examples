var socket = new WebSocket("ws://localhost:8081");

function setup() {
	// The socket connection needs two event listeners:
	socket.onopen = openSocket;
	socket.onmessage = showData;

	// make a new div and position it at 10, 10:
	text = createDiv("Sensor reading:");
	text.position(10,10);
}

function openSocket() {
	text.html("Socket open");
	socket.send("Hello server");
}
/*
showData(), below, will get called whenever there is new data
from the server. So there's no need for a draw() function:
*/
function showData(result) {
	// when the server returns, show the result in the div:
	text.html("Sensor reading:" + result.data);
	xPos = int(result.data);        // convert result to an integer
	text.position(xPos, 10);        // position the text
}
