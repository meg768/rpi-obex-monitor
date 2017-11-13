var Monitor = require('./src/monitor.js');
var monitor = new Monitor({path:'/boot/bluetooth'});

monitor.enableBluetooth();
monitor.start();
