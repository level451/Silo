/**
 * Created by todd on 1/22/14.
 */
//global.SerialLib = require('./Seriallib');
//global.websock = require('./websocketlib');
global.gathererSettings = {}; //setting from the settings database
websock = require('./websocketlib');
serial = require('./Seriallib');
MongoClient = require('mongodb').MongoClient;

exports.setup = function(){

        serial.openSerialPort('com6'); //windows
   //     seriallib.openSerialPort("/dev/ttyACM0"); //not windows
        websock.listen();
// mongo
    MongoClient.connect("mongodb://localhost:27017/gatherer", function(err, db)
    {
        if (err)
        {
            console.log("Connection to mongo failed:"+err)  ;
        }
        else
        {
            console.log("TWI: We are connected to mondo test database");
            //global.collectionLog = db.collection('log');
            //global.collectionAvg = db.collection('avg');
            global.cSettings = db.collection('settings');

            //collectionLog.ensureIndex({"UnitID":1},function (err,res){});
            //collectionLog.ensureIndex({"Time":1},function (err,res){});
            //collectionAvg.ensureIndex({"Time":1},function (err,res){});
            //collectionAvg.ensureIndex({"period":1},function (err,res){});

            //setInterval(function(){updateAvg();}, 60000);
            //setInterval(function(){updateAvgLong();},600000);

            // updateAvg();
            //console.log("average updates set to 60 seconds");
            cSettings.findOne({"type":"gatherer"},function(err,result){
                if (result){
                    gathererSettings=result;
                } else
                {
                    gathererSettings.type = "gatherer";
                    gathererSettings.id = {"1":{"name":"Parent"}};

                    console.error("Gatherer Settings missing");
                    cSettings.insert(gathererSettings,function (err,res){
                        console.log("Gatherer settings created "+res);
                    });

                }

            });
        }

    });


};



exports.wsDataIn = function(data,id){

    console.log('received: %s', data,id);
    //serial.write(data);

    // if you want to get socket data it's here!!
    try{
        var webData = JSON.parse(data);

    }
    catch(err)
    {
        console.log("parse web data error"+err)
    }
    console.log(webData);
    console.log('Packettype '+webData.packettype);
    if (webData.packettype == "packet"){
        serial.write(webData.data)
    }
    if (webData.packettype == "query"){
        console.log('query request');
        console.log('period:'+webData.period);

        var update = {};
        x= new Date();

        x=new Date(x-(3600000*webData.lastHours)); // 2 hours age
        //collectionAvg.find({"Time":{$gt:x}},{_id:0,"Time":0}).sort( { "Time": 1 } ).toArray(function(err,item)
        collectionAvg.find({"Time":{$gt:x},"period":(webData.period*1)},{_id:0}).sort( { "Time": 1} ).toArray(function(err,resultdata){

            try
            {
                update.datatype="query";
                update.data = resultdata;

                comlib.websocketsend(JSON.stringify(update));
            }
            catch(err)
            {
                console.log("ws error from incoming query"+err);
            }

        });
    }
    if (webData.packettype == "Gatherer settings save"){

        gatherer = webData.data;
        gatherer.type = 'gatherer';
       // delete sensors._id;

        cSettings.update({'type':'gatherer'},gatherer,{upsert:true, w:1},function(err,res){

            console.log('Gatherer Setting updated');
        });


    }




};

exports.sDataIn = function(data){
    try{
        var sData = JSON.parse(data);
        sData.dataType = "Serial";
        if (sData.Type == 19){
          level451.blink();

        };
        websock.send(JSON.stringify(sData) );
        //console.log(sData);

    }
    catch(err)
    {
        console.log("parse serial data error:"+err);
        console.log(data);
    }

};
exports.saveSensorSettings = function(){};
exports.blink = function(){
   serial.write("r 5 100 42 50 10 10\n");
   setTimeout(function(){level451.blinkoff()},150);
//console.log("blink");
};
exports.blinkoff = function(){
    serial.write("r 5 100 42 0 0 0\n");

  //  console.log("blink off");
};