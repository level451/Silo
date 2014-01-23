/**
 * Created by todd on 1/22/14.
 */
//global.SerialLib = require('./Seriallib');
//global.websock = require('./websocketlib');
websock = require('./websocketlib');
serial = require('./Seriallib');
exports.setup = function(){

        serial.openSerialPort('com3'); //windows
   //     seriallib.openSerialPort("/dev/ttyACM0"); //not windows
        websock.listen();



}