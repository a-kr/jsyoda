var Game = {
    grid: null,
    gridcells: null,
    currentroom: null,
    player: null,
    world: null,
    
    /* layerN : Sprite; layerN_layer: Layer containing a single toplevel sprite layerN */
    layer0: null,
    layer0_layer: null,
    layer1: null,
    layer1_layer: null,
    layer2: null,
    layer2_layer: null,
    overlayer: null
};


Game.createLayerRoots = function () {
    Game.layer0 = jstile.Sprite.tileFactory(EMPTY_TILE, 0, 0, 1);
    Game.layer1 = jstile.Sprite.tileFactory(EMPTY_TILE, 0, 0, 1);
    Game.layer2 = jstile.Sprite.tileFactory(EMPTY_TILE, 0, 0, 1);
    Game.layer0_layer.addSprite(Game.layer0);
    Game.layer1_layer.addSprite(Game.layer1);
    Game.layer2_layer.addSprite(Game.layer2);
};

Game.startOverlayer = function () {
    Game.layer0_layer.stop();
    Game.layer1_layer.stop();
    Game.layer2_layer.stop();
    Game.overlayer.start();
};
Game.stopOverlayer = function () {
    Game.overlayer.stop();
    Game.layer0_layer.start();
    Game.layer1_layer.start();
    Game.layer2_layer.start();
    Game.layer0_layer._refresh(true, true); 
    Game.layer1_layer._refresh(true, true); 
    Game.layer2_layer._refresh(true, true); 
};

/* Set position of layers 0,1,2 at specific coords (in pixels, usually negative).
   
   Actually sets position of root sprites in respective layers.
   Is used to scroll the viewport.
 */
Game.positionLayers = function (off_x, off_y) {
    Game.layer0.setPosition(off_x, off_y);
    Game.layer1.setPosition(off_x, off_y);
    Game.layer2.setPosition(off_x, off_y);
    /* repaint layers immediately, do not wait for timer;
       but do not call onDrawCallback this time
    */
    Game.layer0_layer._refresh(true, true); 
    Game.layer1_layer._refresh(true, true); 
    Game.layer2_layer._refresh(true, true); 
};

var DIRECTIONS = {  
    up:    {dx: 0, dy: -1},
    down:  {dx: 0, dy: +1},
    left:  {dx: -1, dy: 0},
    right: {dx: +1, dy: 0}
};
/* sidestepping deltas for forward motion directions */
var SIDESTEPS = {
    up:    {dx: 1, dy: 0}, /* means "we can variate x in +/- 1 neighborhood */
    down:  {dx: 1, dy: 0},
    left:  {dx: 0, dy: 1},
    right: {dx: 0, dy: 1}
};

var VIEWPORT_SIDE = 9;
var VIEWPORT_SIDE_PX = VIEWPORT_SIDE * 32;

/* The one and the only entry point */
var init_game = function () {
	Game.layer0_layer = new jstile.Layer(VIEWPORT_SIDE_PX, VIEWPORT_SIDE_PX, 20); /* is changed to 1 shortly after init */
	Game.layer1_layer = new jstile.Layer(VIEWPORT_SIDE_PX, VIEWPORT_SIDE_PX, 20);
	Game.layer2_layer = new jstile.Layer(VIEWPORT_SIDE_PX, VIEWPORT_SIDE_PX, 20);
	Game.overlayer =    new jstile.Layer(VIEWPORT_SIDE_PX, VIEWPORT_SIDE_PX, 20);
    
    Game.createLayerRoots();
    
    Game.layer0_layer.init('layer0');
    Game.layer1_layer.init('layer1');
    Game.layer2_layer.init('layer2');
    Game.overlayer.init('overlayer');
    
    Game.world = new World();
    
    /*
    var room = new SimpleRoom(15,15);
    new ActiveObject(room,     PEOPLE['Sidor'], 6,4);
    new StaticObject(room,     7, 2,3);
    new MovableObject(room,     7, 2,4);
    new MovableHidingObject(room,     7, 3,4, THINGS['10,000 Credits']);
    new ContainerObject(room, CONTAINER_SETS["sandchest"], 4,4, THINGS['Navicomputer']);
    new PickableObject(room,   THINGS['Red Key Card'], 7,5);
    
    new ShootingMonster(room, MONSTER_SETS['Scouttrooper'], 1,8, 10, 1, 1, 27, 0.6);
    new WanderingMonster(room, MONSTER_SETS['Tusken'], 1,4, 10, 1, 1,  27, 0.6);
    new WanderingMonster(room, MONSTER_SETS['Jawa'], 5,6, 10, 1, 1, 27, 0.6);
    room.enter();
    */
    
    Game.player = new Player();
    /*Game.player.go_absolute(4,5);*/
    
    Game.stopOverlayer();
    Game.world.startGame();
    
    Game.layer0_layer.setFramerate(1);
    Game.layer2_layer.setFramerate(1);
};


