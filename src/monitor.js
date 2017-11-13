
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
        this.watcher  = undefined;

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

        var start = new Date();
        var last  = new Date();
        var timer = undefined;


        this.watcher = fs.watch(this.path, (type, fileName) => {

            function emit() {
                console.log('XXX', type, fileName);
            }

            if (timer != undefined)
                clearTimeout(timer);

            timer = setTimeout(emit, 3000);

            var now = new Date();
            console.log('Type', type, 'Filename', fileName);
            console.log((now - last) / 1000);
            last = now;
        });
    }

    stop() {
        if (this.watcher != undefined) {
            debug('Stopping file monotoring on file', this.fileName);

            this.watcher.close();
            this.watcher = undefined;
        }
    }

/*
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
*/

};
