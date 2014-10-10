/**
 * Created by todd on 1/22/14.
 */
var com = require('serialport');

exports.openSerialPort = function(portname)
{
    console.log("Attempting to open serial port "+portname);
    // serialport declared with the var to make it module global
    if (portname == undefined) {
        console.log("Serial port not specified as command line - no serial port open");
        return;

    }

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
    serialPort.on('error', function(error) {
       console.log("serial port failed to open");


//        serialPort.list(function (err, ports) {
//            ports.forEach(function(port) {
//                console.log(port.comName);
//                console.log(port.pnpId);
//                console.log(port.manufacturer);
//            });
//        });
        console.log(error);

    });
    };

exports.write = function(data) {
    serialPort.write(data,function(err, results)
    {
        //console.log('err (undefined is none)' + err);
       // console.log('serialBytes:' + results);
        //   serialPort.write("settime "+timestamp+"\n",function(err, results) {
        //     console.log("set new time"+timestamp);

    });
};
