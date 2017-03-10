// supplies all the chat functionality

/**

contents:
- socket
-- open/close : simply prints status to console
-- onmessage : runs handlemsg

- handlemsg: 
	if message contains err -> alert the error
	if message contains join -> log joined {data.join}
	if message contains leave -> log left {data.leave}
	if message contains username & message & created -> print msg to #textbody

- connect : handles form to connect to the room & leaves current room if in room
- sendMsg : handles form to send a message to server

**/


// save socket resources
var ws_protocol = window.location.protocol == "https:" ? "wss" : "ws";
var ws_path = ws_protocol + '://' + window.location.host + '/chat';
var socket;
var lastmsg; // for debugging save the latest message
var room; // save the current room title

$(document).ready(function(){
	// connect to websocket
	console.log('Connecting to ' + ws_path);
	socket = new ReconnectingWebSocket(ws_path);

	socket.onopen = function(){
		console.log('socket connected');
	}
	socket.onclose = function(){
		console.log('socket Disconnected');
	}
	socket.onmessage = handleMsg

	// handle forms
	$(document).on('submit', '#connect', connect);
	$(document).on('submit', '#post', sendmsg);

});

// websocket handlers

function handleMsg(msg){
	lastmsg = msg;
	var data = JSON.parse(msg.data);
	console.log('Got msg from websocket', data);
	if(data.err){
		alert(data.err);
		return;
	}

	if(data.join){ joinRoomWebsocket(data);}
	else if(data.leave){ leaveRoomWebsocket(data);}
	else if(data.message != undefined && 
			data.username != undefined && 
			data.created != undefined){printMsg(data);}
	else{
		console.log('could not process msg!');
	}	
}

function joinRoomWebsocket(data){
	// if we receive a msg with join field
	console.log('joined successfully', data.join)
	roomId = data.join
}
function leaveRoomWebsocket(data){
	// if we receive a msg with leave field
	console.log('leaving room', data.leave);
	$('#textbody').empty(); // clear the body
}
function printMsg(data){
	console.log('printing msg');
	$('#textbody').append('<p><span class="username">' 
		+ data.username + '</span>'
		+':<span class="message">' + data.message + '</span></p>')
	$('#message').val("");
}


// UI functions

// clears textbody and attempts to connect to room
function connect(){
	// leave last room
	if(room){
		data = {
			room: room,
			command: 'leave'
		}
		socket.send(JSON.stringify(data));
	}

	room = $('#room')[0].value;
	console.log('room set to ', room);
	data = {
		room: room,
		command: 'create'
	}
	console.log('sending msg',data);
	socket.send(JSON.stringify(data));
	return false; // do not refresh page
}

// send message and clears prompt
function sendmsg(){
	data = {
		message: $('#message')[0].value,
		command: 'send',
		room: room
	}
	console.log('sending', data)
	socket.send(JSON.stringify(data))
	return false; // do not refresh webpage
}