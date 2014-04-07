/**
 * Created by todd on 1/23/14.
 */
var wsUri = "ws://level451.com:8080";
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

    query('avg60',new Date(new Date()-((24*14)*60*60000)),new Date(),'init14',new Date());
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
       // console.log("value"+value);
       // console.log("id"+id);
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


function sendpacket(temp){ websocket.send('{"packettype":"packet","data":"'+temp+'\\n"}');}
function query(type,starttime,endtime,opt){

    var sendobj = {};
    sendobj.packettype="query";

    sendobj.endTime = endtime;
    sendobj.startTime = starttime;
    sendobj.options = opt;
    sendobj.type = type;
   // console.log(sendobj);
    websocket.send(JSON.stringify(sendobj));
}
function findfirst(d,id){ for (var i = 1; i<d.length;++i){ if (d[i][id]){return d[i][id];} }


}
function zoomgraph(){
    var st =document.getElementById("stime").value;
    var et = document.getElementById("etime").value;
    var stm =document.getElementById("stime").min;
    var etm =document.getElementById("etime").max;
    drawgraph(d.data,"overviewindicator", stm, etm,st,et);
    drawgraph(d.data,"x1", st, et);


}

function drawgraph(d,id,s,e,sz,ez){

    var temptime = new Date();
    //s = new Date(s);
    //e = new Date(e);



    var canvas = document.getElementById(id);
    var ctx=canvas.getContext("2d");
    var rightoffset = 30;
    var bottomoffset = 30;
    var bottomy = canvas.height-bottomoffset;
    var ppms =(canvas.width-rightoffset)/(e-s); // pixels per millisecond



    ctx.clearRect (0 , 0 , canvas.width , canvas.height );
if (sz){
ctx.fillRect(0+rightoffset,0,(sz-s)*ppms,bottomy);
ctx.fillRect((ez-s)*ppms+rightoffset,0,canvas.width,bottomy);
return;
}

    ctx.beginPath();
    ctx.strokeStyle="#a0a0a0";
   // ctx.save();
   // ctx.transform(1,0,0,-1,0,canvas.height);
    //ctx.moveTo(0,findfirst(d,"IR_1"))
    //find the start element
    if (startelement == 0 || d[startelement].Time < s){
           for (var i = startelement; i<d.length;++i){

               if (s<= d[i].Time){
                 startelement = i;
                break;

            }
        }
    }else
    {
        for (var i = startelement; i>1 ;--i){
            startelement = 0;
            if (s>d[i].Time){
                startelement = i+1;
                break;

            }
        }
    }
  if (endelement == 0){ endelement = d.length-1}
console.log("endele",endelement);
    if (endelement ==  d.length || d[endelement].Time < e){
        console.log("useing a",(d[endelement].Time-e)/1000,endelement);
        for (var i = endelement; i<d.length;++i){
            endelement = d.length-1;
            if (e<= d[i].Time){
                endelement = i;
                break;

            }
        }
    }else
    {
        console.log("useing b",(d[endelement].Time-e)/1000,endelement);
        for (var i = endelement; i>1 ;--i){

            if (e > d[i].Time ){
                endelement = i+1;
                break;

            }
        }
    }

    for (var i = startelement; i<endelement;++i){
       if (d[i].IR_1){
           ctx.lineTo((((d[i].Time)-s)*ppms)+rightoffset,getx(d[i].IR_1,10,100,bottomy));

           }
}

    ctx.stroke();
    ctx.beginPath();
    for (var i = startelement; i<endelement;i=++i){
        if (d[i].Temp0_1){
            ctx.lineTo(((d[i].Time)-s)*ppms+rightoffset,getx(d[i].Temp0_1,20,100,bottomy));

        }
    }
    ctx.stroke();
    ctx.beginPath();
    for (var i = startelement; i<endelement;i=++i){

        if (d[i].Light_1){
           ctx.lineTo(((d[i].Time)-s)*ppms+rightoffset,getx(d[i].Light_1,0,1000,bottomy));

        }
    }
        ctx.stroke();
        ctx.beginPath();
        for (var i = startelement; i<endelement;++i){
            if (d[i].Power0_6){
                ctx.lineTo(((d[i].Time)-s)*ppms+rightoffset,getx(d[i].Power0_6,100,600,bottomy));

            }

    }


    ctx.stroke();
    console.log(new Date()-temptime);
   // ctx.restore();
}
function gety(d,min,max,height){
    ppu = height/(max-min);  //pixels per unit

    return (height-((d-min)*ppu));
}
function mousedown(e){
    console.log(e.offsetX, e.offsetY,e);
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    if (mdown != true){
        document.getElementById("x1").addEventListener("mousemove",mousemove,false);
        mdown = true;


    }

}
function mouseup(e){
    mdown = false;
    document.getElementById("x1").removeEventListener("mousemove",mousemove);

}
function mousemove(e){
   // console.log('move');
    var st = new Date(document.getElementById("stime").value*1);
    var et = new Date(document.getElementById("etime").value*1);
    ppms =(document.getElementById("x1").width-30)/(et-st); // pixels per millisecond
   // console.log((mouse.x - e.offsetX)*(1/ppms));

    document.getElementById("stime").value -=  (mouse.x - e.offsetX)*-(1/ppms);
    document.getElementById("etime").value -=  (mouse.x - e.offsetX)*-(1/ppms);
    mouse.x =e.offsetX;

    zoomgraph();

}
function mousewheel(e){

    document.getElementById("stime").value -= e.wheelDelta*-10000
    document.getElementById("etime").value -= e.wheelDelta*10000
    zoomgraph();
    e.preventDefault();
}
function cut(){
    var s = new Date(document.getElementById("stime").value*1);
    var e = new Date(document.getElementById("etime").value*1);

    for (var i = 1; i<d.data.length;i+=1){
        if (s<=new Date(d.data[i].Time)){
            var startelement = i;
            break;

        }
    }
    for (var i = d.data.length-1; i>1 ;i-=1){
        if (e>=new Date(d.data[i].Time)){
            var endelement = i;
            break;

        }
    }
    d.data.splice(startelement,endelement-startelement);
    zoomgraph();
    console.log(s,e,"start",startelement,"end",endelement,"elements",endelement-startelement);
}
function combineData(dold,dnew){
    if (dold.length == undefined)
    {return dnew;  }

    console.log(dnew);
    if (dnew.length == undefined || dnew.length == 0){
        return dold;  }



    var st = new Date(dnew[0].Time);
    var et = new Date(dnew[dnew.length-1].Time);
    console.log(st,et);
    for (var i = 1; i<dold.length;i+=1){
        if (st<=new Date(dold[i].Time)){
            var se = i;
            break;

        }
    }
    for (var i = dold.length-1; i>1 ;i-=1){
        if (et>=new Date(dold[i].Time)){
            var ee = i;
            break;

        }
    }
    var temp = dold.slice(ee+1); // save the last half
    var starttemp = dold.slice(0,se);
    return starttemp.concat(dnew.concat(temp));



}
function sensorNametoUserName(sn){
   // return gatherer.id[ sn.substr(sn.indexOf("_")+1,1)].sensor[sn.substring(0,sn.indexOf("_"))].name

    if (gatherer.id[ sn.substr(sn.indexOf("_")+1,1)].sensor[sn.substring(0,sn.indexOf("_"))].name == ""){
     return "("+sn+")";
    }else
    {
    return gatherer.id[ sn.substr(sn.indexOf("_")+1,1)].sensor[sn.substring(0,sn.indexOf("_"))].name
    }
    }