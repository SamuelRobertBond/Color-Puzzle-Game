var game = new Phaser.Game(480, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//Dimensions
var gridWidth = 5;
var gridHeight = 10;
var tileTize; //Calculated in create
var puzzleStartX;
var puzzleStartY;

var tileSize;

//Cursor
var cursors;

//Groups
var bounds;

//Tile In Play
var activeTile;
var tiles;
var activeTilePosition; //Used for movement logic


function preload() {
	game.load.image("grid", "assets/TileBackground.png");
	game.load.image("empty", "assets/empty.png");
	game.load.image("test", "assets/testTile.png");

	cursors = game.input.keyboard.createCursorKeys();
}

function create() {

	//Enables arcade physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//Creates group for the background tiles
	var background = game.add.group();

	tileSize = 32 * 2;

	puzzleStartX =  game.world.width/2 - (gridWidth/2 * tileSize);
	puzzleStartY = (tileSize);

	var puzzleHeight = tileSize * gridHeight;

	for(var i = 0; i < gridWidth; ++i){
		for(var j = 0; j < gridHeight; ++j){
			
			var sprite = game.add.sprite((tileSize * i) + puzzleStartX, tileSize * j + puzzleStartY, "grid");
			sprite.scale.setTo(2,2);

		}
	}

	//Creates the physics bounds for the puzzle peices
	bounds = game.add.group();
	tiles = game.add.group();

	bounds.enableBody = true;
	tiles.enableBody = true;

	game.physics.arcade.enable(bounds);
	game.physics.arcade.enable(tiles);

	var bound = bounds.create(0, game.world.height - (puzzleStartY + tileSize/2), "empty");
	bound.scale.setTo(game.world.width, 2);
	bound.body.immovable = true;

	spawnTile();


}

function update() {

	//Physics and Collision Logic
	game.physics.arcade.collide(activeTile, tiles, tileCollisionEvent);
	game.physics.arcade.collide(activeTile, bounds, tileCollisionEvent);

	//Controls
	tileControls();
}

var released = true;

// Active tile Movment Controls
function tileControls(){

	if(released){
		if(cursors.left.isDown && activeTilePosition > 1){
			activeTile.body.x -= tileSize;
			--activeTilePosition;
			released = false;

		}else if(cursors.right.isDown && activeTilePosition < 5){
			activeTile.body.x += tileSize;
			++activeTilePosition;
			released = false;
		}
	}else{
		if(!cursors.left.isDown && !cursors.right.isDown){
			released = true;
		}
	}

}

function spawnTile(){

	activeTilePosition = 3;

	//Sets the play test tile
	activeTile = game.add.sprite(game.world.width/2 - (tileSize/2), 0, "test");
	activeTile.scale.setTo(2,2);
	
	//ActiveTile settings
	game.physics.arcade.enable(activeTile);
	activeTile.body.bounce.y = 0;
	activeTile.body.gravity.y = 200;
	activeTile.body.collideWorldBounds = false;	

} 


function tileCollisionEvent(){

	var tile = tiles.create(activeTile.body.x, activeTile.body.y, "test");
	tile.scale.setTo(2,2);
	tile.body.immovable = true

	activeTile.kill();

	spawnTile();
}