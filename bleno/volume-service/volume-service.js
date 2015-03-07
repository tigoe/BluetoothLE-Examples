var util = require('util');
var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;
var VolumeCharacteristic = require('./volume-characteristic');

function VolumeService(volume) {
  VolumeService.super_.call(this, {
      uuid: 'f1f3c6d0-8193-487e-a931-16017119cffe',
      characteristics: [
          new VolumeCharacteristic(volume)
      ]
  });
}

util.inherits(VolumeService, BlenoPrimaryService);

module.exports = VolumeService;
