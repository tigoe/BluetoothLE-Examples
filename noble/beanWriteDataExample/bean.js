/*
  Bean write data example
  
  This example uses the first (of five available) Scratch characteristic to write data to the bean.
  You need to upload the bean_LED example (same github folder) to your Bean.
  Read more about ScratchData: https://punchthrough.com/bean/the-arduino-reference/setscratchdata/
  
  created 30 Mar 2015
  by Maria Paula Saba based on Jacob Rosenthal examples
  
*/

/*jslint node: true */
"use strict";

//require node module ble-bean (based on noble)
var Bean = require('ble-bean');

var beanUUID = "ae2248ed636246909b2584873d711b8e";
var interval;
var connectedBean;

//here we discover any bean and automatically connects. 
Bean.discover(function(bean){
	
	connectedBean = bean;	
    console.log("bean discovered");
    process.on('SIGINT', exitHandler.bind(this));
	

  //We can set a conditional to keep connected
  if(bean.uuid == beanUUID){
	bean.connectAndSetup(function(){
		//save the data you want to send in a buffer  

		var writeData = function(){
      var bufferData = new Buffer([getRandomInt(0,255),getRandomInt(0,255),getRandomInt(0,255)]);
			bean.writeOne(bufferData, function(){
					 console.log("data written");
			});
		}

		//this interval will run writeData function every second
		interval = setInterval(writeData,1000);
		console.log("bean connected and setup");

  	});
	  
	bean.on("disconnect", function(){
		console.log("quitting the program");  
		process.exit();
	});
  } 
  else{
	console.log("not my bean"); 
  }
});

process.stdin.resume();//so the program will not close instantly
var triedToExit = false;

//turns off led before disconnecting
var exitHandler = function exitHandler() {
  var self = this;
  if (connectedBean && !triedToExit) {
    triedToExit = true;
    console.log('Turning off led...');
    clearInterval(interval);
    connectedBean.setColor(new Buffer([0x0,0x0,0x0]), function(){});
    console.log('Disconnecting from Device...');
    setTimeout(connectedBean.disconnect.bind(connectedBean, function(){}), 2000);
  } 
  else {
    process.exit();
  }
};

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};