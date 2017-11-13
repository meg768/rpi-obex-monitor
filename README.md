# rpi-obex-monitor

Module for detecting when files has been transferred by Bluetooth (using OBEX)

## Installation
	$ npm install rpi-obex-monitor --save


## Usage

````javascript
var Monitor = require('rpi-obex-monitor');
var monitor = new Monitor();
var Path    = require('path');

// Enable Bluetooth discovery, call disableBluetooth() to stop
monitor.enableBluetooth();

// Start monitoring. Stop by calling stop()
monitor.start();

monitor.on('change', (fileName, content) => {

    // The file has already been deleted.
    // File contents is in the contents parameter.
    console.log('File name', fileName);
    console.log('Full path', Path.join(monitor.path, fileName));

    try {
        var json = JSON.parse(content);
        console.log('JSON content');
        console.log(JSON.stringify(json, null, '\t'));
    }
    catch(error) {
        console.log('File content');
        console.log(content);
    }
});
````

### Set up Bluetooth

Make sure Bluetooth is up and running.

    $ sudo bluetoothctl

Enter the following commands

    power on
    agent NoInputNoOutput
    default-agent
    pairable on
    exit

Follow this link to set up Bluetooth file transfer. https://www.raspberrypi.org/forums/viewtopic.php?p=963751#p963751
It will make your Raspberry Pi accept files from your Mac or PC.
