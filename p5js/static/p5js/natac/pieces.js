class Settlement{
	constructor(c){
		this.c = c;
	}

	set_xy(x,y){
		this.x = x;
		this.y = y;
	}

	draw(){
		if(this.x == undefined || this.y == undefined);
		fill(this.c);
		beginShape();
		vertex(this.x,this.y);
		vertex(this.x + piece_size, this.y + piece_size/1.74);
		vertex(this.x + piece_size/1.5, this.y + piece_size/1.74);
		vertex(this.x + piece_size/1.5, this.y + piece_size*1.2);
		vertex(this.x - piece_size/1.5, this.y + piece_size*1.2);
		vertex(this.x - piece_size/1.5, this.y + piece_size/1.74);
		vertex(this.x - piece_size, this.y + piece_size/1.74);
		endShape(CLOSE);
	}
}