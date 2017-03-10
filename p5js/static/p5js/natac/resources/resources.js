class Resource{
	constructor(){
		this.color = 255;

	}

	draw(){		
		if(this.x == undefined || this.y == undefined){return;}
		fill(this.color);
		beginShape();
		vertex(this.x, this.y)
		vertex(this.x + (wall_len * sin(60)), this.y + (wall_len * cos(60)));
		vertex(this.x + (wall_len * sin(60)), this.y + (wall_len * cos(60)) + wall_len);
		vertex(this.x, this.y + (2 * wall_len * cos(60)) + wall_len);
		vertex(this.x - (wall_len * sin(60)), this.y + (wall_len * cos(60)) + wall_len);
		vertex(this.x - (wall_len * sin(60)), this.y + (wall_len * cos(60)));
		endShape(CLOSE);
	}

	vertices(){
		if(this.x == undefined || this.y == undefined){return;}
		return {
			top:			[this.x, this.y],
			top_right:		[this.x + (wall_len * sin(60)), this.y + (wall_len * cos(60))],
			bottom_right:	[this.x + (wall_len * sin(60)), this.y + (wall_len * cos(60)) + wall_len],
			bottom:			[this.x, this.y + (2 * wall_len * cos(60)) + wall_len],
			bottom_left:	[this.x - (wall_len * sin(60)), this.y + (wall_len * cos(60)) + wall_len],
			top_left:		[this.x - (wall_len * sin(60)), this.y + (wall_len * cos(60))]	
		}
	}

	set_xy(x,y){
		this.x = x;
		this.y = y;
	}

}

class Stone extends Resource{
	constructor(){
		super();
		this.color = color(100,120,155);
	}
}

class Brick extends Resource{
	constructor(){
		super();
		this.color = color(155,50,20);
	}
}

class Wheat extends Resource{
	constructor(){
		super();
		this.color = color(200,200,0);
	}
}

class Sheep extends Resource{
	constructor(){
		super();
		this.color = color(80,225,20);
	}
}

class Wood extends Resource{
	constructor(){
		super();
		this.color = color(0,120,0);
	}
}

class Dessert extends Resource{
	constructor(){
		super();
		this.color = color(255,255,60);
	}
}


