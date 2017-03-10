function Blob(c, r, pos){
	this.c = c || color(random(255),random(255), random(255));
	this.r = r || random(10, 20);
	this.pos = pos || createVector(random(worldWidth), random(worldHeight));
	this.area = PI * this.r * this.r;
	this.eaten = false;

	this.draw = function(){
		noStroke();
		fill(this.c);
		ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
	}

	this.update = function(){

		var mouse = createVector(viewWidth/2 - mouseX, viewHeight/2 - mouseY);
		mouse.limit(3);
		this.pos = this.pos.sub(mouse);
		if (this.pos.x > worldWidth) { this.pos.x = worldWidth;}
		if (this.pos.x < 0) { this.pos.x = 0;}
		if (this.pos.y > worldHeight) { this.pos.y = worldHeight;}
		if (this.pos.y < 0) { this.pos.y = 0;}
	}

	this.eat = function(other){
		// console.log(this.r, p5.Vector.sub(pos, other.pos).mag());
		if(p5.Vector.dist(this.pos, other.pos) < this.r + other.r){
			this.area += other.area;
			this.r = sqrt(this.area/PI); 
			other.eaten = true;
		}
	}
}