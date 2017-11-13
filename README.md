# rpi-obex-monitor

Module for detecting when files has been transferred by Bluetooth (using OBEX)

## Installation
	$ npm install rpi-bluetooth-monitor --save


## Usage

    var Monitor = require('rpi-bluetooth-monitor');
    var Monitor = new Monitor();


### Set up Bluetooth

Make sure Bluetooth is up and running.

````bash
sudo bluetoothctl
````

Enter the following commands

    power on
    agent NoInputNoOutput
    default-agent
    pairable on
    exit

Follow this link to set up Bluetooth file transfer. https://www.raspberrypi.org/forums/viewtopic.php?p=963751#p963751
It will make your Raspberry Pi accept files from your Mac or PC.
