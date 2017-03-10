var piecesize = 20;
function Piece(cnv, type, loc, color, loc2){	
	this.loc = loc;
	this.loc2 = loc2;
	this.cnv = cnv;
	this.type = type;
	this.v = global_verts[this.loc];
	if(loc2 != undefined){this.v2 = global_verts[this.loc2];}

	if (color == 'red'){
		this.color = this.cnv.color(255,0,0);
	}else if(color == 'green'){
		this.color = this.cnv.color(50,230,50);
	}else if(color == 'blue'){
		this.color = this.cnv.color(50,50,255);
	}else if(color == 'white'){
		this.color = this.cnv.color(240);
	}else if(color == 'orange'){
		this.color = this.cnv.color(255,165,0);
	}else{
		console.log('cannot identify color', color);
		this.color = this.cnv.color(0);
	}

	this.draw = function(){
		this.cnv.strokeWeight(2);
		this.cnv.stroke(0);
		this.cnv.fill(this.color);
		if(this.v == undefined){
			console.log('location ', this.loc, 'invalid'); 
			return;
		}
		if(this.type == 'settlement'){
			this.cnv.triangle(this.v.x, this.v.y - piecesize/1.75, 
				this.v.x + piecesize/2, this.v.y + piecesize/2,
				this.v.x - piecesize/2, this.v.y + piecesize/2 );
		}
		if(this.type == 'city'){
			this.cnv.rect(this.v.x - piecesize/2, this.v.y - piecesize/2, 
				piecesize, piecesize);	
		}
		if(this.type == 'road'){
			this.cnv.strokeWeight(8);
			this.cnv.line(this.v.x,this.v.y, this.v2.x,this.v2.y);
			this.cnv.strokeWeight(6);
			this.cnv.stroke(this.color);
			this.cnv.line(this.v.x,this.v.y, this.v2.x,this.v2.y);
		}
	};
}