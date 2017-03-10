var hex_defs = [];
var piece_defs = [];

var global_verts = [];
var pieces = [];
var board;
var piece_to_build = undefined;
function boardSketch(p){
	p.setup = function(){
		p.angleMode(p.DEGREES);
		p.createCanvas($('#board').width(), $('#board').height());
  		board = new Board(p, 50);
  		board.set_xy(50,50);

	}
	p.windowResized = function(){
		p.resizeCanvas($('#board').width(), $('#board').height())
	}
	p.draw = function(){
		board.set_hexes(hex_defs);
  		pieces = [];
  		for(pi in piece_defs){
  			var piece = piece_defs[pi];
  			pieces.push(new Piece(p, piece.building, piece.loc, piece.color, piece.loc2));
  		}

		// draw background
		p.background(p.color(50,150,200));
		// draw board hexes
		board.draw();
		// draw all the vertexes
		for(gv_i in global_verts){ 
			var gv = global_verts[gv_i]; 
			gv.draw();
			p.strokeWeight(2);
			p.text(gv_i, gv.x, gv.y-10);
		}
		
		// draw the pieces on top
		for(pi in pieces){
			pieces[pi].draw();
		}
	}
}

new p5(boardSketch, 'board');

// socket varaibles
var ws_protocol = window.location.protocol == "https:" ? "wss" : "ws";
var ws_path = ws_protocol + '://' + window.location.host + window.location.pathname + '/stream';
var socket;

var lastmsg;
var lastdata;
var myid; 
$(document).ready(function(){
	console.log('connecting to', ws_path);
	socket = new ReconnectingWebSocket(ws_path);

	socket.onmessage = handleMsg;
	socket.onopen = function(){
		console.log('socket connected, sending join command');
		socket.send(JSON.stringify({command:'join'}));
	}
	socket.onclose = function(){
		console.log('socket disconnected');
	}

});

function handleMsg(msg){
	lastmsg = msg;
	var data = JSON.parse(msg.data);
	lastdata = data;
	console.log('got msg from websocket', data);
	if(data.err){
		alert(data.err);
		return;
	}

	if('hexes' in data && 'pieces' in data){
		console.log('setting hexes to', data.hexes);
		hex_defs = data.hexes;
		console.log('setting pieces to', data.pieces);
		piece_defs = data.pieces
	}else{console.log('could not process message', Object.keys(data));}
}
