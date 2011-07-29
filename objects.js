/* ========================================================================= */
/* StaticObject --- base class for  things
    (i.e. anything on layer1 except projectiles and player itself)
    
    @param room Room        room where this object will appear,
    @param tile_index       a tile_index
    @param cx int           grid coordinate x
    @param cy int           grid coordinate y
    @param on_frame func    handler of 'on_frame' event
*/    
var StaticObject = function (room, tile_index, cx, cy, on_frame) {
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

/* updates sprite tile */
StaticObject.prototype.updateTile = function (tile_index) {
    this.tile_index = tile_index;
    this.sprite.setTile(tile_index);
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

/* actions that are taken on every frame drawn */
StaticObject.prototype.on_frame = function () {
    /* do nothing */
};



/* ===================================================================================== */
/* MovableObject --- player can push and pull them                                       */
/* (for push/pull code see player.js, push_pull() function of the player object          */

var MovableObject = function(room, tile_index, cx, cy) {
    MovableObject.superclass.constructor.apply(this, [room, tile_index, cx, cy]);
    this.movable = true;
    this.moved = false;
};

MovableObject.inheritFrom(StaticObject);

MovableObject.prototype.on_move = function (nx,ny) {
    this.updatePos(nx,ny);
    this.moved = true;
};

/* ===================================================================================== */
/* MovableHidingObject --- when moved, exposes an item hidden underneath                 */
var MovableHidingObject = function(room, tile_index, cx, cy, hidden_item_index) {
    MovableHidingObject.superclass.constructor.apply(this, [room, tile_index, cx, cy]);
    this.hidden_item_index = hidden_item_index;
};

MovableHidingObject.inheritFrom(MovableObject);

MovableHidingObject.prototype.on_move = function (nx, ny) { 
    if (!this.moved && this.hidden_item_index)
        new PickableObject(this.room, this.hidden_item_index, this.cx, this.cy).enterRoom().bringToFront();
    MovableHidingObject.superclass.on_move.apply(this, [nx,ny]); 
};

/* ===================================================================================== */
/* ActiveObject --- player can interact with it by
        - bumping against it,
        - giving it items,
        - hitting it with a projectile.
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
    if (on_hit) this.on_hit = on_hit;
};

ActiveObject.inheritFrom(StaticObject);

/* when player bumps into this object */
ActiveObject.prototype.on_bump = function () {
    /* default behaviour is to do nothing */
};

/* when player tries to "give" an item to this object.
   return value: if true, item is removed from player's inventory.
                 if false, it stays there.
*/
ActiveObject.prototype.on_item = function (item_index) {
    /* default behaviour is to do nothing */
    return false;
};

/* when a projectile hits this object */
ActiveObject.prototype.on_hit = function (damage) {
    /* default behaviour is to do nothing */
};

/* ===================================================================================== */
/* CharacterObject: when bumped, speaks; when given a certain item, gives another to the 
 * player.                                                                               *
 *  @param int char_index: an item_index in MAIN_ITEMS array 
 *  @param Object behaviour: {
        unsolved_text:  text which is displayed on bump when state == 'UNSOLVED',        
        desired_item:   item index of item which, when given to NPC, changes its state to 'SOLVED',
        notneeded_text: displayed when player gives NPC a non-desired item,
        thankyou_text:  text which is displayed when player gives desired_item to NPC,
        payment_item:   item index of item which is given in return for desired_item,
        solved_text:    text which is displayed on bump when state == 'SOLVED',
        on_solve:       function that is executed after giving payment_item.
    }
    In all text strings, '%1' is replaced with desired_item name, and '%2' is replaced
    with payment_item name.
 */
 var CharacterObject = function (room, char_index, cx, cy, behaviour) {     
    CharacterObject.superclass.constructor.apply(this, [room, char_index, cx, cy]);
    this.behaviour = behaviour;
    this.state = 'UNSOLVED';
 };
 
 CharacterObject.inheritFrom(ActiveObject);
 
 CharacterObject.prototype.subst_names = function (str) {
    return str.replace(/%1/g, MAIN_ITEMS[this.behaviour.desired_item].name).
               replace(/%2/g, (this.behaviour.payment_item ? MAIN_ITEMS[this.behaviour.payment_item].name : ""));
 };
 
 CharacterObject.prototype.on_bump = function () {
    if (this.state == 'UNSOLVED') {
        Game.show_speech(this, this.subst_names(this.behaviour.unsolved_text));
    } else {
        Game.show_speech(this, this.subst_names(this.behaviour.solved_text));
    }
 };
 
 CharacterObject.prototype.on_item = function (item_index) {
    if (item_index != this.behaviour.desired_item) {
        if (this.behaviour.notneeded_text)
            Game.show_speech(this, this.behaviour.notneeded_text);
        return false;
    } else if (this.state == 'UNSOLVED') {
        this.state = 'SOLVED';
        Game.show_speech(this, this.subst_names(this.behaviour.thankyou_text), function () {
            if (this.behaviour.payment_item) {
                var obj = new PickableObject(this.room, this.behaviour.payment_item, this.cx, this.cy);
                obj.enterRoom().bringToFront();
                obj.on_bump();
            }
            if (this.behaviour.on_solve) this.on_solve();
        }.bind(this));
        return true;
    }
 };

/* ===================================================================================== */
/* ContainerObject --- when bumped for the 1st time, releases a contained item           */ 
/* @param Object container_set - one of CONTAINER_SETS (see 'tiles.js') */
var ContainerObject = function (room, container_set, cx, cy, stored_item_index) {
    this.stored_item_index = stored_item_index;
    this.container_set = container_set;
    ContainerObject.superclass.constructor.apply(this, [room, -container_set.closed, cx, cy]);
    this.opened = false;
};

ContainerObject.inheritFrom(ActiveObject);

ContainerObject.prototype.on_bump = function () {
    if (!this.opened) {
        this.opened = true;
        this.updateTile(this.container_set.open);
        if (this.stored_item_index) {
            var obj = new PickableObject(this.room, this.stored_item_index, this.cx, this.cy);
            obj.enterRoom().bringToFront();
            obj.on_bump();
            this.on_bump = null; /* will now be treated as a static obstacle */
        }
    }
};

/* ===================================================================================== */
/* PickableObject --- an object, which, when bumped, invokes pickup mode, 
   in which the player  has to push 'space' to pick the object up.
 */
var PickableObject = function (room, item_index, cx, cy) {
    PickableObject.superclass.constructor.apply(this, [room, item_index, cx, cy]);
    
    this.blink_tiles = [EMPTY_TILE, this.tile_index];
    this.blinkdelay = 0;
};

PickableObject.inheritFrom(ActiveObject);

/* called when player presses space to take the item */
PickableObject.prototype.on_pickup = function () {
    /* default - do nothing */
};

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
            this.on_pickup();
            Game.player.finish_pickup();
        }
    } 
};

/* ===================================================================================== */
/* WanderingMonster wanders randomly in the room, biting the player on contact 
*/
var WanderingMonster = function (room, monster_set, cx, cy, walk_delay, hp, hit, loot) {
    this.monster_set = monster_set;
    this.direction = 'down';
    WanderingMonster.superclass.constructor.apply(this, [room, -monster_set.down, cx, cy]);
    this.walk_delay = walk_delay;
    this.walk_timer = walk_delay;
    this.hp = hp;
    this.max_hp = hp;
    this.hit = hit;
    this.loot = loot;
};

WanderingMonster.inheritFrom(ActiveObject);

WanderingMonster.prototype.on_bump = function () {
    Game.player.on_hit(this.hit);
};

WanderingMonster.prototype.on_hit = function (damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
        if (this.loot)
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
                this.updateTile(this.monster_set[this.direction]);
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
                var anim = jstile.Sprite.animationFactory(
                    ANIMATIONS["explosion"],
                    victim.left, victim.top, 1000, true);
                this.parent.addChild(anim);
                if (victim.obj && victim.obj.on_hit) victim.obj.on_hit(damage);
                this.remove();
                return;
            }
        };
        var sprite = jstile.Sprite.tileFactory(PROJECTILES[name + '_' + direction], 
            shooter.sprite.left, shooter.sprite.top, 1000,
            on_frame);
        Game.layer1.addChild(sprite);
    }
};