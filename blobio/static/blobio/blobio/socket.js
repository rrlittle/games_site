var socket; 

$(document).ready(function(){
		connect();
		// window.setInterval(connect, 20000);
	}
)

// connect to the server and update socket to hold connection
function connect(){
	var lobby = $('#lobby')[0].value;
	var conn = 'ws://' + window.location.host + '/blobio/' + lobby;
		console.log('beginning connection to server', conn);

	socket = new WebSocket(conn);
	socket.onmessage = recievemsg;
	socket.onopen = function(){
		console.log('connection open');
		window.setInterval(sendMouse, 2000);		
	};
	socket.onclose = function(){
		window.clearInterval();
		console.log('connection closed');
	}
}

// sends the dx/dy of the mouse
function sendMouse(){
	// console.log('sending mouse');
	var msg = {
		// x: vel.x, 
		// y: vel.y
	}
	if (socket.readyState == WebSocket.OPEN){ 
		socket.send(JSON.stringify(msg))}
	else{console.log('did not send mouse', socket.readyState)}
}

// updates the x/y of the player
function recievemsg(msg){
	msg = JSON.parse(msg.data);
	console.log('recived', msg)
	// vel.x = msg.x;
	// vel.y = msg.y
}