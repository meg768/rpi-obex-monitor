var Monitor = require('./src/monitor.js');
//var monitor = new Monitor({path:'/boot/bluetooth', debug:false});
var monitor = new Monitor({debug:true});
var Path    = require('path');

monitor.enableBluetooth();
monitor.start();

monitor.on('change', (fileName) => {
    console.log('File changed.');
    console.log('File name', fileName);
    console.log('Full path', Path.join(monitor.path, fileName));
});

/*
setTimeout(function() {
    monitor.stop();
}, 1000);

*/
