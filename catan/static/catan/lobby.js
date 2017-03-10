/** this file manages the sockets and behavior of the players jumbotron. 
	it contains  list of player names as 
	list-group-items with player-# as their ids. 

	the messaging protocol is as such. 
	1. open connection
	2. you will be provided an init command that contains your name + id
	3. you will be provided colors with their associated colors

**/

// socket varaibles
var ws_protocol = window.location.protocol == "https:" ? "wss" : "ws";
var ws_path = ws_protocol + '://' + window.location.host + window.location.pathname + '/stream';
var socket;

var lastmsg;
var lastdata;
var myid; /// this clients playerid

// all the colors
var colors = ['blue', 'red', 'white', 'green', 'orange'];


/** handles player data. setting which colors are available
	data = {
		id: {
			name: playername,
			color: red/orange/green/...etc
		}
	}
**/
function set_players_and_colors(data){
	// enable all the colors
	for(i in colors){
		var c = colors[i]; 
		console.log('enabling',c);
		$('.color_btn.'+c).prop('disabled', false); // set disabled to false
	}

	// go through all the players
	$('#player_list').empty();
	for( p in data){
		var playerdata = data[p];
		// find the player
		if($('#player-' + p).length < 1){
			// if player doesn't exist add them
			add_player(p, playerdata.name);
		}
		if(playerdata.color != undefined){
			$('#player-'+p).css('background-color', playerdata.color);
			// disable the color
			$('.color_btn.'+playerdata.color).prop('disabled', true); 
		}
		else{
			$('#player-'+p).css('background-color', " #f5f5f5");
		}

		if(playerdata.vote != undefined){
			$('#vote-'+playerdata.vote).button('toggle')
		}
		// set the background color to c
	}
}

// adds a player
function add_player(id, name){
	var p = document.createElement('li');
	$(p).addClass('list-group-item');
	$(p).attr('id','player-'+id);
	$(p).append(name + " : " + id);
	$('#player_list').append(p);
}

function set_color(e){
	var c = this.dataset.color;
	console.log('setting my color to ', c);
	socket.send(JSON.stringify({
		command: 'set_color',
		color: c
	}));
}

// attempts to begin the game & redirects to game page
function begin_game(){
	payload = JSON.stringify({
		command:'begin',
		vote: $('[name=vote]:checked').val()
	});
	console.log('begin game sending', payload);
	socket.send(payload);
}

// leaves the lobby & redirects to main page 
function leave_lobby(){
	console.log('leave lobby');
	socket.send(JSON.stringify({
		'command':'leave',
		'playerid': myid
	}));
	window.location = $('#homepage').prop('href');
};

function set_vote(){
	var vote = $(this).find('input').attr('value'); 
	var payload = {
		command:'vote',
		vote:vote
	};
	console.log('sending vote', payload);
	socket.send(JSON.stringify(payload));

}


$(document).ready(function(){
	var myid = $('#myid').val();
	console.log(myid);
	console.log('Connecting to ' + ws_path);
	socket = new ReconnectingWebSocket(ws_path);

	socket.onmessage = handleMsg
	socket.onopen = function(){
		console.log('socket connected. sending join command');
		socket.send(JSON.stringify({command:'join'})) // join the lobby 

	}
	socket.onclose = function(){
		console.log('socket Disconnected');
	}

	$('.color_btn').click(set_color);
	$('#begin_game').click(begin_game);
	$('#leave_lobby').click(leave_lobby);
	$('.vote').on('click', set_vote)
	
});




function handleMsg(msg){
	lastmsg = msg;
	var data = JSON.parse(msg.data);
	lastdata = data;
	console.log('Got msg from websocket', data);
	if(data.err){
		alert(data.err);
		return;
	}
	if(data.notify){
		$('#notifications').append(data.notify);
		$("#notifications").show();
		window.setTimeout(function () { 
			$("#notifications").hide();
			$("#notifications").empty(); 
		}, 2000);                 
	}

	if('statuses' in data){
		set_players_and_colors(data.statuses);
	}else if('i_am' in data){
		myid = data.i_am;
		console.log('i am', myid);
	}else if('ready' in data){
		console.log('lobby ready', data.ready); // true if ready
		// set disabled to the opposite
		$('#begin_game').prop('disabled', !data.ready); 
	}else if('begin_game' in data){
		var path = window.location.protocol + '//' + window.location.host + data.begin_game;
		// alert('going to ' + path);
		window.location = path;
	}else{console.log('could not process msg!');}
		
}