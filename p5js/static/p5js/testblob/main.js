var pos;
var vel;
var mouse;
function setup(){
	createCanvas(500,500);
	pos = createVector(50,50);
}


function draw(){
	background(0);
	update();
	ellipse(pos.x,pos.y, 20,20);
}


function update(){
	mouse = createVector(mouseX, mouseY);
	
	// console.log(p5.Vector.sub(mouse, pos));
	vel = p5.Vector.sub(mouse, pos);
	vel.setMag(1);
	pos = pos.add(vel);
	if (pos.x > 500){pos.x = 500;}
	if (pos.x < 0){pos.x = 0;}
	if (pos.y < 0){pos.y = 0;}
	if (pos.y > 500){pos.y = 500;}
}