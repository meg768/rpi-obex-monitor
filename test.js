var Monitor = require('./src/monitor.js');
var monitor = new Monitor({path:'/boot/bluetooth', debug:true});

monitor.enableBluetooth();
monitor.start();

setTimeout(function() {
    monitor.stop();
}, 1000);
