
function Cell(c, r, x,y){

	this.r = r; // row
	this.c = c; // column

	this.x = x; // x coord
	this.y = y; // y coord

	this.visited = false;

	this.up = true;
	this.right = true;
	this.left = true;
	this.down = true;

	this.draw = function(current) {
		noStroke();
		if (this.visited == true){ fill(visitedcolor); }
		else if(current){ fill(currentcolor);}
		else { fill(unvisitedcolor); }

		rect(this.x, this.y, cellsize, cellsize);

		stroke(wallcolor);
		strokeWeight(wallsize);
		if(this.up){		
			line(this.x, this.y, this.x + cellsize, this.y);
		} 
		if(this.right){	
			line(this.x + cellsize, this.y, this.x + cellsize, this.y + cellsize);
		}
		if(this.left){	
			line(this.x, this.y, this.x, this.y + cellsize);
		}
		if(this.down){	
			line(this.x, this.y + cellsize, this.x + cellsize, this.y + cellsize);
		}
	}

}