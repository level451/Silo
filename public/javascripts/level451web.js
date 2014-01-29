/**
 * Created by todd on 1/23/14.
 */
var wsUri = "ws://localhost:8080";
function init()
{

   WebSocketSetup();
}
function WebSocketSetup()
{
    websocket = new WebSocket(wsUri);
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
    //websocket.close();
}
function onError(evt) {
   // writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}
function doSend(message) {
    //writeToScreen("SENT: " + message);  websocket.send(message);
}

