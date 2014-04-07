function graph(graphname){
    this.overviewCanvas = document.getElementById(graphname+"_overview");
    this.overviewindicatorCanvas = document.getElementById(graphname+"_overviewindicator");
    this.maingraph = document.getElementById(graphname+"_maingraph");
    this.maingraphscale = document.getElementById(graphname+"_maingraphscale");
    this.start = document.getElementById(graphname+"_start");
    this.end = document.getElementById(graphname+"_end");
    this.height = this.maingraphscale.height;
    this.width = this.maingraphscale.width;
    this.data=[];
    this.dataStart = 0;
    this.dataEnd = 0;
    this.startelement = 0
    this.endelement = 0;
    this.line1Element = 0;
    this.selected = undefined;
    this.drawline1 = false;
    this.line1=0;
    this.shiftcount = 0;
    this.shifttime = 0;
    this.realTime = new Date().getTime();
    this.start.style.display="none";
    this.end.style.display="none";
    this.mousedown=  function (e){

        e.preventDefault();
        mouse.x = e.offsetX;

        mouse.y = e.offsetY;
        if (!g.graphButtonClick(mouse.x,mouse.y)){return}



        if (mouse.mdown != true){
            g.drawline1 = true;
            g.line1=mouse.x;
            g.drawMain();
            document.getElementById("g1_maingraphscale").addEventListener("mousemove", g.mousemove,false);
            mouse.mdown = true;

        }

    }
    this.touchstart=  function (e){
        console.log(e.touches[0].screenX, e.touches[0].screenY,e);
        mouse.x = e.touches[0].screenX;
        mouse.y = e.touches[0].screenY;

        if (mouse.touchstart != true){

            mouse.touchstart = true;
            g.drawline1 = true;
            g.line1=e.targetTouches[0].clientX+ e.pageX;
            g.drawMain();
            g.maingraphscale.addEventListener("touchmove", g.touchmove,false);
        }
        e.preventDefault();

    }
    this.touchend = function (e){
        mouse.mdown = false;
        mouse.touchstart = false;
        g.drawline1 = true;
        document.getElementById("g1_maingraphscale").removeEventListener("touchmove", g.touchmove);

    }


    this.touchmove = function (e){
        // console.log('move');

    if (e.touches.length == 2){ // 2 finger
        console.log("2 FIngers");
        var diff = (g.end.value- g.start.value) *.000001;
        g.start.value -= (e.touches[0].screenX-e.touches[1].screenX)*-diff;
        g.end.value -= (e.touches[0].screenX-e.touches[1].screenX)*diff;
        g.drawMain();
        return;
    }
        ppms =(document.getElementById("g1_maingraph").width-30)/(g.end.value-g.start.value); // pixels per millisecond
        // console.log((mouse.x - e.offsetX)*(1/ppms));

        g.start.value -=  (mouse.x - e.touches[0].screenX)*-(1/ppms);
        g.end.value -=  (mouse.x - e.touches[0].screenX)*-(1/ppms);
        mouse.x = e.touches[0].screenX;

        g.drawMain();

    }

    this.mouseup = function (e){
        mouse.mdown = false;
        document.getElementById("g1_maingraphscale").removeEventListener("mousemove", g.mousemove);
        //g.drawscale(g.maingraphscale);

    }
    this.mousemove = function (e){
        // console.log('move');

        ppms =(document.getElementById("g1_maingraph").width-30)/(g.end.value-g.start.value); // pixels per millisecond
        // console.log((mouse.x - e.offsetX)*(1/ppms));

        g.start.value -=  (mouse.x - e.offsetX)*-(1/ppms);
        g.end.value -=  (mouse.x - e.offsetX)*-(1/ppms);
        mouse.x =e.offsetX;

       g.drawMain();

    }
   this.mousewheel =  function(e){
        var diff = (g.end.value- g.start.value) *.0005;
        g.start.value -= e.wheelDelta*-diff;
        g.end.value -= e.wheelDelta*diff;
       g.drawMain();
        e.preventDefault();
    }
    this.addData = function(dnew,st,et){
        if (this.data.length == 0)
        {this.data = dnew }

        if (dnew.length == undefined || dnew.length == 0){
            return  }



       // var st = new Date(dnew[0].Time);
       // var et = new Date(dnew[dnew.length-1].Time);
        //console.log(st,et);
        for (var i = 1; i<this.data.length;i+=1){
            if (st<=this.data[i].Time){
                var se = i;
                break;

            }
        }
        for (var i = this.data.length-1; i>1 ;i-=1){
            if (et>=this.data[i].Time){
                var ee = i;
                break;

            }
        }
        var temp = this.data.slice(ee+1); // save the last half
        var starttemp = this.data.slice(0,se);
        this.data =  starttemp.concat(dnew.concat(temp));
        //console.log(st);
        if (this.dataStart == undefined || this.dataStart == 0 || this.dataStart > st){
            this.dataStart = st;

        }
        if (this.dataEnd == undefined || this.dataEnd == 0 || this.dataEnd < et){
            this.dataEnd = et;

        }

        this.start.min = this.dataStart;
        this.end.min = this.dataStart;
        this.start.max = this.dataEnd;
        this.end.max = this.dataEnd;
        //this.start.value=this.dataStart;
    }
    this.drawOverview = function(){

        this.draw(this.overviewCanvas,this.dataStart,this.dataEnd,false,true);
    }
    this.drawMain = function(){

       this.draw(this.maingraph,this.start.value,this.end.value);
        this.draw(this.overviewindicatorCanvas,this.start.value,this.end.value,true);
        if  (g.drawline1){

            this.drawclicktime(g.line1);
        }
        if (g.selected != ""){}

        g.drawscale(g.maingraphscale);
    }
    this.draw = function(canvas,s,e,drawIndicatoronly,isoverview){
        var ctx= canvas.getContext("2d");
        ctx.clearRect (0 , 0 , canvas.width , canvas.height );
        var bottomy = canvas.height;

        var ppms =(canvas.width)/(e-s); // pixels per millisecond
        //see if any sensor is selected
        var selected = undefined;
       if (!isoverview){
            for (var sensor in gatherer.graph[document.getElementById("graph").value].sensor)
            {
                if ( gatherer.graph[document.getElementById("graph").value].sensor[sensor].selected == true){
                    selected = sensor;
                    break;

                }
            }

            if (selected == undefined){
                ctx.globalAlpha = 1;
            } else
            {ctx.globalAlpha = .4;}
       }
        if (drawIndicatoronly){
            ctx.fillStyle="#909090";
            var ppms =(canvas.width)/(this.dataEnd-this.dataStart); // pixels per millisecond
               ctx.fillRect(0,0,(s-this.dataStart)*ppms,bottomy);
                ctx.fillRect((e-this.dataStart)*ppms,0,canvas.width,bottomy);
                return;
            ctx.globalAlpha = .4;

        }else{

            var ppms =(canvas.width)/(e-s);
        } // pixels per millisecond}
        if (this.startelement > this.data.length-1){ this.startelement = 0}

        if (this.startelement == 0 || this.data[this.startelement].Time < s){
            for (var i = this.startelement; i<this.data.length;++i){

                if (s<= this.data[i].Time){
                    this.startelement = i;
                    break;

                }
            }
        }else
        {
            for (var i = this.startelement; i>1 ;--i){
                this.startelement = 0;
                if (s>this.data[i].Time){
                    this.startelement = i+1;
                    break;

                }
            }
        }
        if (this.endelement == 0 || this.endelement > this.data.length-1){ this.endelement = this.data.length-1}

        if (this.endelement ==  this.data.length || this.data[this.endelement].Time < e){

            for (var i = this.endelement; i<this.data.length;++i){
                this.endelement = this.data.length-1;
                if (e<= this.data[i].Time){
                    this.endelement = i;
                    break;

                }
            }
        }else
        {


            for (var i = this.endelement; i>1 ;--i){

                if (e > this.data[i].Time ){
                    this.endelement = i+1;
                    break;

                }
            }
        }
/// draw the time lines
var graphhours = (e-s)/3600000;
var timestep = 60000*60*24 // days
        if (graphhours < .5){
            timestep = 60000 *5 // 5 min
        } else   if (graphhours < 1){
            timestep = 60000 *15 // 15 min
} else if (graphhours < 6)
        {
            timestep = 60000 *60 // 1 hours
        } else if (graphhours < 12)
        {
            timestep = 60000 *60 *3 // 3 hours
        } else if (graphhours < 24){
            timestep = 60000 *60*6 // 6 hours
        }







        var roundedstart = Math.floor(s/(timestep))*timestep;
        var time = 0;
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle="#c0c0c0";
        ctx.font ="10pt Arial";
        for (var i=0; i<60;i++){

            time = (timestep*(i+1))-(s-roundedstart);

            ctx.moveTo(time*ppms,0);
            ctx.lineTo(time*ppms,canvas.height);
            var a =new Date(s*1+(time));
            if (graphhours < 24 ){
                a= a.toLocaleTimeString();
            }else{
            a= a.toLocaleDateString();
            }
                ctx.fillText(a,time*ppms,10);
        }
        ctx.stroke();
/// actual graphing start
//console.log("start and end time",new Date(s*1).toLocaleString(),new Date(e*1).toLocaleString())
    //   console.log("elements", this.data.length-1,this.endelement);
        for (var sensor in gatherer.graph[document.getElementById("graph").value].sensor)
        {
        var x = gatherer.graph[document.getElementById("graph").value].sensor[sensor];
        if (x.multiplier == undefined){x.multiplier = 1;}
        if (!x.visible){continue;}
            ctx.beginPath();

            if (x.color == undefined){
           ctx.strokeStyle="#c0a070";
       }else
       {ctx.strokeStyle= x.color;
       }
            if (!isoverview){
            if (x.selected) {
                ctx.globalAlpha = 1;
            }else{
                if (selected != undefined){ ctx.globalAlpha = .2;
                                        }
                }
            }

            // find the first occerance of the sensor at or before the starttime
            var i = this.startelement;
            if (i>0){i=i-1;}
            while(i > 0 && this.data[i][sensor] == undefined ) { i=i-1; }


            //start the line off the screen
            ctx.moveTo(((this.data[i].Time)-s)*ppms,gety((this.data[i][sensor]* x.multiplier), x.min, x.max,bottomy));
               // find an end element with data in it
            var endele = this.endelement
            while (endele<this.data.length-1 && this.data[endele][sensor] == undefined ) { endele++; }
            //if (this.endelement<this.data.length-1){var endele = this.endelement +1} else {var endele = this.endelement}
            for (var i = this.startelement; i<endele+1;++i){
            if (this.data[i][sensor]){
                ctx.lineTo(((this.data[i].Time)-s)*ppms,gety((this.data[i][sensor]* x.multiplier), x.min, x.max,bottomy));
                if (x.selected && !isoverview){ctx.arc(((this.data[i].Time)-s)*ppms,gety((this.data[i][sensor]* x.multiplier), x.min, x.max,bottomy),2,0,2*Math.PI);}

            }
        }

          //if (ctx.isPointInPath(mouse.x,mouse.y)){console.log("pip",sensor)}
            ctx.stroke();
        }
        if (!isoverview && g.selected != ''){
        // clear the area where we need to draw the scale
       ctx.globalAlpha= .75;
        ctx.fillStyle="#ffffff";
        ctx.fillRect (0 , 0 , 100 , canvas.height );
        ctx.globalAlpha= 1;
        }

    }
this.drawscale = function(canvas){
  var alpha = .5
  var alpha1 = .25;
    var ctx= canvas.getContext("2d");

    ctx.globalAlpha=alpha;
    ctx.clearRect (0 , 0 , canvas.width , canvas.height );
ctx.fillRect(0,canvas.height-40,40,40);
    ctx.fillRect(canvas.width-40,canvas.height-40,40,40);
    var selected = g.selected;
    if (selected == undefined){return;}

    if (selected == ""){return;}
    var x = gatherer.graph[document.getElementById("graph").value].sensor[selected];
    //console.log("scale selected = min max ",selected, x.min, x.max);
        if (x.color == undefined){
            ctx.strokeStyle="#c0a070";
        }else{
            ctx.strokeStyle= x.color;
        }

    ctx.lineWidth= 1;
var max = -100000;
var min = 100000;
var avg = 0;

var count = 0;
for (i = g.startelement; i < g.endelement; ++i){
    if (g.data[i][selected] > max) {max =g.data[i][selected]; }
    if (g.data[i][selected] < min) {min =g.data[i][selected]; }
    if (g.data[i][selected]){avg += g.data[i][selected];++count;}
    }
    ctx.font ="10pt Arial";
    ctx.fillStyle = x.color;
    ctx.beginPath();
    var gv = (x.min*1)+((x.max- x.min) *.02); // 2% Higher than min
    var xc = gety(gv, x.min, x.max, canvas.height);
    ctx.moveTo(0,xc);
    ctx.globalAlpha = 1;
    ctx.fillText(gv.toFixed(1),2,xc+5);
    ctx.globalAlpha=alpha1;
    ctx.lineTo(canvas.width,xc);
    gv = (x.min*1)+((x.max- x.min) *.98); // 98%  Higher than min
    xc = gety(gv, x.min, x.max, canvas.height);
    ctx.moveTo(0,xc);
    ctx.globalAlpha = 1;
    ctx.fillText(gv.toFixed(1),2,xc+5);
    ctx.globalAlpha=alpha1;
    ctx.lineTo(canvas.width,xc);
    gv = (x.min*1)+((x.max- x.min) *.50); // 50%  Higher than min
    xc = gety(gv, x.min, x.max, canvas.height);
    ctx.moveTo(0,xc);
    ctx.globalAlpha = 1;
    ctx.fillText(gv.toFixed(1),2,xc+5);
    ctx.globalAlpha=alpha1;
    ctx.lineTo(canvas.width,xc);
    gv = (x.min*1)+((x.max- x.min) *.75); // 75%  Higher than min
    xc = gety(gv, x.min, x.max, canvas.height);
    ctx.moveTo(0,xc);
    ctx.globalAlpha = 1;
    ctx.fillText(gv.toFixed(1),2,xc+5);
    ctx.globalAlpha=alpha1;
    ctx.lineTo(canvas.width,xc);
    gv = (x.min*1)+((x.max- x.min) *.25); // 25%  Higher than min
    xc = gety(gv, x.min, x.max, canvas.height);
    ctx.moveTo(0,xc);
    ctx.globalAlpha = 1;
    ctx.fillText(gv.toFixed(1),2,xc+5);
    ctx.globalAlpha=alpha1;
    ctx.lineTo(canvas.width,xc);



    ctx.stroke();

    avg = avg/count;
    min = min * x.multiplier;
    avg = avg * x.multiplier;
    max = max * x.multiplier;
    ctx.fillStyle = "#000000";

   // console.log("Max",max,"min",min,"avg",avg);
   ctx.font ="Bold 12pt Arial";
        ctx.beginPath();
        var xc = gety(min, x.min, x.max, canvas.height);
    ctx.moveTo(80,xc);
    ctx.globalAlpha = 1;
    ctx.fillText(min.toFixed(1)+' Min',20,xc+5);
    ctx.globalAlpha=alpha;
       ctx.lineTo(canvas.width,xc);
        xc = gety(max, x.min, x.max, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillText(max.toFixed(1)+' Max',20,xc+5);
    ctx.globalAlpha=alpha;
    ctx.moveTo(80,xc);
        ctx.lineTo(canvas.width,xc);
    xc = gety(avg, x.min, x.max, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillText(avg.toFixed(1)+' Avg',20,xc+5);
    ctx.globalAlpha=alpha;
    ctx.moveTo(80,xc);
    ctx.lineTo(canvas.width,xc);
        ctx.stroke();



}



    this.drawclicktime = function(mousex){
        if (g.line1Element> g.data.length){ g.line1Element = g.data.length-1}
        var    canvas = document.getElementById("g1_maingraph");

        var ppms =(canvas.width)/(document.getElementById('g1_end').value-document.getElementById('g1_start').value); // pixels per millisecond

        var clicktime = (document.getElementById('g1_start').value*1)+((1/ppms)*(mousex));
        var ctx = canvas.getContext("2d");
        // g.lineElement should be close to the correct element time -
        // if its way off get there
        if (g.data[g.line1Element].time < g.data[g.startelement].time ){
            g.line1Element = g.startelement;

        }


 // code from
        if ( g.data[g.line1Element].Time < clicktime){
            for (var i = g.line1Element; i<g.data.length;++i){
                if (g.data[i].Time>=clicktime){   break;  }
            }
            g.line1Element = i;
        }else
        {
            for (var i = g.line1Element; i>1 ;--i){
                g.line1Element = 0;
                if (g.data[i].Time<clicktime){
                    g.line1Element = i+1;
                    break;
                }
            }
            g.line1Element = i;
        }
        if (g.line1Element > 0){g.line1Element -= 1; }

  //      console.log("timediff",(new Date(g.data[g.lineElement].Time)),new Date(clicktime));

        // start the drawing of the line here -

        var startx = (clicktime - document.getElementById("g1_start").value) * ppms;
        ctx.font = "10pt Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(new Date(clicktime).toLocaleTimeString(), startx, 25);
        ctx.font = "Bold 12pt Arial";
        ctx.fillStyle = "#000000";
sortarray = [];
for (sensor in gatherer.graph[document.getElementById("graph").value].sensor) {
     x=gatherer.graph[document.getElementById("graph").value].sensor[sensor]

    if (x.visible && (x.selected || g.selected=='')){
        dataelement = g.line1Element;
        while (dataelement > 0 && g.data[dataelement][sensor] == undefined) {
            dataelement--;
        }
       //sensoor,value,x,y of point,color
        sortarray.push([sensor, (g.data[dataelement][sensor] * x.multiplier),((g.data[dataelement].Time) - document.getElementById('g1_start').value) * ppms, gety((g.data[dataelement][sensor] * x.multiplier), x.min, x.max, canvas.height), x.color])


        }
     }
        // if (x != undefined && x.selected) {
        //  ctx.moveTo(((g.data[dataelement].Time) - document.getElementById('g1_start').value) * ppms, gety((g.data[dataelement][sensor] * x.multiplier), x.min, x.max, canvas.height));
        //   ctx.lineTo(startx -50 , (20*i));
        //}

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.moveTo(startx, 0);
        ctx.lineTo(startx, canvas.height);
        ctx.stroke();
      sortarray.sort(function(a, b) {return a[3] - b[3]});

        for (i=0;i<sortarray.length;++i){
            // limit text so it wont go off screen
            if ( sortarray[i][3] < 12){ sortarray[i][3] = 12;}
            if ( sortarray[i][3] > canvas.height){ sortarray[i][3] = canvas.height;}
            var diff = 999;
            if (i> 0){
                 diff = (sortarray[i][3]-sortarray[i-1][3])
            }

            if ( diff < 12 ){
               // not displaying overlapping values
               // ctx.fillText(sensorNametoUserName(sortarray[i][0]), startx +50, sortarray[i][3]+(14-diff));
            }else
            {
                ctx.fillStyle =sortarray[i][4];
                ctx.fillText(sensorNametoUserName(sortarray[i][0]), startx +5, sortarray[i][3]);
                ctx.fillStyle ="#000000";

                ctx.fillText(sortarray[i][1].toFixed(2), startx -50, sortarray[i][3]);
            }

           // ctx.fillText(sensorNametoUserName(sortarray[i][0]), startx +5, sortarray[i][3]);
        }

    }
    this.checkTime = function(){
        var msSinceRedraw = new Date().getTime()-g.realTime;
        var ppms =(g.maingraph.width)/(g.end.value- g.start.value); // pixels per millisecond
        //console.log(ppms,msSinceRedraw,ppms*msSinceRedraw);
        if (ppms*msSinceRedraw >= .25){
            g.realTime = new Date().getTime();
            var timeMoved = g.realTime-g.end.max;

            g.end.max = g.realTime;
            g.start.max = g.realTime;
            g.start.value = (g.start.value*1)+timeMoved;

            g.end.value = (g.end.value*1)+timeMoved;
          g.drawMain();

        }

    }


this.graphButtonClick = function(x,y)
{
    if (y > g.height - 40) {
        if (x < 40) {
            console.log("left");
            g.shift(g.start.value- g.end.value);
            return false
        }
        if (x > g.width - 40) {
            console.log("right");
            g.shift(g.end.value- g.start.value);
                return false
        }
    }
return true
}
this.shift = function(x){

    g.shifttime = x/50;
    g.shiftcount = 0;
    g.goshift();


}
this.goshift = function(){
    var start = new Date().getTime();

    g.end.value = (g.end.value*1) +g.shifttime;
    g.start.value = (g.start.value*1)+ g.shifttime;

    this.draw(this.maingraph,this.start.value,this.end.value);
    this.draw(this.overviewindicatorCanvas,this.start.value,this.end.value,true);
    g.shiftcount++;
     // take into account the time in takes to draw the graph and subtract it from the effect time
    var nexttime = ((g.shiftcount*g.shiftcount*g.shiftcount)/4000) - ( new Date().getTime()-start);
    if (g.shiftcount < 50){
        setTimeout("g.goshift()",nexttime )

    }else
    {
        g.drawMain();}


}


}