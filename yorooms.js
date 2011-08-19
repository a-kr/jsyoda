/* Room classes which use dumped Yoda Stories zone data from yozones.js */

/*============================================================================== */
/* ZoneRoom: room that is loaded from zone data extracted fro yodesk.dta
*/

var ZoneRoom = function (room_id) {
    this.room_id = room_id;
    var width = ZONES[room_id].width;
    var height = ZONES[room_id].height;
    
    ZoneRoom.superclass.constructor.apply(this, [width, height]);
    
    this.prepareObjects();
};
ZoneRoom.inheritFrom(Room);

/* called once, to create objects in the room */
ZoneRoom.prototype.prepareObjects = function () {
    var zone = ZONES[this.room_id];
    for(var y = 0; y < zone.height; ++y) {
        for(var x = 0; x < zone.width; ++x) {
            /* layer 1 */
            var tile = zone.tiles[(y * zone.width + x) * 3 + 1];
            if (tile == EMPTY_TILE || tile == 65535) continue;
            
            var obj;
            if (AUTO_MONSTERS[tile]) {
                var ctor = WanderingMonster;
                if (AUTO_MONSTERS[tile].shooting)
                    ctor = ShootingMonster;
                obj = new ctor(this, MONSTER_SETS[AUTO_MONSTERS[tile].name], x,y, 10, 1, 1,
                    AUTO_MONSTERS[tile].loot, AUTO_MONSTERS[tile].loot_chance
                );
            } else if (AUTO_MOVABLES[tile]) {
                new MovableObject(this, tile, x,y);
            }
            else {
                obj = new StaticObject(this, tile, x, y);
            }
        }
    }
};

ZoneRoom.prototype.prepareSprites = function () {
    ZoneRoom.superclass.prepareSprites.apply(this);
    
    this.layer0tiles = [];
    this.layer2tiles = [];

    var zone = ZONES[this.room_id];
    for(var y = 0; y < zone.height; ++y) {
        for(var x = 0; x < zone.width; ++x) {
            /* layers 0 and 2 */
            var offset = Game.grid.offsets[x][y];
			var cell;
            cell = jstile.Sprite.tileFactory(
				zone.tiles[(y * zone.width + x) * 3],
				offset.left,
				offset.top,
				x+y
			);
			this.layer0tiles.push(cell);
           
            cell = jstile.Sprite.tileFactory(
				zone.tiles[(y * zone.width + x) * 3 + 2],
				offset.left,
				offset.top,
				x+y
			);
			this.layer2tiles.push(cell);
        }
    }
    
    Game.layer0.addChild(this.layer0tiles);
    Game.layer2.addChild(this.layer2tiles);
};

ZoneRoom.prototype.leave = function () {
    Game.layer0.removeChild(this.layer0tiles);
    Game.layer2.removeChild(this.layer2tiles);
    ZoneRoom.superclass.leave.apply(this);
};

/* Wild Room: wilderness zone */

var WildRoom = function (room_id) {
    WildRoom.superclass.constructor.apply(this, [room_id]);
};
WildRoom.inheritFrom(ZoneRoom);
