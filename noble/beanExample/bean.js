/*jslint node: true */
"use strict";

/* 
 * 
 */

var Bean = require('ble-bean');

var interval;
var connectedBean;

Bean.discover(function(bean){
  connectedBean = bean;
  console.log("bean discovered");
  process.on('SIGINT', exitHandler.bind(this));

  // bean.on("serial", function(data, valid){
  //   console.log(data.toString());
  // });

  bean.on("disconnect", function(){
    process.exit();
  });

  bean.connectAndSetup(function(){

    var writeData = function(){

      bean.writeOne(new Buffer([getRandomInt(0,255),getRandomInt(0,255),getRandomInt(0,255)]),
      //called when theres data
      function(){
                 console.log("data written");
  
      });
    }

     interval = setInterval(writeData,1000);

  console.log("bean connected and setup");

  });

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
    //no way to know if succesful but often behind other commands going out, so just wait 2 seconds
    console.log('Disconnecting from Device...');
    setTimeout(connectedBean.disconnect.bind(connectedBean, function(){}), 2000);
  } else {
    process.exit();
  }
};

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};