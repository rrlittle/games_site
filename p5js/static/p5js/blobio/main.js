var worldHeight = 1000;
var worldWidth = 2000;

var viewWidth = 600;
var viewHeight = 400;


var player;
var blobs = [];
function setup(){
	createCanvas(viewWidth,viewHeight);
	for (var i = 0; i < 50; i++) {
		blobs.push(new Blob);
	}
	player = new Blob(color(200,100,50), 50);
}

function draw(){
	// move the origin to the players.
	translate(viewWidth/2,viewHeight/2);
	scale(50/player.r);
	translate(-player.pos.x, -player.pos.y);
	background(0);
	
	player.update();
	player.draw();
	
	for (var i = blobs.length-1; i >=0; i--) {
		player.eat(blobs[i]);
		if (blobs[i].eaten){
			blobs.splice(i,1);  // remove the eaten blob
		} 
		else{
			blobs[i].draw();
		}	
 	}

 	if (blobs.length < 10){
 		for (var i = 0; i < 50; i++) {
			blobs.push(new Blob);
		}
 	}	

}