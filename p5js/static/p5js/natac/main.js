var board; 
var pieces;
var wall_len =40; // required for resources. set it based on screen size
var piece_size = 15;
function setup(){
	angleMode(DEGREES);
	createCanvas(500, 500);
	b = new Board(50,50)
	b.arrange();

	pieces = new Settlement(color(255,0,0));
	pieces.set_xy(100,100);

}

function draw(){
	b.draw();
	pieces.draw();

}


// shuffles an array. useful for shuffling purposes throughout game
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];

        return a;
    }
}