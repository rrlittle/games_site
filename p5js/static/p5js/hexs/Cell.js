function Cell(x,y){
	this.x = x;
	this.y = y;

	this.draw = function(){
		fill(255);
		beginShape();
		vertex(x,y)
		vertex(x + dx, y + dy);
		vertex(x + dx, y + dy + wall_len);
		vertex(x, y + dy + wall_len + dy);
		vertex(x - dx, y + dy + wall_len);
		vertex(x - dx, y + dy);
		endShape(CLOSE);
	}

}