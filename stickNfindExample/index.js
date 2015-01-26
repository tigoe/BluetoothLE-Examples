
var events = require('events');
var util = require('util');

var noble = require('noble');

var STICKNFIND_UUID = '6d25a0fa4488400e834d7288b13a4e8d';

var GENERIC_ACCESS_SERVICE_UUID = '1800';
var DEVICE_NAME_CHARACTERISTIC_UUID = '2a00';

var DEVICE_INFORMATION_SERVICE_UUID = '180a';
var MANUFACTURER_NAME_CHARACTERISTIC_UUID = '2a29';
var MODEL_NUMBER_CHARACTERISTIC_UUID = '2a24';
var SERIAL_NUMBER_CHARACTERISTIC_UUID = '2a25';
var HARDWARE_REVISION_CHARACTERISTIC_UUID = '2a27';
var SOFTWARE_REVISION_CHARACTERISTIC_UUID = '2a28';

var ALERT_LEVEL_SERVICE_UUID = '1802';
var ALERT_LEVEL_CHARACTERISTIC_UUID = '2a06';

var TX_POWER_SERVICE_UUID = '1804';
var TX_POWER_LEVEL_CHARACTERISTIC_UUID = '2a07';

var LINK_LOSS_SERVICE_UUID = '1803';

var BATTERY_SERVICE_UUID = '180f';
var BATTERY_LEVEL_CHARACTERISTIC_UUID = '2a19';


function StickNFind(peripheral) {
  this._peripheral = peripheral;
  this._services = {};
  this._characteristics = {};

  this.uuid = peripheral.uuid;

  this._peripheral.on('disconnect', this.onDisconnect.bind(this));
}

util.inherits(StickNFind, events.EventEmitter);


StickNFind.discover = function(callback) {
  noble.once('stateChange', function() {
    var onDiscover = function(peripheral) {
      if (peripheral.advertisement.localName === 'StickNfind') {
        noble.removeListener('discover', onDiscover);
        noble.stopScanning();

        var sticknfind = new StickNFind(peripheral);
        callback(sticknfind);
      }
    };

    noble.on('discover', onDiscover);
    noble.startScanning(); //[STICKNFIND_UUID], true);
  });
};

StickNFind.prototype.connect = function(callback) {
  this._peripheral.connect(callback);
};

StickNFind.prototype.disconnect = function(callback) {
  this._peripheral.disconnect(callback);
};

StickNFind.prototype.onDisconnect = function() {
  this.emit('disconnect');
};

StickNFind.prototype.discoverServicesAndCharacteristics = function(callback) {
  this._peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics) {
    if (error === null) {
      for (var i in services) {
        var service = services[i];
        var serviceUuid = service.uuid;

        this._services[serviceUuid] = service;

        this._characteristics[serviceUuid] = {};

        for(var j in services[i].characteristics) {
          var characteristic = services[i].characteristics[j];

          this._characteristics[serviceUuid][characteristic.uuid] = characteristic;
        }
      }
    }

    callback();
  }.bind(this));
};

StickNFind.prototype.writeCharacteristic = function(serviceUuid, characteristicUuid, data, callback) {
  this._characteristics[serviceUuid][characteristicUuid].write(data, false, callback);
};

StickNFind.prototype.readCharacteristic = function(serviceUuid, characteristicUuid, callback) {
  this._characteristics[serviceUuid][characteristicUuid].read(function(error, data) {
    callback(data);
  });
};

StickNFind.prototype.readStringCharacteristic = function(serviceUuid, characteristicUuid, callback) {
  this.readCharacteristic(serviceUuid, characteristicUuid, function(data) {
    callback(data.toString());
  });
};

StickNFind.prototype.writeStringCharacteristic = function(serviceUuid, characteristicUuid, string, callback) {
  this.writeCharacteristic(serviceUuid, characteristicUuid, new Buffer(string), callback);
};

StickNFind.prototype.readDeviceName = function(callback) {
  this.readStringCharacteristic(GENERIC_ACCESS_SERVICE_UUID, DEVICE_NAME_CHARACTERISTIC_UUID, callback);
};

StickNFind.prototype.writeDeviceName = function(deviceName, callback) {
  this.writeStringCharacteristic(GENERIC_ACCESS_SERVICE_UUID, DEVICE_NAME_CHARACTERISTIC_UUID, deviceName, callback);
};

StickNFind.prototype.readManufacturerName = function(callback) {
  this.readStringCharacteristic(DEVICE_INFORMATION_SERVICE_UUID, MANUFACTURER_NAME_CHARACTERISTIC_UUID, callback);
};

StickNFind.prototype.readModelNumber = function(callback) {
  this.readStringCharacteristic(DEVICE_INFORMATION_SERVICE_UUID, MODEL_NUMBER_CHARACTERISTIC_UUID, callback);
};

StickNFind.prototype.readSerialNumber = function(callback) {
  this.readStringCharacteristic(DEVICE_INFORMATION_SERVICE_UUID, SERIAL_NUMBER_CHARACTERISTIC_UUID, callback);
};

StickNFind.prototype.readHardwareRevision = function(callback) {
  this.readStringCharacteristic(DEVICE_INFORMATION_SERVICE_UUID, HARDWARE_REVISION_CHARACTERISTIC_UUID, callback);
};

StickNFind.prototype.readSoftwareRevision = function(callback) {
  this.readStringCharacteristic(DEVICE_INFORMATION_SERVICE_UUID, SOFTWARE_REVISION_CHARACTERISTIC_UUID, callback);
};

StickNFind.prototype.readAlertLevelFromService = function(serviceUuid, callback) {
  this.readCharacteristic(serviceUuid, ALERT_LEVEL_CHARACTERISTIC_UUID, function(data) {
    var alertLevel = 'unknown';

    if (data[0] === 0x00) {
      alertLevel = 'none';
    } else if (data[0] === 0x01) {
      alertLevel = 'mild';
    } else if (data[0] === 0x02) {
      alertLevel = 'high';
    }

    callback(alertLevel);
  });
};

StickNFind.prototype.writeAlertLevelToService = function(serviceUuid, alertLevel, callback) {
  var level = 0;

  if (alertLevel === 'mild') {
    level = 0x01;
  } else if (alertLevel === 'high') {
    level = 0x02;
  }

  this.writeCharacteristic(serviceUuid, ALERT_LEVEL_CHARACTERISTIC_UUID, new Buffer([level]), function() {
    callback();
  });
};

StickNFind.prototype.readAlertLevel = function(callback) {
  this.readAlertLevelFromService(ALERT_LEVEL_SERVICE_UUID, callback);
};

StickNFind.prototype.writeAlertLevel = function(alertLevel, callback) {
  this.writeAlertLevelToService(ALERT_LEVEL_SERVICE_UUID, alertLevel, callback);
};

StickNFind.prototype.readLinkLossAlertLevel = function(callback) {
  this.readAlertLevelFromService(LINK_LOSS_SERVICE_UUID, callback);
};

StickNFind.prototype.writeLinkLossAlertLevel = function(alertLevel, callback) {
  this.writeAlertLevelToService(LINK_LOSS_SERVICE_UUID, alertLevel, callback);
};

StickNFind.prototype.readTxPowerLevel = function(callback) {
  this.readCharacteristic(TX_POWER_SERVICE_UUID, TX_POWER_LEVEL_CHARACTERISTIC_UUID, function(data) {
    callback(data.readInt8(0));
  });
};

StickNFind.prototype.readBatteryLevel = function(callback) {
  this.readCharacteristic(BATTERY_SERVICE_UUID, BATTERY_LEVEL_CHARACTERISTIC_UUID, function(data) {
    callback(data.readUInt8(0));
  });
};

module.exports = StickNFind;