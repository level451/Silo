/**
 * Created by todd on 2/21/14.
 */
t0packet = 15;
function savetimer(){
    if (typeof t0 != "undefined"){     clearInterval(t0);}
    if ((document.getElementById('t0m').value*60000)+(document.getElementById('t0s').value*1000) > 0){
        t0 = setInterval(function(){t0timer()},(document.getElementById('t0m').value*60000)+(document.getElementById('t0s').value*1000));
    }
    gatherer.id[document.getElementById("selectedgatherer").value].t0m=document.getElementById('t0m').value;
    gatherer.id[document.getElementById("selectedgatherer").value].t0s=document.getElementById('t0s').value;
    gatherer.id[document.getElementById("selectedgatherer").value].t1m=document.getElementById('t1m').value;
    gatherer.id[document.getElementById("selectedgatherer").value].t1s=document.getElementById('t1s').value;
    gatherer.id[document.getElementById("selectedgatherer").value].t2m=document.getElementById('t2m').value;
    gatherer.id[document.getElementById("selectedgatherer").value].t2s=document.getElementById('t2s').value;
    gatherer.id[document.getElementById("selectedgatherer").value].t3m=document.getElementById('t3m').value;
    gatherer.id[document.getElementById("selectedgatherer").value].t3s=document.getElementById('t3s').value;
    var temp =   'r '+document.getElementById("selectedgatherer").value+' 0 151 59 ';
    temp = temp +gatherer.id[document.getElementById("selectedgatherer").value].t0m+ ' '+(gatherer.id[document.getElementById("selectedgatherer").value].t0s)*4+ ' ';
    temp = temp +gatherer.id[document.getElementById("selectedgatherer").value].t1m+ ' '+(gatherer.id[document.getElementById("selectedgatherer").value].t1s)*4+ ' ';
    temp = temp +gatherer.id[document.getElementById("selectedgatherer").value].t2m+ ' '+(gatherer.id[document.getElementById("selectedgatherer").value].t2s)*4+ ' ';
    temp = temp +gatherer.id[document.getElementById("selectedgatherer").value].t3m+ ' '+(gatherer.id[document.getElementById("selectedgatherer").value].t3s)*4+ ' ';
    console.log(temp);
    sendpacket(temp);
    savesettings();
}
function t0timer(){
    if(t0packet > 29)
    { document.getElementById('e'+(t0packet-1)).style.backgroundColor="#ffffff"
        t0packet = 15;}
    document.getElementById('e'+t0packet).style.backgroundColor="#000000"
    document.getElementById('e'+(t0packet-1)).style.backgroundColor="#ffffff"
    ++t0packet;

}
function writetoeeprom(address){
    //save the value to eeprom and store it in settings as there currently is no way to retrieve it for display - only exicute it

    sendpacket('r '+document.getElementById("selectedgatherer").value+' 0 151 '+address+' '+document.getElementById('e'+address).value );
    if (gatherer.id[document.getElementById("selectedgatherer").value].eeprom == undefined){
        gatherer.id[document.getElementById("selectedgatherer").value].eeprom={};
    }
    gatherer.id[document.getElementById("selectedgatherer").value].eeprom[address]=document.getElementById('e'+address).value;
    savesettings();
}
function buildpacket(){
    var type = document.getElementById("packettype");
    var ptext;
    ptext = type.options[type.selectedIndex].innerHTML;
    ptext = ptext + ' of '+  document.getElementById("packetdestination").options[ document.getElementById("packetdestination").selectedIndex].innerHTML;
    var temp = '';
    temp = temp + document.getElementById("packetdestination").value+ " "+document.getElementById("packetsource").value; //byte 0-1
    temp = temp + " "+type.value+" "; //byte 2
    console.log(type.value.substr(0,2))
    switch (type.value.substr(0,3)*1){ //byte 3
        case 50:
            console.log("50");
            //temp=temp+"9";
            break;
        case 52:
            temp=temp+"9";
            break;
        case 53:
            temp=temp+"9"; //
            break;
        case 100:
            var x= ((document.getElementById("led1").checked == true   ) ? 1 : 0)+((document.getElementById("led2").checked == true   ) ? 2 : 0)+((document.getElementById("led3").checked == true   ) ? 4 : 0)+((document.getElementById("led4").checked == true   ) ? 8 : 0)+((document.getElementById("led5").checked == true   ) ? 16 : 0)+((document.getElementById("led6").checked == true   ) ? 32 : 0);
            temp=temp+x+" ";
            temp=temp + document.getElementById("packetred").value+" "+ document.getElementById("packetgreen").value+ " "+document.getElementById("packetblue").value;

            break;
        case 200:
            temp=temp +(document.getElementById("lcdcommand").value*1+document.getElementById("lcdcolor").value*1);
            break;
        default:
            temp=temp+"0";
    }
    if(type.value.substr(0,2) >49 && type.value.substr(0,2) <60){ //byte 4
        temp=temp+" " +(document.getElementById("packetlcd").value*1+document.getElementById("lcdcolor").value*1);
        temp = temp + " "+ document.getElementById("startx").value +" "+document.getElementById("starty").value; //lcd x/y
        ptext = ptext + ' send results to '+  document.getElementById("packetsource").options[ document.getElementById("packetsource").selectedIndex].innerHTML;
        ptext = ptext + ' '+  document.getElementById("packetlcd").options[ document.getElementById("packetlcd").selectedIndex].innerHTML;
    }else if(type.value==200)
    {
        switch (document.getElementById("lcdcommand").value*1){
            case 0:
                temp = temp + " "+ document.getElementById("backlight").value;
                break;

            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                temp = temp + " "+ document.getElementById("startx").value +" "+document.getElementById("starty").value+" "+document.getElementById("endx").value+" "+document.getElementById("endy").value;
            case 7:
            case 8:
            case 9:
                temp = temp + " "+ document.getElementById("startx").value +" "+document.getElementById("starty").value;
                for (var i = 0;i<10;++i){
                    temp = temp + " "+ document.getElementById("lcdtext").value.charCodeAt(i);


                }

        }

// another case here
    }
    console.log(ptext);
    console.log(temp);
    sendpacket('r '+temp);
    return temp;
}
function quickbacklight(){
    sendpacket('r '+document.getElementById("packetdestination").value+' 0 200 0 '+ document.getElementById("backlight").value);
}

function quickled(){
    var selectedleds = ((document.getElementById("led1").checked == true   ) ? 1 : 0)+((document.getElementById("led2").checked == true   ) ? 2 : 0)+((document.getElementById("led3").checked == true   ) ? 4 : 0)+((document.getElementById("led4").checked == true   ) ? 8 : 0)+((document.getElementById("led5").checked == true   ) ? 16 : 0)+((document.getElementById("led6").checked == true   ) ? 32 : 0);
    var temp = '';
    temp = temp + 'r '+document.getElementById("packetdestination").value+' 0 100 '+selectedleds+' ';
    temp=temp + document.getElementById("packetred").value+" "+ document.getElementById("packetgreen").value+ " "+document.getElementById("packetblue").value;

    sendpacket(temp);
}
function createpacket(){
    viewtoggle('createpacket');
    document.getElementById("packetdestination").innerHTML=document.getElementById("selectedgatherer").innerHTML;
    document.getElementById("packetsource").innerHTML=document.getElementById("selectedgatherer").innerHTML;
    createpacketoptionrefresh(1);
}
function createpacketoptionrefresh(inx){
    var source = document.getElementById("packetsource").value;
    var dest = document.getElementById("packetdestination").value;
    var type = document.getElementById("packettype");
    var lcd =  document.getElementById("packetlcd");
    var s = gatherer.id[source].sensor;
    var d = gatherer.id[dest].sensor;
    var temp='';
    if (inx == 1){
        for (var prop in d){
            // console.log(d[prop].available);
            if (d[prop].available){
                temp=temp+'<option value="'+d[prop].packettype+'">Request '+d[prop].name+'('+prop+')</option>';

            }

        }
        temp=temp+'<option value="50 9">Read All 1-wire sensors</option>';
        temp=temp+'<option value=59>Read All Sensors</option>';
        temp=temp+'<option value=100>SET RGB Leds</option>';
        temp=temp+'<option value=200>LCD Commands</option>';
        type.innerHTML=temp;
    }
    //   console.log(type);


    if(type.value.substr(0,2) >49 && type.value.substr(0,2) <59){
        document.getElementById("packetsource").style.display='inline';
        lcd.style.display = 'inline';
        console.log(lcd.value);
        if (lcd.value > 0){ // request value and sent to lcd
            document.getElementById("lcdcommand").style.display = 'none';
            document.getElementById("startx").placeholder = "X position";
            document.getElementById("starty").placeholder = "Y position";
            document.getElementById("startx").style.display = 'inline';
            document.getElementById("starty").style.display = 'inline';
            document.getElementById("startx").style.display = 'inline';
            document.getElementById("starty").style.display = 'inline';
            document.getElementById("endy").style.display = 'none';
            document.getElementById("endx").style.display = 'none';
            document.getElementById("lcdtext").style.display = 'none';
            document.getElementById("backlight").style.display = 'none';
            document.getElementById("lcdoptions").style.display = 'inline-block';
            return;
        }

    }else{
        console.log("executed")
        if (type.value == 59){
            document.getElementById("packetsource").style.display = 'inline';
            lcd.style.display = 'none';

        }else{
            document.getElementById("packetsource").style.display = 'none';
            lcd.style.display = 'none';
            lcd.value = 0;
        }

    }

    if(type.value==100){document.getElementById("leds").style.display = 'block';
    }else
    {document.getElementById("leds").style.display = 'none';}
    if(type.value==200){
        document.getElementById("lcdoptions").style.display = 'inline-block';
        document.getElementById("lcdcommand").style.display = 'inline';

        switch (document.getElementById("lcdcommand").value*1){
            case 0: //backlight
                document.getElementById("backlight").style.display = 'inline';
                document.getElementById("startx").style.display = 'none';
                document.getElementById("starty").style.display = 'none';
                document.getElementById("endy").style.display = 'none';
                document.getElementById("endx").style.display = 'none';
                document.getElementById("lcdcolor").style.display = 'none';
                document.getElementById("lcdtext").style.display= 'none';

                break;
            case 1: //clear screen
                document.getElementById("startx").style.display = 'none';
                document.getElementById("starty").style.display = 'none';
                document.getElementById("backlight").style.display = 'none';
                document.getElementById("endy").style.display = 'none';
                document.getElementById("endx").style.display = 'none';
                document.getElementById("lcdcolor").style.display = 'inline';
                document.getElementById("lcdtext").style.display= 'none';

                break;
            case 2: //line
            case 5: //rectange
            case 6: //fillrectange
                console.log(document.getElementById("lcdcommand").value);
                document.getElementById("startx").placeholder = "X position";
                document.getElementById("starty").placeholder = "Y position";
                document.getElementById("startx").style.display = 'inline';
                document.getElementById("endy").style.display = 'inline';
                document.getElementById("endx").style.display = 'inline';
                document.getElementById("starty").style.display = 'inline';
                document.getElementById("backlight").style.display = 'none';
                document.getElementById("lcdcolor").style.display = 'inline';
                document.getElementById("lcdtext").style.display= 'none';
                break;

            case 7: //text small
            case 8: //text medium
            case 9: //text large
                console.log(document.getElementById("lcdcommand").value);
                document.getElementById("startx").placeholder = "X position";
                document.getElementById("starty").placeholder = "Y position";
                document.getElementById("startx").style.display = 'inline';
                document.getElementById("endy").style.display = 'none';
                document.getElementById("endx").style.display = 'none';
                document.getElementById("starty").style.display = 'inline';
                document.getElementById("backlight").style.display = 'none';
                document.getElementById("lcdcolor").style.display = 'inline';
                document.getElementById("lcdtext").style.display= 'inline';
                document.getElementById("lcdtext").placeholder= 'Text';
                break;


        }

    }else{document.getElementById("lcdoptions").style.display = 'none';}


}
function readsensors(){

    if (gatherer.id[document.getElementById("ID").value].sensor == undefined){
        gatherer.id[document.getElementById("ID").value].sensor={};
    }
    for (var i=0; i<8;++i){writegatherertohtml("Temp"+i);}

    writegatherertohtml("Light");
    writegatherertohtml("Power0");
    writegatherertohtml("Power1");
    writegatherertohtml("Humidity");
    writegatherertohtml("Contact");
    writegatherertohtml("Vin");
    writegatherertohtml("IR");
    if (typeof t0 != "undefined"){     clearInterval(t0);}
    if (gatherer.id[document.getElementById("selectedgatherer").value].t0m != undefined){
        document.getElementById('t0m').value=gatherer.id[document.getElementById("selectedgatherer").value].t0m;
        document.getElementById('t0s').value=gatherer.id[document.getElementById("selectedgatherer").value].t0s;
        document.getElementById('t0ms').value=gatherer.id[document.getElementById("selectedgatherer").value].t0m;
        document.getElementById('t0ss').value=gatherer.id[document.getElementById("selectedgatherer").value].t0s;
        if ((document.getElementById('t0m').value*60000)+(document.getElementById('t0s').value*1000)>0){
            t0 = setInterval(function(){t0timer()},(document.getElementById('t0m').value*60000)+(document.getElementById('t0s').value*1000));
        }
    }else{
        document.getElementById('t0m').value=0;
        document.getElementById('t0s').value=0;
        document.getElementById('t0ms').value=0;
        document.getElementById('t0ss').value=0;
    }

    if (gatherer.id[document.getElementById("selectedgatherer").value].t1m != undefined){
        document.getElementById('t1m').value=gatherer.id[document.getElementById("selectedgatherer").value].t1m;
        document.getElementById('t1s').value=gatherer.id[document.getElementById("selectedgatherer").value].t1s;
        document.getElementById('t1ms').value=gatherer.id[document.getElementById("selectedgatherer").value].t1m;
        document.getElementById('t1ss').value=gatherer.id[document.getElementById("selectedgatherer").value].t1s;

    }else{
        document.getElementById('t1m').value=0;
        document.getElementById('t1s').value=0;
        document.getElementById('t1ms').value=0;
        document.getElementById('t1ss').value=0;
    }
    if (gatherer.id[document.getElementById("selectedgatherer").value].t2m != undefined){
        document.getElementById('t2m').value=gatherer.id[document.getElementById("selectedgatherer").value].t2m;
        document.getElementById('t2s').value=gatherer.id[document.getElementById("selectedgatherer").value].t2s;
        document.getElementById('t2ms').value=gatherer.id[document.getElementById("selectedgatherer").value].t2m;
        document.getElementById('t2ss').value=gatherer.id[document.getElementById("selectedgatherer").value].t2s;

    }else{
        document.getElementById('t2m').value=0;
        document.getElementById('t2s').value=0;
        document.getElementById('t2ms').value=0;
        document.getElementById('t2ss').value=0;
    }
    if (gatherer.id[document.getElementById("selectedgatherer").value].t3m != undefined){
        document.getElementById('t3m').value=gatherer.id[document.getElementById("selectedgatherer").value].t3m;
        document.getElementById('t3s').value=gatherer.id[document.getElementById("selectedgatherer").value].t3s;
        document.getElementById('t3ms').value=gatherer.id[document.getElementById("selectedgatherer").value].t3m;
        document.getElementById('t3ss').value=gatherer.id[document.getElementById("selectedgatherer").value].t3s;

    }else{
        document.getElementById('t3m').value=0;
        document.getElementById('t3s').value=0;
        document.getElementById('t3ms').value=0;
        document.getElementById('t3ss').value=0;
    }


    for (var i=0; i<59;++i){
        if (gatherer.id[document.getElementById("selectedgatherer").value].eeprom != undefined && gatherer.id[document.getElementById("selectedgatherer").value].eeprom[i] != undefined){
            document.getElementById("e"+i).value = gatherer.id[document.getElementById("selectedgatherer").value].eeprom[i];
        }else{
            document.getElementById("e"+i).value="";
        }

    }


}
function writegatherertohtml(insensor){
    var id=document.getElementById("ID").value;
    if (gatherer.id[id].sensor[insensor] == undefined){
        gatherer.id[id].sensor[insensor] = {};
        gatherer.id[id].sensor[insensor].available = false;
        gatherer.id[id].sensor[insensor].name = "";
    }
    document.getElementById(insensor+".available").checked = gatherer.id[id].sensor[insensor].available;
    document.getElementById(insensor+".name").value =gatherer.id[id].sensor[insensor].name;
}
function writesensors(){
    var id=document.getElementById("ID").value;
    for (var i=0; i<8;++i){
        readhtmltogatherer("Temp"+i,"50 "+i,i);
    }
    readhtmltogatherer("Light",51,0);
    readhtmltogatherer("Power0",52,9);
    readhtmltogatherer("Power1",53,9);
    readhtmltogatherer("Humidity",54,0);
    readhtmltogatherer("Vin",55,0);
    readhtmltogatherer("Contact",56,0);
    readhtmltogatherer("IR",57,0)
    savesettings();
}
function readhtmltogatherer(insensor,inpackettype,inpacketoption){
    var id=document.getElementById("ID").value;
    if (gatherer.id[id].sensor[insensor] == undefined){
        gatherer.id[id].sensor[insensor] = {};
        gatherer.id[id].sensor[insensor].available = false;
        gatherer.id[id].sensor[insensor].name = "";
    }
    gatherer.id[id].sensor[insensor].available=document.getElementById(insensor+".available").checked;
    gatherer.id[id].sensor[insensor].name=  document.getElementById(insensor+".name").value;
    gatherer.id[id].sensor[insensor].packettype = inpackettype;
    gatherer.id[id].sensor[insensor].packetoption = inpacketoption;
}

function validateselectedgatherer(x){
    document.getElementById("ID").value= x.value;
    document.getElementById("NAME").value= gatherer.id[x.value].name;
    readsensors();
}

function validateid(x){
    // console.log(x.value);
    if (x.value < 256 && x.value > 0){
        document.getElementById("selectedgatherer").value = x.value;
        if (typeof(gatherer.id[document.getElementById("ID").value]) == "object"){
            document.getElementById("NAME").value=gatherer.id[document.getElementById("ID").value].name;
            return;
        }else
        { document.getElementById("NAME").value="Enter Name"
        }

        if (typeof(gatherer.id[document.getElementById("ID").value]) != "object"){
            gatherer.id[document.getElementById("ID").value]={};
            gatherer.id[document.getElementById("ID").value].sensor={};
            gatherer.id[document.getElementById("ID").value].name=document.getElementById("NAME").value;
            writesensors(); //writes to values of the sensors to gatherer object
            //savesettings(); //save to gatherer object to the collection
            refreshselectedgatherer();

        }
    }
    else{
        //console.log(x);
        x.value=document.getElementById("selectedgatherer").value
        document.getElementById("NAME").value=gatherer.id[document.getElementById("ID").value].name;
        alert("ID Must be between 1 and 255");
        return;


    }
    document.getElementById("selectedgatherer").value = x.value;
}
function validatename(x){
    if (x.value.trim().length == 0){
        // x.value=document.getElementById("selectedgatherer").value.text.trim().substr(0,10);
        //x.value=document.getElementById("selectedgatherer").options[document.getElementById("selectedgatherer").selectedIndex].text;
        x.value = "Enter Name";
        alert("Name Cannot Be Empty");
        return;
    }
    x.value = x.value.trim().substr(0,20);
    if (typeof(gatherer.id[document.getElementById("ID").value]) != "object"){
        gatherer.id[document.getElementById("ID").value]={};
    }
    gatherer.id[document.getElementById("ID").value].name=document.getElementById("NAME").value;
    writesensors();

    refreshselectedgatherer();
    document.getElementById("selectedgatherer").value = document.getElementById("ID").value;
}
function refreshselectedgatherer(){
    var temp=""
    for (var prop in gatherer.id)
    {
        temp = temp+'<option value ="'+prop+'">'+gatherer.id[prop].name+'('+prop+')'+'</option>'

    }


    document.getElementById("selectedgatherer").innerHTML=temp;


}

function addnewgatherer(){
    var id=document.getElementById("ID");
    var name=document.getElementById("NAME");
    id.value="";
    name.value=""
}
