var Monitor = require('./src/monitor.js');
var monitor = new Monitor({debug:true});
var Path    = require('path');

monitor.enableBluetooth();
monitor.start();

monitor.on('change', (fileName, content) => {

    console.log('File name', fileName);
    console.log('Full path', Path.join(monitor.path, fileName));

    try {
        var json = JSON.parse(content);
        console.log(JSON.stringify(json, null, '\t'));
    }
    catch(error) {
        console.log('File content');
        console.log(content);

    }
});

/*
setTimeout(function() {
    monitor.stop();
}, 1000);

*/
