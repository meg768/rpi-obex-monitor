
var fs            = require('fs');
var Events        = require('events');
var ChildProcess  = require('child_process');
var Watch         = require('watch');
var Path          = require('path');

function debug() {
    console.log.apply(this, arguments);
}


module.exports = class Monitor extends Events {

	constructor(options) {
		super();

        options = options || {};

        if (options.path == undefined)
            throw new Error('A path to monitor must be specified.')

        this.path     = options.path;
        this.monitor  = undefined;

	}



    enableDiscovery(timeout) {

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

    disableDiscovery() {

        // Disable Bluetooth
        debug('Disabling Bluetooth...');

        ChildProcess.exec('sudo hciconfig hci0 noscan', (error, stdout, stderr) => {
        });

    }


    start() {

        this.stop();

        debug('File monotoring enabled on folder', this.path);

		Watch.createMonitor(this.path, (monitor) => {

            this.monitor = monitor;

			monitor.on('created', (file, stat) => {
                debug('File created.', file, stat);
				this.emit('created', file, stat);
			});

			monitor.on('changed', (file, stat) => {
                debug('File changed.', file, stat);
				this.emit('changed', file, stat);
			});

			monitor.on('removed', (file, stat) => {
                debug('File removed.', file, stat);
				this.emit('removed', file, stat);
			});


		});

	}

    stop() {
        if (this.monitor != undefined) {
            debug('Stopping file monotoring on file', this.fileName);

            this.monitor.stop();
            this.monitor = undefined;
        }
    }


};
