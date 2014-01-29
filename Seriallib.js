/**
 * Created by todd on 1/22/14.
 */
var com = require('serialport');

exports.openSerialPort = function(portname)
{
    console.log("Attempting to open serial port "+portname);
    // serialport declared with the var to make it module global

    serialPort = new com.SerialPort(portname, {
        baudrate: 115200,
// Set the object to fire an event after a \n (chr 13 I think)  is in the serial buffer
        parser: com.parsers.readline("\n")
    });

// I dont understand this call 0 but it works
    serialPort.on("open", function (err,res) {
        console.log("Port open success:"+portname);


    });  //it's console.log('open');

    serialPort.on('data', function(data) {
      //  console.log(data);
        level451.sDataIn(data);

       //     twi.serialDataIn(data);

    });
};

exports.write = function(data) {
    serialPort.write(data,function(err, results)
    {
        //console.log('err (undefined is none)' + err);
        console.log('serialBytes:' + results);
        //   serialPort.write("settime "+timestamp+"\n",function(err, results) {
        //     console.log("set new time"+timestamp);

    });
};
