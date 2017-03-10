var r = 100;
var R = 200;
var h;
var w;
var e;
var midpoint;
var rSlider;
var aSlider;
var hSlider;
var wSlider;
var eSlider;


function setup(){
	createCanvas(700, 600);
	midpoint = new p5.Vector(400,300)
	stroke(255);
	rSlider = createSlider(-R, 2*R, R, 0.001);
	rSlider.position(20,20);
  
	aSlider = createSlider(0, 2*PI, PI, 0.001);
	aSlider.position(20,50);

	hSlider = createSlider(0, 300, 100, 0.001);
	hSlider.position(20,80);

	wSlider = createSlider(0, 300, 100, 0.001);
	wSlider.position(20,110);

	eSlider = createSlider(0, 2*PI, PI, 0.001);
	eSlider.position(20,140);

	button = createButton('log points');
  	button.position(200, 15);
  	button.mousePressed(log);

}

function log(pts){
	console.log('\n\npoints:');
	console.log(midpoint.x, midpoint.y - R);
	console.log(pts.x1, pts.y1);
	console.log(pts.x2, pts.y2);
	console.log(midpoint.x, midpoint.y + R);
	console.log('\n\n');
}

function draw(){
	background(51);
	fill(255);
	strokeWeight(1);
	text("r", 165, 30);
  	text("a", 165, 60);
  	text("h", 165, 90);
  	text("w", 165, 120);
  	text("e", 165, 150);
	noFill();
	ellipse(midpoint.x, midpoint.y, 2*R, 2*R);
	r = rSlider.value();
	a = aSlider.value();
	h = hSlider.value();
	w = wSlider.value();
	e = eSlider.value();
	// console.log(a)
	ellipse(midpoint.x,midpoint.y, 2*r, 2*r);
	var pts = get_opp_points_on_circle(midpoint,r,a);
	// line(pts.x1,pts.y1, pts.x2,pts.y2);
	bezier(midpoint.x, midpoint.y - R, 
		pts.x1, pts.y1, 
		pts.x2, pts.y2, 
		midpoint.x, midpoint.y + R);

	var c1 = get_centroid(midpoint.x, midpoint.y - R, 
		pts.x2, pts.y2, 
		midpoint.x, midpoint.y);

	var c2 = get_centroid(midpoint.x, midpoint.y + R, 
		pts.x1, pts.y1, 
		midpoint.x, midpoint.y);

	strokeWeight(5);
	// point(c1.x, c1.y);
	// point(c2.x, c2.y);
	strokeWeight(1);

	translate(c1.x , c1.y);
	rotate(e);
	ellipse(0 , 0, w,h);
	rotate(-e);
	translate(-c1.x , -c1.y);
	translate(c2.x , c2.y);
	rotate(-e);
	ellipse(0,0,w,h);

	
}

function get_centroid(x1,y1, x2,y2, x3, y3){
	return {x:(x1+x2+x3)/3.0, y:(y1+y2+y3)/3.0};
}

function get_opp_points_on_circle(mp, rd, a){
	var x1 = rd*cos(a) + mp.x;
	var y1 = rd*sin(a) + mp.y;
	var x2 = rd*cos(a + PI) + mp.x;
	var y2 = rd*sin(a + PI) + mp.y;

	return {x1:x1, 
			y1:y1, 
			x2:x2, 
			y2:y2
		};
}
