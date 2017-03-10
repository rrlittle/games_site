function Board(cnv, wall_len, hexes){
	this.x; // location of board
	this.y; // location of board
	if(hexes){
		this.hexes = hexes; // board shape definition
	}else{this.hexes = [];}
	this.cnv = cnv; // the canvas to draw to
	this.wall_len = wall_len; // the size of each hex
	this.hex_objs = []; // container for the hex objects that get drawn
	this.verts = []


	this.set_hexes = function(hexes){
		for (h_i in hexes){
			var h = hexes[h_i];
			if(!this.hexes[h.row]){
				this.hexes[h.row] = [];
			}
			this.hexes[h.row][h.col] = h
		}
		// console.log('hexes set to', this.hexes);
		this.setup();
	}
	this.setup = function(){
		// console.log('setting up');
		this.hex_objs = []; // empty the hex objs

		var l = this.wall_len;
		var dx = l * this.cnv.sin(60);
		var dy = l * this.cnv.cos(60); 

		var x;
		var y = this.y;
		for (var r = 0; r < this.hexes.length; r++) {
			var row = this.hexes[r]; 
			x = this.x + dx; 
			if(r%2){x+= dx;} // every other row start 2dx away

			for (var c = 0; c < this.hexes[r].length; c++) {
				var hex_def = row[c];
				if(hex_def){
					var h = new Hex(this.cnv, l, hex_def.number, hex_def.resource,x,y);
					this.hex_objs.push(h);
				}
				x += 2*dx;
			}
			y += (l + dy);
		}
	}

	this.draw = function(){
		if(this.x == undefined || this.y == undefined){return;}
		for(i in this.hex_objs){
			var hex = this.hex_objs[i];
			hex.draw();
		}
	}

	this.set_xy = function(x,y){
		this.x=x;
		this.y=y;

		this.setup();
	}
}