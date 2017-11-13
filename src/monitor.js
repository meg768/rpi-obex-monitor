
var fs            = require('fs');
var Events        = require('events');
var ChildProcess  = require('child_process');
var Path          = require('path');

var debugEnabled  = false;

function debug() {
    console.log.apply(this, arguments);
}


module.exports = class Monitor extends Events {

	constructor(options) {
		super();

        var self = this;

        options = Object.assign({timeout:4000}, options);

        if (!options.debug) {
            debug = function() {
            };
        }

        function findObexPath() {
            debug('Finding OBEX path!!');

            var fileName = '/etc/systemd/system/obexpush.service';

            if (!fs.existsSync(fileName))
                throw new Error('OBEX probably not installed.')

            var content = fs.readFileSync(fileName).toString();

            debug('Obex:', content);

            try {
                var match = content.match('ExecStart=.*-o\s*(.*)[^\s].\n');
                var path  = match[1].trim();

                debug('OBEX path:', path);
                return path;

            }
            catch (error) {
                console.log(error);
            }

        }

        if (options.path == undefined)
            options.path = findObexPath();

        if (options.path == undefined)
            throw new Error('A path to monitor must be specified.')

        this.timeout  = options.timeout;
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
                var fullFileName = Path.join(this.path, fileName);

                debug('Change', fileName);

                debug('Reading contents...');
                var content = fs.readFileSync(fullFileName);

                debug('Deleteing file...');
                fs.unlinkSync(fullFileName);

                debug('Emitting changes...');

                self.emit('change', fileName, content);
            }

            if (timer != undefined)
                clearTimeout(timer);

            timer = setTimeout(emit, this.timeout);
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
