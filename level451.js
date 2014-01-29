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

};
exports.wsDataIn = function(data,id){

    console.log('received: %s', data,id);
    serial.write(data);
    console.log(data);
};

exports.sDataIn = function(data){
    try{
        var sData = JSON.parse(data);
    console.log(sData);
    }
    catch(err)
    {
        console.log("parse serial data error:"+err);
        console.log(data);
    }

};