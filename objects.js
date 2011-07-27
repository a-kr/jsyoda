/* ========================================================================= */
/* StaticObject --- base class for  things
    (i.e. anything on layer1 except projectiles and player itself)
    
    @param room Room        room where this object will appear,
    @param tile_index       a tile_index
    @param cx int           grid coordinate x
    @param cy int           grid coordinate y
    @param on_frame func    handler of 'on_frame' event
    @param on_frame func    handler of projectile collision event
*/    
var StaticObject = function (room, tile_index, cx, cy, on_frame, on_hit) {
    this.state = 'INIT';
    this.obstacle = true;
    this.tile_index = tile_index;
    
    /* <IGameObject dynamic interface> */
    this.cx = cx;
    this.cy = cy;
    this.obstacle = true;
    this.sprite = null;
    /* </IGameObject> */
    
    if (on_frame) this.on_frame = on_frame;
    if (on_hit) this.on_hit = on_hit;
    
    this.sprite = null;
    this.room = room;
    this.room.addObj(this);
};


/* entering room with this object --- must register a sprite */
StaticObject.prototype.enterRoom = function () {
    var pos = Game.grid.offsets[this.cx][this.cy];
    this.sprite = jstile.Sprite.tileFactory(this.tile_index, pos.left, pos.top, 1, this.on_frame.bind(this));
    this.sprite.obj = this;
    Game.layer1.addChild(this.sprite);
    return this;
};

/* gives this object highest priority for collision checking */
StaticObject.prototype.bringToFront = function () {
    this.zindex++;
    var i = this.room.objects.indexOf(this);
    this.room.objects.splice(i, 1);
    this.room.objects.unshift(this);
};

/* updates sprite position.
    if nx and ny are not specified, uses this.cx and this.cy */
StaticObject.prototype.updatePos = function (nx, ny) {
    this.cx = (nx != undefined) ? nx : this.cx;
    this.cy = (ny != undefined) ? ny : this.cy;
    var pos = Game.grid.offsets[this.cx][this.cy];
    this.sprite.setPosition(pos.left, pos.top);
};

/* player leaves room containing this object, must remove the sprite */
StaticObject.prototype.leaveRoom = function () {
    this.sprite.obj = undefined;
    this.sprite.remove();
    this.sprite = null;
};

/* object is removed from the room (but not from the game, e.g. it may be moved
    to player's inventory
*/
StaticObject.prototype.remove = function (leave_sprite) {
    if (this.sprite && !leave_sprite)
        this.leaveRoom();
    this.room.removeObj(this);
    this.room = null;
};

/* this is called from Player's code when player bumps into this object.
*/


/* actions that are taken on every frame drawn */
StaticObject.prototype.on_frame = function () {
    /* do nothing */
};

/* when a projectile hits this object */
StaticObject.prototype.on_hit = function (damage) {
    /* default behaviour is to do nothing */
};



/* ===================================================================================== */
/* ActiveObject --- player can interact with it by bumping against it 
    @param item_index       index in array MAIN_ITEMS, or (if negative) a tile_index
*/
var ActiveObject = function (room, item_index, cx, cy, on_bump, on_frame, on_hit) {
    var tile_index;
    if (item_index >= 0) {
        this.item_index = item_index;
        tile_index = MAIN_ITEMS[item_index].tile_index;
    } else {
        this.item_index = null;
        tile_index = -item_index
    }
    ActiveObject.superclass.constructor.apply(this, [room, tile_index, cx, cy, on_frame, on_hit]);
    if (on_bump) this.on_bump = on_bump;
};

ActiveObject.inheritFrom(StaticObject);

ActiveObject.prototype.on_bump = function () {
    /* default behaviour is to do nothing */
};

/* ===================================================================================== */
/* PickableObject --- an object, which, when bumped twice, moves to player's inventory */
var PickableObject = function (room, item_index, cx, cy) {
    PickableObject.superclass.constructor.apply(this, [room, item_index, cx, cy]);
    
    this.blink_tiles = [EMPTY_TILE, this.tile_index];
    this.blinkdelay = 0;
};

PickableObject.inheritFrom(ActiveObject);

var BLINK_DELAY = 3; /* number of frames between blinking on and off */

PickableObject.prototype.on_bump = function () {
    this.state = 'BLINKING';
    Game.player.pickup(this);
};

PickableObject.prototype.on_frame = function () {
    if (this.state == 'BLINKING') {
        this.blinkdelay--;
        if (this.blinkdelay <= 0) {
            var tile = this.blink_tiles.shift();
            this.sprite.setTile(tile);
            this.blink_tiles.push(tile);
            this.blinkdelay = BLINK_DELAY;
        }
        if (jstile.keytracker[32 /* SPACE */]) {
            Game.player.finish_pickup();
        }
    } 
};

/* ===================================================================================== */
/* WanderingMonster wanders randomly in the room, biting the player on contact 
*/
var WanderingMonster = function (room, monster_set, cx, cy, walk_delay, hp, hit, loot, loot_chance) {
    this.monster_set = monster_set;
    this.direction = 'down';
    WanderingMonster.superclass.constructor.apply(this, [room, -monster_set.down, cx, cy]);
    this.walk_delay = walk_delay;
    this.walk_timer = walk_delay;
    this.hp = hp;
    this.max_hp = hp;
    this.hit = hit;
    this.loot = loot;
    this.loot_chance = loot_chance;
};

WanderingMonster.inheritFrom(ActiveObject);

WanderingMonster.prototype.on_bump = function () {
    Game.player.on_hit(this.hit);
};

WanderingMonster.prototype.on_hit = function (damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
        if (Math.random() < this.loot_chance)
            new PickableObject(this.room, this.loot, this.cx, this.cy).enterRoom().bringToFront();
        this.remove();
    }
};

WanderingMonster.prototype.on_frame = function () {
    this.walk_timer--;
    if (this.walk_timer <= 0) {
        /* select a cell where to go */
        var possible_positions = [
            {cx: this.cx - 1, cy: this.cy, new_dir: 'left'},
            {cx: this.cx + 1, cy: this.cy, new_dir: 'right'},
            {cx: this.cx, cy: this.cy + 1, new_dir: 'down'},
            {cx: this.cx, cy: this.cy - 1, new_dir: 'up'}
        ];
        var shuffled_positions = [];
        for (var i = 0; i < possible_positions.length; i++) {
            var p = possible_positions[i];
            if (p.cx < 0 || p.cx >= Game.grid.width || p.cy < 0 || p.cy >= Game.grid.width)
                continue;
            var obstacle = this.room.get_obstacles(p.cx, p.cy);
            if (obstacle)
                continue;
            shuffled_positions.push(p);
        }
        var selected_pos = shuffled_positions[Math.floor(Math.random() * shuffled_positions.length)];
        
        if (selected_pos) {
            if (this.direction != selected_pos.new_dir) {
                this.direction = selected_pos.new_dir;
                this.sprite.setTile(this.monster_set[this.direction]);
            }
            if (Game.player.cx == selected_pos.cx && Game.player.cy == selected_pos.cy) {
                this.on_bump();
            } else {
                this.updatePos(selected_pos.cx, selected_pos.cy);
            }
        }
        this.walk_timer = this.walk_delay + Math.floor(Math.random() * (this.walk_delay * 0.25) - (this.walk_delay * 0.125));
    }
};

/* ===================================================================================== */
/* ShootingMonster: besides wandering, shoots player on sight.
 */
var ShootingMonster = function (room, monster_set, cx, cy, walk_delay, hp, hit, loot, loot_chance, fire_delay) {
    ShootingMonster.superclass.constructor.apply(this, [room, monster_set, cx, cy, walk_delay, hp, hit, loot, loot_chance]);
    this.fire_delay = fire_delay || 10;
    this.fire_timer = 0;
};

ShootingMonster.inheritFrom(WanderingMonster);


ShootingMonster.prototype.on_frame = function () {
    this.sees_player = false;
    if (Game.player.cx == this.cx || Game.player.cy == this.cy) {
        var player_obscured = false;
        var deltas = DIRECTIONS[this.direction];
        var p = {x: this.cx, y: this.cy};
        var VISION_DISTANCE = VIEWPORT_SIDE;
        while (VISION_DISTANCE --> 0) {
            p.x += deltas.dx; p.y += deltas.dy;
            var obstacle = Game.currentroom.get_obstacles(p.x, p.y);
            if (obstacle) {
                player_obscured = true;
                break;
            }
            if (Game.player.cx == p.x && Game.player.cy == p.y) {
                this.sees_player = true;
                break;
            }
        }
        this.sees_player = this.sees_player && !player_obscured;
        if (this.sees_player && this.fire_timer <= 0) {
            /* fire! */
            this.fire_timer = this.fire_delay;
            var projectile = Projectile.factory("red", this.direction, 16, 2, this);
        }
    }
    if (this.fire_timer > 0) this.fire_timer--;
    
    /* wander only if don't see player */
    if (!this.sees_player)
        ShootingMonster.superclass.on_frame.apply(this);
};

/* ===================================================================================== */
/* Factory for creating sprites that serve as weapon projectiles.
    see tiles.js, PROJECTILES for tile indexes.
 */
var Projectile = {
    /*
        @param name string            name of projectile tile class (i.e. 'red')
        @param direction string       'up', 'down', 'left', right'
        @param speed number           movement per frame 
        @param damage  number         value which is passed to victim's on_hit handler 
        @param shooter Player|ActiveObject  origin of the projectile
    */
    factory: function (name, direction, speed, damage, shooter) {
        
        var deltas = DIRECTIONS[direction];
        var on_frame = function () {
            /* dies outside the viewport (using position on previous frame): */
            var pos = this._calculatedPosition;
            if (pos.left < 0 || pos.left >= VIEWPORT_SIDE_PX || pos.right < 0 || pos.right >= VIEWPORT_SIDE_PX) {
                this.remove();
                return;
            }
            this.left += deltas.dx * speed;
            this.top += deltas.dy * speed;
            
            /* dies outside the room:
            if (this.top < 0 || this.top >= Game.grid.heightPx || this.left < 0 || this.left >= Game.grid.widthPx) {
                this.remove();
                return;
            }*/
            this.setPosition(this.left, this.top);
            
            var collide_candidates = [Game.player.sprite];
            for (var i in Game.currentroom.objects) 
                if (Game.currentroom.objects[i].obstacle)
                    collide_candidates.push(Game.currentroom.objects[i].sprite);
            var hit = this.collides(collide_candidates);
            while (hit.length > 0) {
                victim = hit.shift();
                if (victim.obj == shooter)
                    continue;
                victim.obj.on_hit(damage);
                this.remove();
                /* TODO display explosion */
                return;
            }
        };
        var sprite = jstile.Sprite.tileFactory(PROJECTILES[name + '_' + direction], 
            shooter.sprite.left, shooter.sprite.top, 1000,
            on_frame);
        Game.layer1.addChild(sprite);
    }
};