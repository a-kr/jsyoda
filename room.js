var STD_ROOM_SIZE = 18; /* size of exterior rooms (interior may be of any size) */

/* ======================================================================== */
/* Room containing objects and terrain data.

    Room objects are passed as 1st argument in StaticObject's constructor.
 */
var Room = function (width, height) {
    this.objects = [];            /* list of objects (StaticObject descendants) for layer1 */
    this.width =  width || STD_ROOM_SIZE;   /* size in tiles */
    this.height = height || STD_ROOM_SIZE;
    this.quest = null;            /* a Quest instance, if any */
    this.entry_point = null;      /* an {x,y} object; used when teleporting into this room 
                                   * as initial position for player */    
};

/* call this to display this room on screen 
 * @param int scroll_dx: +1, 0 or -1 depending on where the player came from *
 *                       +1 means 'player went right' (we need to scroll left)
 * @param int scroll_dy: +1 means 'player went down' (scrolling up)
 */
Room.prototype.enter = function (enterCallback, scroll_dx, scroll_dy) {
    this.old_layer0 = Game.layer0;
    this.old_layer1 = Game.layer1;
    this.old_layer2 = Game.layer2;
    this.enterCallback = enterCallback;
    
    Game.createLayerRoots();
    
    this.prepareSprites();
    if (scroll_dx !== undefined) {
        /* transit animation */
        Game.player.controls_enabled = false;
        var room = this;
        Game.positionLayers(room.old_layer0.left + STD_ROOM_SIZE*32*scroll_dx, room.old_layer0.top + STD_ROOM_SIZE*32*scroll_dy);
        
        room.remainingAnimationSteps = VIEWPORT_SIDE;
        var delta = (VIEWPORT_SIDE * 32) / room.remainingAnimationSteps;
        var shiftLayers = function () {
            if (room.remainingAnimationSteps > 0) {
                room.old_layer0.setPositionDelta(-scroll_dx * delta, -scroll_dy * delta);
                room.old_layer1.setPositionDelta(-scroll_dx * delta, -scroll_dy * delta);
                room.old_layer2.setPositionDelta(-scroll_dx * delta, -scroll_dy * delta);
                Game.positionLayers(Game.layer0.left - scroll_dx * delta, Game.layer0.top - scroll_dy * delta); 
                room.remainingAnimationSteps--;
            } else {
                room.enterFinish();
            }
        };
        this.old_layer1.onDrawCallback = shiftLayers;
    } else {
        /* finalize operation directly */
        this.enterFinish();
    }
};

/* After transit animation is completed... */
Room.prototype.enterFinish = function () {
    if (Game.currentroom) 
        Game.currentroom.leave();
        
    if (Game.player) {
        this.old_layer1.removeChild(Game.player.sprite);
        Game.layer1.addChild(Game.player.sprite);
        Game.player.controls_enabled = true;
    }
    this.old_layer0.remove();     
    this.old_layer1.remove();     
    this.old_layer2.remove();     
    
    Game.currentroom = this;
    
    
    if (this.enterCallback)
        this.enterCallback();
}

Room.prototype.prepareSprites = function () {
    Game.grid = new jstile.Grid(this.width, this.height, 32, 32, jstile.ORTHOGONAL);
    for (var i in this.objects) { 
        this.objects[i].enterRoom();
    }
};

/* call this to clear the screen before entering next room  */
Room.prototype.leave = function () {
    for (var i in this.objects) { 
        this.objects[i].leaveRoom();
    }
    Game.currentroom = null;
};

/* is called in ActiveObject's constructor */
Room.prototype.addObj = function (obj) {
    this.objects.push(obj);
};

/* is called in ActiveObject's destructor */
Room.prototype.removeObj = function (obj) {
    var i = this.objects.indexOf(obj);
    this.objects.splice(i, 1);
};

/* returns first object which is located at (x,y) grid coords
   and is an obstacle.
*/
Room.prototype.get_obstacles = function (x,y) {
    for (var i in this.objects) { 
        if (this.objects[i].cx == x && this.objects[i].cy == y && this.objects[i].obstacle)
            return this.objects[i];
    }
    return null;
};

/* ======================================================================== */
var SimpleRoom = function (width, height) {
    SimpleRoom.superclass.constructor.apply(this, [width, height]);
};
SimpleRoom.inheritFrom(Room);

SimpleRoom.prototype.prepareSprites = function () {
    SimpleRoom.superclass.prepareSprites.apply(this);
    
    this.layer0tiles = [];
    this.layer2tiles = [];
    for(var y = 0; y < this.height; ++y) {
        for(var x = 0; x < this.width; ++x) {
            var cell;
            var offset = Game.grid.offsets[x][y];
            cell = jstile.Sprite.tileFactory(
                Math.floor(Math.random() * 6),
                offset.left,
                offset.top,
                x+y
            );
            this.layer0tiles.push(cell);
            
        }
    }
    Game.layer0.addChild(this.layer0tiles);
    Game.layer2.addChild(this.layer2tiles);
    
}; 

SimpleRoom.prototype.leave = function () {
    Game.layer0.removeChild(this.layer0tiles);
    Game.layer2.removeChildren(this.layer0tiles);
    SimpleRoom.superclass.leave.apply(this);
};
