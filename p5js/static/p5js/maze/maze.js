function Maze(width, height){
	this.h = height;
	this.w = width;
	this.cells = [];
	this.stack = []


	this.rows = floor(this.h / cellsize);
	this.cols = floor(this.w / cellsize);

	console.log(this.rows, this.cols);

	for (var r = 0; r < this.rows; r++) {
		for(var c = 0; c < this.cols; c++){
			this.cells.push(new Cell(c, r, c * cellsize, r * cellsize));
		}
	}


	this.get= function(c,r){
		return this.cells[c + this.cols * r]
	}
	

	this.draw = function(){			
		for (var i = this.cells.length - 1; i >= 0; i--) {
			this.cells[i].draw();
		}
		this.current.draw(true);
	}

	this.toggle_visit = function(x,y){
		this.get(x,y).visited = ! this.get(x,y).visited; 
	}
	
	this.current = this.get(0,0);
	this.start = this.current;	
	this.toggle_visit(this.current.c, this.current.r); 
	
	this.step = function(){
		var ns = this.newneighbors(this.current.c, this.current.r)
		
		if(ns.length > 0){
			this.stack.push(this.current);
			var last = this.current;
			this.current = random(ns);
			this.merge(last, this.current);
			this.toggle_visit(this.current.c, this.current.r); 
		}
		else{
			if(this.stack.length > 0){
				this.current = this.stack.pop();
			}
		}

		if (this.current === this.start){
			return false; // generating is false. no longer generating
		}
		else{return true}
	}


	this.neighbors = function(x, y){
		var ns = [];
		if (x != 0){ // left 
			ns.push(this.get(x - 1, y));
		} 
		if (y != 0){ // up 
			ns.push(this.get(x, y - 1));
		} 
		if (x != this.cols-1) { // right 
			ns.push(this.get(x + 1, y));
		} 
		if (y != this.rows-1){ // bottom 
			ns.push(this.get(x, y + 1));
		} 
		return ns;
	}


	this.newneighbors = function(x,y){
		var ns = this.neighbors(x,y);
		var new_ns =[]
		for (var i = 0; i < ns.length; i++) {
		 	if(!ns[i].visited){new_ns.push(ns[i]);}
		 } 
		 return new_ns;
	}

	// merge 2 neighboring cells
	this.merge = function(a, b){
		// figure out which walls to remove
		// ab  ba (y =y)  a/b  b/a

		if(a.r == b.r){ // on the same row
			if(a.c < b.c){ // ab remove a.right, b.left
				a.right = false;
				b.left = false;
			}
			if(b.c < a.c){ // ba remove b.right a.left
				b.right = false;
				a.left = false;
			}
		}
		if(a.c == b.c){ // on the same column
			if(a.r < b.r){ // a/b
				a.down = false;
				b.up = false;
			}
			if(b.r < a.r){ // b/a
				b.down = false;
				a.up = false;
			}
		}
	}

	this.getdir = function(dir){
		if(dir == 'up'){
			return this.get(this.current.c, this.current.r - 1)
		}
		if(dir == 'right'){
			return this.get(this.current.c + 1, this.current.r)
		}
		if(dir == 'down'){
			return this.get(this.current.c, this.current.r + 1)
		}
		if(dir == 'left'){
			return this.get(this.current.c - 1, this.current.r)
		}
	}

	this.move = function(dirs){
		// if(generating){return;} // do not allow moves while generating
		for (var i = 0; i < dirs.length; i++) {
			var dir = dirs[i];
			// allow movement only if current cell has no wall in that dir
			if(dir == 'up'){
				if(!this.current.up){this.current = this.getdir(dir);}
			}
			if(dir == 'right'){
				if(!this.current.right){this.current = this.getdir(dir);}
			}
			if(dir == 'down'){
				if(!this.current.down){this.current = this.getdir(dir);}
			}
			if(dir == 'left'){
				if(!this.current.left){this.current = this.getdir(dir);}
			}
		}
	}
}
