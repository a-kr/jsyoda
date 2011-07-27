

/* ======================================================================== */
/* Room containing objects and terrain data.

    Room objects are passed as 1st argument in ActiveObject's constructor.
 */
var Room = function () {
    this.objects = [];
};

/* call this to display this room on screen */
Room.prototype.enter = function () {
    if (Game.currentroom) 
        Game.currentroom.leave();
    Game.currentroom = this;
    for (var i in this.objects) { 
        this.objects[i].enterRoom();
    }
    /* TODO update terrain */
};

/* call this to clear the screen before entering next room  */
Room.prototype.leave = function () {
    for (var i in this.objects) { 
        this.objects[i].leaveRoom();
    }
    /* TODO clear terrain tiles */
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

/* returns first object that is in this room, is located at (x,y) grid coords,
   and is an obstacle.
*/
Room.prototype.get_obstacles = function (x,y) {
    for (var i in this.objects) { 
        if (this.objects[i].cx == x && this.objects[i].cy == y && this.objects[i].obstacle)
            return this.objects[i];
    }
    return null;
};

/*============================================================================== */
/* ZoneRoom: room that is loaded from zone data extracted fro yodesk.dta
*/

var ZoneRoom = function (room_id) {
    ZoneRoom.superclass.constructor.apply(this, []);
    this.room_id = room_id;
    this.loadObjects();
};
ZoneRoom.inheritFrom(Room);

ZoneRoom.prototype.loadObjects = function () {
    /* load layer1 objects from zonedata */
    var zone = ZONES[this.room_id];
    for(var y = 0; y < zone.height; ++y) {
        for(var x = 0; x < zone.width; ++x) {
            var tile = zone.tiles[(y * zone.width + x) * 3 + 1];
            if (tile == 0 || tile == 65535) continue;
            
            var obj;
            if (AUTO_MONSTERS[tile]) {
                var ctor = WanderingMonster;
                if (AUTO_MONSTERS[tile].shooting)
                    ctor = ShootingMonster;
                obj = new ctor(this, MONSTER_SETS[AUTO_MONSTERS[tile].name], x,y, 10, 1, 1,
                    AUTO_MONSTERS[tile].loot, AUTO_MONSTERS[tile].loot_chance
                );
            }
            else {
                obj = new StaticObject(this, tile, x, y);
            }
        }
    }
};

ZoneRoom.prototype.enter = function () {
    
    /* load terrain from zonedata */
    var zone = ZONES[this.room_id];
    Game.grid = new jstile.Grid(zone.width, zone.height, 32, 32, jstile.ORTHOGONAL);
    Game.gridcells = [];
    var layer0tiles = [];
    var layer2tiles = [];
	for(var y = 0; y < zone.height; ++y) {
		for(var x = 0; x < zone.width; ++x) {
			var offset = Game.grid.offsets[x][y];
			var cell;
            cell = jstile.Sprite.tileFactory(
				zone.tiles[(y * zone.width + x) * 3],
				offset.left,
				offset.top,
				x+y
			);
			layer0tiles.push(cell);
            /*gridrow.push(cell);*/
            cell = jstile.Sprite.tileFactory(
				zone.tiles[(y * zone.width + x) * 3 + 2],
				offset.left,
				offset.top,
				x+y
			);
			layer2tiles.push(cell);
		}
        /*Game.gridcells.push(gridrow);*/
	}
	Game.layer0.addChild(layer0tiles);
	Game.layer2.addChild(layer2tiles);
    
    ZoneRoom.superclass.enter.apply(this);
};