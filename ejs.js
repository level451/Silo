/**
 * Created by todd on 2/10/14.
 */
exports.optiondraw = function(s,sn){
    var rv = ''
    rv=rv+'<input type="checkbox" id='+s+'.available  onchange="writesensors()">'+sn+'<input id='+s+'.name onblur="validatename(this)">'
    rv = rv+ '<select><option value="0">No Alarm</option><option value="1">Greater Than  Alarm</option><option value="2">Less Than Alarm</option></select>';
    rv = rv + '<input type ="text" placeholder="On value">    <input type ="text" placeholder="Off value">  <br>  ';
    return rv;
}
exports.filetohtml = function(){
    fs = require('fs')
    return fs.readFileSync('public/junk.html', 'utf8');

}