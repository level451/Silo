/**
 * Created by todd on 1/23/14.
 */
var wsUri = "ws://level451.com:8080";
function init()
{

   WebSocketSetup();
}
function viewtoggle(inobject){

    if (document.getElementById(inobject).style.display != 'none'){
        document.getElementById(inobject).style.display = 'none';
    } else {
        document.getElementById(inobject).style.display = 'block';
    }

}

function WebSocketSetup()

{
    websocket = new ReconnectingWebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}
function onOpen(evt) {
    console.log("CONNECTED");
    //   doSend("WebSocket rocks");
}
function onClose(evt) {
    console.log("Disconnected")
}
function onMessage(evt)    {
 //   writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
    //console.log(evt.data);
    msghandler(evt.data);
    //websocket.close();
}
function onError(evt) {
   // writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}


function savesettings(){

    console.log ('Gatherer settings save')
    var sendobj = {};
    sendobj.packettype="Gatherer settings save";
    sendobj.data = gatherer;
    websocket.send(JSON.stringify(sendobj));
}
function drawgauage(id,value){

    if (value > 99){value = value.toFixed(0);}
    if (value > 9 && value < 100){value = value.toFixed(1);}
    if (value < 10 && value > 0){
        console.log("value"+value);
        console.log("id"+id);
        value = value * 1;
        value = value.toFixed(2);
    }
    var canvas = document.getElementById(id);
    //console.log(canvas.width);
    var center = (canvas.width/2);
    var c=canvas.getContext("2d");
    c.strokeStyle="#001010";
    c.lineWidth = center/3;
    c.clearRect(0,0,center*2,center*2);
    c.beginPath();
    c.arc(center,center,center *.7,Math.PI *.1,Math.PI *.9,true);
    c.strokeStyle="#a0a0a0";
    c.stroke();
    c.beginPath();
    c.arc(center,center,center *.8,Math.PI,((value/100)*Math.PI)-Math.PI,false);
    c.strokeStyle="red";
    c.stroke();
    c.font = (center/2.5)+"px Arial";
    c.fillText(value,center-(center/2.5),center);
    c.fillText(id.substring(0,id.indexOf("_")),0,center*1.5)
}

function msghandler(indata){
    s=JSON.parse(indata);
    if (s.dataType == "Serial")
    {
        delete s.dataType;
        var id = s.ID;
        delete s.ID;
        var gauges = document.getElementById("gauges");
        var gathererid = document.getElementById("gatherer"+id);
        if (gathererid == null)
        {
            console.log("Gatherer "+id+" no div found");
            gauges.innerHTML = gauges.innerHTML + '<div class="sensorinfo" height="250px" id="gatherer'+id+'"> Sensor'
            gathererid = document.getElementById("gatherer"+id);
        }

        for(var sensors in s){
            sensorid = document.getElementById(sensors);
            if (sensorid == undefined){
                gathererid.innerHTML = gathererid.innerHTML + '<canvas id="'+sensors+'" width="200" height="150"></canvas>'
                console.log("creating:"+sensors)
                // create canvas in div

            }
            drawgauage(sensors,s[sensors]);
        }

    }
    return;

}
