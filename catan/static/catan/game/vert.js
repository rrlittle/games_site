function Vert(cnv, x, y, i){
	this.x = x;
	this.y = y;
	this.cnv = cnv;
	this.i = i;

	this.vertex = function(){
		this.cnv.vertex(this.x, this.y);
	}

	this.point = function(){
		this.cnv.point(this.x,this.y);
	}

	this.sameas = function(othervert){
		return Math.floor(this.x) == Math.floor(othervert.x) 
			&& Math.floor(this.y) == Math.floor(othervert.y);
	}

	this.draw = function(){
		this.cnv.fill(0);
		this.cnv.strokeWeight(5);
		this.point();
	}
}


// if global_vert contains equivalent vert. returns that vert.
// else returns undefined
function getVert(vert){
	for (vert_index in global_verts){
		var gv = global_verts[vert_index];
		if (gv.sameas(vert)){return gv;}
	}
	return undefined;
}
