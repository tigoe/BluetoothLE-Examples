var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;

var VolumeCharacteristic = function(volume) {
    VolumeCharacteristic.super_.call(this, {
        uuid: 'f1f3c6d1-8193-487e-a931-16017119cffe',
        properties: ['read', 'write', 'writeWithoutResponse', 'notify']
    });

    this._volume = volume;

    this._volume.on('levelChange', this.onVolumeLevelChange.bind(this));
};
util.inherits(VolumeCharacteristic, BlenoCharacteristic);

VolumeCharacteristic.prototype.onVolumeLevelChange = function(level) {
    console.log("Volume Changed to " + level);

    if (this.updateValueCallback) {
        this.updateValueCallback(new Buffer([level]));
    }
};

VolumeCharacteristic.prototype.onReadRequest = function(offset, callback) {
    callback(this.RESULT_SUCCESS, new Buffer([this._volume.level]));
};

VolumeCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    var level = data.readUInt8(0);

    this._volume.setLevel(level, function() {
        callback(this.RESULT_SUCCESS);
    }.bind(this));
};

module.exports = VolumeCharacteristic;
