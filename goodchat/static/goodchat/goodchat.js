var lastmessage;
$(document).ready(function(){

	// WEBSOCKET STUFF

	var ws_protocol = window.location.protocol == "https:" ? "wss" : "ws";
	var ws_path = ws_protocol + '://' + window.location.host + '/goodchat/stream/';
	console.log('Connecting to ' + ws_path);
	var socket = new ReconnectingWebSocket(ws_path);


	socket.onmessage = recieve;
	socket.opopen = function(){
		// when it opens notify user
		console.log('connected to chat socket at ' + ws_path);
	}
	socket.onclose = function(){
		// when it closes notify user
		console.log('disconnected from chat session')
	}

		

	// depending on command. route the message to appropriate handler
	function recieve(message){
		console.log('Got message from websocket' + message.data);
		var data = JSON.parse(message.data);
		lastmessage = data;
		if(data.error){
			alert(data.error);
			return;
		}
		
		if (data.join){ joinRoomWebsocket(data); // handle joining
		} else if(data.leave){leaveRoomWebsocket(data); // handle leaving
		} else if(data.message && data.room && data.username){showMsg(data); 
		}else{console.log('cannot handle message');}
	}

	// code to handle actually joining/leaving 
	// according to server & websocket messages
	function joinRoomWebsocket(data){
		console.log('joining room ' + data.join);
		var roomdiv = $(
				"<div class='room' id='room-" + data.join + "'>" +
				"<h2>" + data.title + "</h2>" +
				"<div id='messages-" + data.join + "'></div>" +
				"<form><input><button>Send</button></form>" +
				"</div>"
			);
		// hook up a send message
		roomdiv.find('form').on('submit', function(){
			socket.send(JSON.stringify({
				'command':'send',
				'room':data.join,
				'message':roomdiv.find('input').val(),
			}));
			roomdiv.find('input').val(''); // clear your input
			return false;
		});
		console.log($("#chats"))
		$("#chats").append(roomdiv);
	}
	function leaveRoomWebsocket(data){
		console.log('leaving room ' + data.leave);
		$('#room-' + data.leave).remove();
	}

	// grad the roomdiv for this room and append a message div
	// data should contian room, username, message
	function showMsg(data){
		var msg = 	"<div class='message'>" +
						"<span class='username'>" + data.username + ":</span>" +
						"<span class='body'>" + data.message + "</span>" +
					"</div>";
		$('#messages-'+ data.room).append(msg)
		console.log('showmsg', $('#message-'+ data.room));
		// msgdiv.scrollTop(msgdiv.prop("scrollHeight"));
	}

	// UI STUFF

	// join or leave rooms by clicking on li
	$('button.room-link').click(toggle_room);
	function toggle_room(e){
		roomId = $(this).attr('data-room-id');
		console.log('room ' + roomId + ' clicked')
		if (inRoom(roomId)){leaveRoomClick($(this), roomId);}
		else{joinRoomClick($(this), roomId);}
	}

	// UI code to handle joining/leaving
	// sends socket message command to join or leave
	function joinRoomClick(room, roomId){
		console.log('attempting to join room ' + roomId)
		room.addClass('joined');
		socket.send(JSON.stringify({
			"command":'join',
			'room':roomId
		}));
	}
	function leaveRoomClick(room, roomId){
		console.log('attempting to leave room ' + roomId)
		room.removeClass('joined');
		socket.send(JSON.stringify({
			'command':'leave',
			'room':roomId
		}))
	}

	// T/F if you are in room with roomId
	function inRoom(roomId){
		// if a room div exists you are in that room
		return $('#room-' + roomId).length > 0; 
	}
})
