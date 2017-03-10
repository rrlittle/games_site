class Board{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.hexes = [
			new Stone(), new Stone(), new Stone(),
			new Brick(), new Brick(), new Brick(),  
			new Wood(), new Wood(), new Wood(), new Wood(),
			new Wheat(), new Wheat(), new Wheat(), new Wheat(),
			new Sheep(), new Sheep(), new Sheep(), new Sheep(),
			new Dessert()
		]

		this.hexes = shuffle(this.hexes);
		console.log(this.hexes);
	}

	arrange(){
		var dx = wall_len * sin(60);
		var dy = wall_len * cos(60);

		var x = this.x + 3 * dx;
		var y = this.y;
		for (var i = 0; i < 3; i++) { // row 1
			this.hexes[i].set_xy(x,y);
			x += 2*dx;
		}
		x = this.x + 2* dx;
		y += dy + wall_len;
		for (var i = 3; i < 7; i++) { // row 2
			this.hexes[i].set_xy(x,y);
			x += 2*dx;
		}
		x = this.x + dx;
		y += dy + wall_len;
		for (var i = 7; i < 12; i++) { // row 3
			this.hexes[i].set_xy(x,y);
			x += 2*dx;
		}
		x = this.x + 2* dx;
		y += dy + wall_len;
		for (var i = 12; i < 16; i++) { // row 4
			this.hexes[i].set_xy(x,y);
			x += 2*dx;
		}
		x = this.x + 3* dx;
		y += dy + wall_len;
		for (var i = 16; i < 19; i++) { // row 5
			this.hexes[i].set_xy(x,y);
			x += 2*dx;
		}
	}

	draw(){
		for (var i = 0; i < this.hexes.length; i++) {
			this.hexes[i].draw();
		}

	}
}