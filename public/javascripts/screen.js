/**
 * Created by todd on 1/24/14.
 */

function loadscreen(){

    console.log("qsdf");
    lcdscreen = document.getElementById("screen");
    lcdscreen.addEventListener("click",lcdclick,false);
    lcdscreen.addEventListener("keydown",lcdkey,true);
    clcd = lcdscreen.getContext("2d");
    document.getElementById("backlight").addEventListener("mouseup",backlight,false);
    clcd.fillStyle = "blue";
    clcd.font = "bold 16px Arial";
    screen = new Array();
    pn = 0;

}
function lcdclick(e){

    console.log(e.offsetX+':'+e.offsetY);
    lcdx =  e.offsetX;
    lcdy = e.offsetY;
    lcdtext = '';
    lcdtextcode = [0,0,0,0,0,0,0,0,0,0];
    lcdtextcodeindex = 0;
    screen[pn]={};
    screen[pn].type = "text";
    screen[pn].text = "";
    screen[pn].x= e.offsetX;
    screen[pn].y= e.offsetY;
}
function backlight(e){
    console.log( document.getElementById("backlight").value);
    websocket.send('r 3 200 0 '+document.getElementById("backlight").value+'\n');
}
function lcdkey(e){
    //console.log(e);
    if (e.keyCode == 13){
        screen[pn].gathererpacket = 'r 3 200 11 '+lcdx+' '+lcdy+' '+lcdtextcode[0]+' '+lcdtextcode[1]+' '+lcdtextcode[2]+' '+lcdtextcode[3]+' '+lcdtextcode[4]+' '+lcdtextcode[5]+' '+lcdtextcode[6]+' '+lcdtextcode[7]+' '+lcdtextcode[8]+' '+lcdtextcode[9]+'\n';
        websocket.send(screen[pn].gathererpacket);
        console.log('send');
        return;
    }
    if (e.keyCode > 122 || e.keyCode < 48){
        return;}

    code =  e.keyCode + (e.shiftKey? 0 : 32);
    lcdtextcode[lcdtextcodeindex] = code;
    screen[pn].text = screen[pn].text+ String.fromCharCode(code);
    ++lcdtextcodeindex;
    console.log(lcdtextcode);
    //console.log(String.fromCharCode(lcdtextcode[0],lcdtextcode[1],lcdtextcode[2],lcdtextcode[3],lcdtextcode[4],lcdtextcode[5],lcdtextcode[6],lcdtextcode[7],lcdtextcode[8],lcdtextcode[9]));
    clcd.fillText(String.fromCharCode(lcdtextcode[0],lcdtextcode[1],lcdtextcode[2],lcdtextcode[3],lcdtextcode[4],lcdtextcode[5],lcdtextcode[6],lcdtextcode[7],lcdtextcode[8],lcdtextcode[9])
        ,lcdx ,lcdy+14);
}
