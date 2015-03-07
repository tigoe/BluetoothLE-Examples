var bleno = require('bleno');

var uuid = 'ad5d9ece-9331-48c2-b597-2845aac4a8f0';
var major = 0x12; // 0x0000 - 0xffff
var minor = 0x08; // 0x0000 - 0xffff
var measuredPower = -18; // -128 - 127

bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower);
