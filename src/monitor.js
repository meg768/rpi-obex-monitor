
var fs            = require('fs');
var Events        = require('events');
var ChildProcess  = require('child_process');
var Path          = require('path');


function debug() {
}


module.exports = class Monitor extends Events {

	constructor(options) {
		super();

		var self = this;

		var defaults = {
			timeout : 4000,
			service : '/etc/systemd/system/obexpush.service'
		}

		options = Object.assign(defaults, options);

		if (options.debug) {
			debug = function() {
				console.log.apply(this, arguments);
			};
		}

		function getObexPath() {
			debug('Finding OBEX path...');

			var fileName = options.service;

			if (!fs.existsSync(fileName))
				throw new Error('OBEX probably not installed.');

			var content = fs.readFileSync(fileName).toString();

			debug('OBEX content:', content);

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
			options.path = getObexPath();

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

		function processFile(fileName) {
			var fullFileName = Path.join(self.path, fileName);

            if (fs.existsSync(fullFileName) && !fs.statSync(fullFileName).isDirectory()) {
				debug('Reading contents from', fullFileName, '...');
				var content = fs.readFileSync(fullFileName);

				debug('Deleteing file', fullFileName, '...');
				fs.unlinkSync(fullFileName);

				self.emit('upload', fileName, content);

            }
		}

		// Process all existing files
		fs.readdirSync(this.path).forEach(file => {
			processFile(file);
		});

		this.watcher = fs.watch(this.path, (type, fileName) => {

			debug('File watch:', type, fileName);

			if (timer != undefined)
				clearTimeout(timer);

			timer = setTimeout(processFile.bind(null, fileName), this.timeout);

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
