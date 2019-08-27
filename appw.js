var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
//    $("#greetings").html("");
    $("#event").html("");
}

function connect() {

 var url = "ws://mikeconsole.onekosmos.com/my-ws/websocket"
//   var url = "ws://mikeconsole.onekosmos.com/ws/onekosmos/blockid/community"

 //  var url = "ws://localconsole.onekosmos.com:8080/ws/onekosmos/blockid/community"
 //   var sockjs = "http://mikeconsole.onekosmos.com/ws/onekosmos/blockid/community"
  //  var socket = new SockJS(sockjs);
  //  stompClient = Stomp.over(socket);
     stompClient = Stomp.client(url);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        console.log('URL: ' + url);
        console.log('subscribe: ' + "/topics/android");
        stompClient.subscribe("/topics/android", function (event) {
           // showGreeting(JSON.parse(greeting.body).content);
            console.log('event: ' + JSON.parse(event.body).operation);
           showEvent(JSON.parse(event.body).operation)
           showEvent(JSON.parse(event.body).token)
           showEvent(JSON.parse(event.body).did)
           showEvent(JSON.parse(event.body).data)
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/android", {}, JSON.stringify({'name': $("#name").val()}));
}

function sendEvent() {
    stompClient.send("/app/android", {},
    JSON.stringify({'operation': $("#operation").val(), 'token':$("#token").val(),'did':$("#did").val(),'data':$("#data").val()}));
}

function sendEventOrig() {
    stompClient.send("/app/android", {},
    JSON.stringify({'operation': 'sign', 'token':'sometoken','did':'somedid','data':'somedata'}));

}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

function showEvent(message) {
    $("#events").append("<tr><td>" + message + "</td></tr>");
}


$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendEvent(); });
});