function Hex(cnv, wall_len, num, type, x, y){
	// console.log('creating', type, 'hex at',x,y);
	this.cnv = cnv;
	this.num = num;
	this.wall_len = wall_len;
	this.x = x;
	this.y = y;
	this.verts = {};

	// set up the color
	if(type == 'stone'){this.color = this.cnv.color(100,120,155);}
	else if(type == 'wood'){this.color = this.cnv.color(0,120,0);}
	else if(type == 'sheep'){this.color = this.cnv.color(80,225,20);}
	else if(type == 'brick'){this.color = this.cnv.color(155,50,20);}
	else if(type == 'wheat'){this.color = this.cnv.color(200,200,0);}
	else if(type ==  'desert'){this.color = this.cnv.color(255,255,60);}
	else{
		console.log(type, 'does not compute');
		this.color = this.cnv.color(255);
	}

	// set up the vertices
	var l = this.wall_len;
	var dx = l * this.cnv.sin(60);
	var dy = l * this.cnv.cos(60); 

	// create a new vert 
	this.verts.top = new Vert(this.cnv, this.x, this.y);
	this.verts.topright = new Vert(this.cnv, this.x + dx, this.y + dy);
	this.verts.botright = new Vert(this.cnv, this.x + dx, this.y + dy + l);
	this.verts.bot = new Vert(this.cnv, this.x, this.y + (2 * dy) + l);
	this.verts.botleft = new Vert(this.cnv, this.x - dx, this.y + dy + l);
	this.verts.topleft = new Vert(this.cnv, this.x - dx, this.y + dy);
	for (i in this.verts){ // for each vert in the hex
		var e = getVert(this.verts[i]);
		if(e){ // if vert exists
			// console.log(i,'found existing vert at',e.x,e.y);
			this.verts[i] = e; // replace with existing vert
		}
		else{
			// console.log(i,'created new vert at', this.verts[i].x,this.verts[i].y);
			global_verts.push(this.verts[i]); // else save this vert
		}
	}
	// check if vert exists in globalvert
	// if it exists replace newvert with existing vert
 	
	this.draw = function(){
		if(this.x == undefined || this.y == undefined){return;}
		var l = this.wall_len;
		var dx = l * this.cnv.sin(60);
		var dy = l * this.cnv.cos(60); 
		this.cnv.stroke(0);
		this.cnv.fill(this.color);
		this.cnv.strokeWeight(1);
		this.cnv.beginShape();
		this.verts.top.vertex();
		this.verts.topright.vertex();
		this.verts.botright.vertex();
		this.verts.bot.vertex();
		this.verts.botleft.vertex();
		this.verts.topleft.vertex();
		this.cnv.endShape(this.cnv.CLOSE);

		if(this.num != undefined){
			this.cnv.fill(this.cnv.color(250,230,230))
			this.cnv.ellipse(this.x, this.y + dy +l/2, dx, dx)
			this.cnv.fill(0);
			this.cnv.textAlign(this.cnv.CENTER);

			this.cnv.textSize(15);
			this.cnv.text(this.num, this.x, this.y + dy + l/2 + 5);
		}

	};

	this.set_xy = function(x,y){
		this.x = x;
		this.y = y;
	};
}
