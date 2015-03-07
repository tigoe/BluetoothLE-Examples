var events = require('events'),
    util = require('util'),
    exec = require('child_process').exec,
    os = require('os');

var Volume = function() {
    this.level = 11;
};
util.inherits(Volume, events.EventEmitter);

Volume.prototype.up = function() {
    this.setLevel(this.level + 1);
};

Volume.prototype.down = function() {
    this.setLevel(this.level - 1);
};

Volume.prototype.setLevel = function(level, callback) {
    this.level = level;

    if (os.platform() === 'darwin') {
        // set the volume via AppleScript see https://github.com/coolaj86/osx-wifi-volume-remote
        exec('osascript -e "set volume output volume ' + level + ' --100%"');
    } else if (os.platform() === 'linux') {
        // set the volume with the command line mixer for ALSA soundcard driver
	    exec('amixer set Master ' + level + '%');
    }

    this.emit('levelChange', this.level);

    if (callback) {
        callback();
    }
};

module.exports = Volume;
