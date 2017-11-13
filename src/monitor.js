
var fs            = require('fs');
var Events        = require('events');
var ChildProcess  = require('child_process');
var Path          = require('path');

var debugEnabled  = false;

function debug() {
}


module.exports = class Monitor extends Events {

	constructor(options) {
		super();

        options = options || {};

        if (options.debug != undefined) {
            debug = function() {
                console.log.apply(this, arguments);
            };
        }

        if (options.path == undefined)
            throw new Error('A path to monitor must be specified.')

        this.path     = options.path;
        this.watcher  = undefined;

	}



    enableBluetooth(timeout) {

        // Enable Bluetooth
        debug('Enabling Bluetooth...');

        ChildProcess.exec('sudo hciconfig hci0 piscan', (error, stdout, stderr) => {
            if (!error) {
                debug('Bluetooth enabled.');

                if (timeout != undefined)
                    setTimeout(this.disableDiscovery, timeout);
            }
            else {
                console.log(error);
            }
        });

    }

    disableBluetooth() {

        // Disable Bluetooth
        debug('Disabling Bluetooth...');

        ChildProcess.exec('sudo hciconfig hci0 noscan', (error, stdout, stderr) => {
        });

    }

    start() {
        this.stop();

        debug('File monotoring enabled on folder', this.path);

        var timer = undefined;
        var self  = this;

        this.watcher = fs.watch(this.path, (type, fileName) => {


            function emit() {
                console.log('Change', fileName);
                self.emit('change', fileName);
            }

            if (timer != undefined)
                clearTimeout(timer);

            timer = setTimeout(emit, 3000);
        });
    }

    stop() {
        if (this.watcher != undefined) {
            debug('Stopping file monotoring on path', this.path);

            this.watcher.close();
            this.watcher = undefined;
        }
    }


};
