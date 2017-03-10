var cells = [];
var wall_len = 10;
var dx;
var dy;


function setup(){
	angleMode(DEGREES);
	dx = wall_len * sin(60);
	dy = wall_len * cos(60);
	createCanvas(600, 500);

	var even = true;
	var y = 0;
	var x;
	while(y < height - dx){
		if (even){x = dx;}
		else{x = 2*dx;}
		even = !even;
		
		while(x < width - dy - wall_len){
			cells.push(new Cell(x,y))
			x += 2* dx;
		}
		y += dy + wall_len;
	}

}

function draw(){
	background(51);
	for (var i = cells.length - 1; i >= 0; i--) {
		cells[i].draw();
	}
}
