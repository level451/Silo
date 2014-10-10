/**
 * Created by todd on 1/22/14.
 */
//global.SerialLib = require('./Seriallib');
//global.websock = require('./websocketlib');
global.gathererSettings = {}; //setting from the settings database
websock = require('./websocketlib');
serial = require('./Seriallib');
MongoClient = require('mongodb').MongoClient;
lastdata = {}
commandRetries = 0;
exports.setup = function(){

   //     seriallib.openSerialPort("/dev/ttyACM0"); //not windows
        websock.listen();
// mongo
    MongoClient.connect("mongodb://localhost:27017/gatherer", function(err, db)
  //MongoClient.connect("mongodb://10.6.1.138:27017/gatherer", function(err, db)
    {
        if (err)
        {
            console.log("Connection to mongo failed:"+err)  ;
        }
        else
        {

            db.createCollection("log", { capped : true, size : 1000000000, max : 25000000 },function (err,res){} );
            db.createCollection("avg1", { capped : true, size : 1000000000, max : 2628000 },function (err,res){} );

            console.log("Connected to database!");
            global.cLog = db.collection('log');
            global.cAvg1 = db.collection('avg1');
            global.cAvg60 = db.collection('avg60');
            global.cAvg1440 = db.collection('avg1440');
            global.cSettings = db.collection('settings');

            cLog.ensureIndex({"ID":1},function (err,res){});
            cLog.ensureIndex({"Time":1},function (err,res){});
            cAvg1.ensureIndex({"Time":1},function (err,res){});
            cAvg60.ensureIndex({"Time":1},function (err,res){});
            cAvg1440.ensureIndex({"Time":1},function (err,res){});

            setInterval(function(){updateAvg();}, 2000);
            setInterval(function(){updateAvglong();}, 60000);

            // temp
           // lastdata.temp = new Date("2014-02-24T20:46:01.834Z");
            //setInterval(function(){calctemp();}, 100);

            // end
            lastdata.minute = -1;
            lastdata.hour = -1;
            lastdata.day = -1;


            cSettings.findOne({"type":"gatherer"},function(err,result){
                if (result){
                    gathererSettings=result;


                    // open the seial port after mongo is open

                    serial.openSerialPort(process.argv[2]); // port passed by command line parameter
                    //     serial.openSerialPort("/dev/ttyACM0"); //not windows usb

                       //  serial.openSerialPort("/dev/ttyAMA0"); //not windows rs232


                } else
                {
                    gathererSettings.type = "gatherer";
                    gathererSettings.id = {"1":{"name":"Parent"}};

                    console.error("Gatherer Settings missing");
                    cSettings.insert(gathererSettings,function (err,res){
                        console.log("Gatherer settings created "+res);
                        // open the serial port after mongo is open
                        serial.openSerialPort(process.argv[2]); // port passed by command line parameter
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
    //console.log(webData);
    //console.log('Packettype '+webData.packettype);
    if (webData.packettype == "radioSetID"){
      level451.radioSetID(webData.unit);
    }
    if (webData.packettype == "radioPingTest"){
        pingtest(webData.unit,function(rslt,txt) {
            console.log("Ping",txt);
            rv={}
            rv.packettype = 'radioPingTestResults';
            rv.rslt = rslt;
            rv.text = txt;
            rv.unit = webData.unit;
            websock.send(JSON.stringify(rv),id);

        });
    }
    if (webData.packettype == "packet"){
        serial.write(webData.data)
    }
    if (webData.packettype == "packetWithRetry"){

        level451.retryWrite(webData.data,function(rslt,text){
            console.log("retryWrite callback success",rslt,text);
            rv={}
            rv.packettype = 'commandResults';
            rv.rslt = rslt;
            rv.text = text;
            websock.send(JSON.stringify(rv),id)
        });

        serial.write(webData.data)
    }
    if (webData.packettype == "query"){
      //  console.log('query request');


        webData.startTime = new Date(webData.startTime) ;
        webData.endTime = new Date(webData.endTime) ;
//        cLog.find({"Time":{$gt:webData.startTime},"Time":{$lt:webData.endTime}},{_id:0}).sort( { "Time": 1} ).toArray(function(err,resultdata)
        if (webData.type == "avg1440"){
            cAvg1440.find(  {"Time":{$lt:webData.endTime,$gt:webData.startTime}},{_id:0}).sort( { "Time": 1} ).toArray(function(err,resultdata){
                webData.data = resultdata;

                try
                {
                    //  console.log(resultdata);

                    websock.send(JSON.stringify(webData));
                }
                catch(err)
                {
                    console.log("ws error from incoming query"+err);
                }

            });

        }
        if (webData.type == "avg60"){
            cAvg60.find(  {"Time":{$lt:webData.endTime,$gt:webData.startTime}},{_id:0}).sort( { "Time": 1} ).toArray(function(err,resultdata){
                webData.data = resultdata;

                try
                {
                    //  console.log(resultdata);

                    websock.send(JSON.stringify(webData));
                }
                catch(err)
                {
                    console.log("ws error from incoming query"+err);
                }

            });

        }
        if (webData.type == "avg1"){
            cAvg1.find(  {"Time":{$lt:webData.endTime,$gt:webData.startTime}},{_id:0}).sort( { "Time": 1} ).toArray(function(err,resultdata){
                webData.data = resultdata;

            try
            {
            //  console.log(resultdata);
                //console.log("data length",webData.data.length);

                websock.send(JSON.stringify(webData));
            }
            catch(err)
            {
                console.log("ws error from incoming query"+err);
            }

        });

        }
        if (webData.type == "log"){
            cLog.find(  {"Time":{$lt:webData.endTime,$gt:webData.startTime}},{_id:0}).sort( { "Time": 1} ).toArray(function(err,resultdata){
                webData.data = resultdata;

                try
                {
                      console.log(webData.data.length);

                    websock.send(JSON.stringify(webData));
                }
                catch(err)
                {
                    console.log("ws error from incoming query"+err);
                }

            });

        }
        if (webData.type == "test"){
        //    dataAverage(webData.startTime,webData.endTime);
        // build the stupid query - there is probably a better way

            dataAverage( webData.endTime,1440);


        }

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


exports.retryWrite = function(command,cback){
// sends a command (usually out the radio) and retries until it get confirmation of success

    if (commandRetries == 0){
    commandRetries = 1;
    pingReturn = 0;
    savecommand = command;
    callback = cback; // save the callback because this function calls itself

    serial.write(savecommand);
        console.log(savecommand);
        setTimeout(function(){level451.retryWrite();},250);
    } else {
    if (commandRetries < 15 &&  pingReturn == 0 )
    {
        console.log("Retry Command",commandRetries);

        commandRetries++;
        serial.write(savecommand);
        setTimeout(function(){level451.retryWrite();},250);
        return;
    }
    if ( pingReturn > 0 ){
        commandRetries=0;
        if (callback){
            return callback(0,"Success");
        }
        console.log("Command success");

        return;

    }
    if (commandRetries >= 15 ){
        console.log("command may have failed");
        commandRetries=0;
        if (callback){
           return callback(-1,"Retry limit exceeded without confirmation - command may have failed");
        }
        return;
    }

    }
}

function infoToDisplay(txt){


    rv={}
    rv.packettype = 'infoToDisplay';

    rv.text = txt;
    websock.send(JSON.stringify(rv));
console.log("sending info to display",txt);
}
exports.radioSetID = function(unit){

    infoToDisplay("Checking to see if ID"+unit+" is available");


    pingtest(unit,function(rslt,text) {

        if (rslt == 0){
            infoToDisplay("ID "+unit+ " appears available");

        infoToDisplay("Searching for a new unit (ID 0)");
        pingtest(0, function (rslt, text) {
            console.log("Ping Results " + text, rslt);
            // now call retry command
            if (rslt == 0) {
                infoToDisplay("Failed to contact new unit (ID 0)");
                return;

            }
            if (rslt > 2) {

                infoToDisplay("Unit found! " + rslt + "0% - attempting to assigning unit id of " + unit);

                level451.retryWrite("r 0 " + unit + " 112\n", function (rslt, text) {
                    //console.log("retryWrite callback success",rslt,text);
                    if (rslt == 0) {
                        infoToDisplay("Unit ID assigned");

                    } else {
                        infoToDisplay("Unit ID may have failed ");
                    }
                    infoToDisplay("Attempting to contact unit on new id")

                    pingtest(unit, function (rslt, text) {
                        if (rslt > 0) {
                            infoToDisplay("Success - new ID of "+unit+" assigned " + rslt + "0%");

                            rv={}
                            rv.packettype = 'addedNewGatherer';

                            rv.id = unit;
                            websock.send(JSON.stringify(rv));




                        } else {
                            infoToDisplay("Fail to contact new unit ID - please retry")
                        }


                    });


                });


            } else {
                // failed poor link qualtiy
                infoToDisplay("Unit found - link quality too low " + rslt + "0% - adjust location and retry");
            }


//        level451.retryWrite("r "+unit+" 1 228 63 2 55 55\n",function(rslt,text){
//            console.log("retryWrite callback success",rslt,text);
//
//        });


        });}
        else
        {
            infoToDisplay("Id already in use");
        }
    });
    //pingUnit = unit;
}
function pingtest(unit,callback){
    pingUnit=unit;
    pingCount = 10;
    pingReturn = 0;

    serial.write("r "+pingUnit+" 1 129\n");
    setTimeout(function(){pingTimer(callback);},200);


}
function pingTimer(callback){
    pingCount-- ;
    if (pingCount > 0){
        serial.write("r "+pingUnit+" 1 129\n");
       // console.log("ping sent");
        setTimeout(function(){pingTimer(callback);},200);

    }else
    {

        //console.log("ping finished",global.pingReturn);
        if (callback){
            return callback(pingReturn,pingReturn+"/10");
        }

    }


}

exports.sDataIn = function(data){
    try{
        var sData = JSON.parse(data);
    }
    catch(err)
    {
        console.log("parse serial data error:"+err);
        console.log(data);
        return;
    }
    if (typeof sData.ID == "undefined"){
        console.log ("no id found in data");
        return;
     }
    if ( sData.Type == 1 )
    {
     pingReturn++;
    return;

    }


    var dedupe = {};
//only record the enableds sensor in settings
//only record if value has changed
    dedupe.ID = sData.ID;
    dedupe.Time = new Date();
for (prop in sData){
    if (prop.indexOf("_") > 0){
          var cprop = prop.substring(0,prop.indexOf("_"));
            //console.log(cprop);
            //console.log(typeof gathererSettings.id[sData.ID].sensor[cprop]);
            if (lastdata[sData.ID] == undefined){
                lastdata[sData.ID] = {};
            }
        // was erroring here 10/10 - with new databaswe
            if ( typeof gathererSettings.id[sData.ID] != 'undefined' && typeof gathererSettings.id[sData.ID].sensor[cprop] != "undefined" && gathererSettings.id[sData.ID].sensor[cprop].available == true){
              //  console.log("available prop:"+prop);

                if (lastdata[sData.ID][prop] == undefined){
                    lastdata[sData.ID][prop] = sData[prop];

                    dedupe[prop] = sData[prop];
                 }
                if (sData[prop] == lastdata[sData.ID][prop]){
                 //   console.log("Duplicate removed"+prop);
                }
                 else{
                    lastdata[sData.ID][prop] = sData[prop]
                   // console.log(prop);
                    dedupe[prop] = sData[prop];
                }
        }
         }
 }


    // write data to mongo
//console.log(dedupe);
    //console.log(lastdata);
    if (cLog){

        cLog.insert(dedupe, {w:1}, function(err, result) {
           // console.log("Insert :"+result);
        });
    }
    else
    {
        console.log("Serial data rec - no database connections yet;")
    }
    sData.dataType = "Serial";
    websock.send(JSON.stringify(sData) );
};
exports.saveSensorSettings = function(){};


function dataAverage(eT,min){
   switch(min){
       case 1440:
       case 60:
           eT = new Date(eT.setMinutes(0));

       case 1:
           eT = new Date(eT.setSeconds(0));
   }
       eT= new Date(eT.setMilliseconds(0));
    sT = new Date(eT-60000*min);

    console.log("timerange",sT,eT);
    var temp='cLog.aggregate([{$match:{"Time":{$lt:eT,$gte:sT}}},{$group:{"_id":""'
    // find all the available sensors and add them to the query list

    for (id in gathererSettings.id){
        for (sensor in gathererSettings.id[id].sensor){
            if (gathererSettings.id[id].sensor[sensor].available){
                sn=sensor+"_"+id;
                if (sensor == "Contact"){
                    temp+=',"'+sn+'sum":{"$sum":"$'+sn+'"}';
                }else{
                    temp+=',"'+sn+'":{"$avg":"$'+sn+'"}';
                    temp+=',"'+sn+'max":{"$max":"$'+sn+'"}';
                    temp+=',"'+sn+'min":{"$min":"$'+sn+'"}';
                }
            }
        }

    }

    temp +='}}],function(err,resultdata){ dataAverageResults1(resultdata,sT,min);});';

    // macro sub execute the query
    eval(temp);

};
function dataAverageResults1(d,sT,min){
//
  if (d[0] == undefined){
      console.log("no data to average");
      return;


  }
    for (sensor in d[0]){
        if (d[0][sensor] == 0 || d[0][sensor] == null ){
            delete d[0][sensor];
        }
    }


    d[0].Time = sT;

    if (min == 1){
        cAvg1.update({"Time":sT} ,d[0] ,{ upsert: true },function (err,res){
            console.log("Avg1 Updated")

        });
    }
        if (min == 60){
            cAvg60.update({"Time":sT} ,d[0] ,{ upsert: true },function (err,res){
                console.log("Avg60 Updated")

            });
        }
            if (min == 1440){
                cAvg1440.update({"Time":sT} ,d[0] ,{ upsert: true },function (err,res){
                    console.log("Avg1440 Updated")

                });

    }

};
function calctemp()
{
now = new Date(lastdata.temp)
lastdata.temp = new Date(lastdata.temp).getTime() + 60000*60;
console.log(now);
dataAverage( now,60);

}


function updateAvg(){
    var now = new Date();

    if (lastdata.minute != now.getMinutes()){
        lastdata.minute = now.getMinutes();
        dataAverage( now,1);
    }



}
function updateAvglong(){
    var now = new Date();


    if (lastdata.hour != now.getHours()){
        lastdata.hour = now.getHours();
        dataAverage( now,60);
        return;
    }
    if (lastdata.day != now.getDay()){
        lastdata.day = now.getDay();
        dataAverage( now,1440);
        return;
    }


}
