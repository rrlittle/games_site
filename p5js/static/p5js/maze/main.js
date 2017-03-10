var worldWidth = 1000;
var worldHeight = 600;

var cellsize;
var wallsize;
var wallcolor;
var visitedcolor;
var unvisitedcolor;
var currentcolor;

var m;

function setup(){
	cellsize = 10;
	wallsize = 2;
	wallcolor = color(0,150,100);
	visitedcolor = color(150, 0, 100, 100);
	unvisitedcolor = color(0);
	currentcolor = color(0, 255, 255)
	createCanvas(worldWidth, worldHeight);
	m = new Maze(worldWidth, worldHeight);
	// frameRate(100);
	while(m.step()){}
}


var generating = true; 
function draw(){
	background(0);
	// if(generating){
	// 	generating = m.step();
	// }
	m.draw();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
  	m.move(['left'])
  } else if (keyCode === RIGHT_ARROW) {
    m.move(['right'])
  } else if (keyCode === UP_ARROW) {
    m.move(['up'])
  } else if (keyCode === DOWN_ARROW) {
    m.move(['down'])
  }
}