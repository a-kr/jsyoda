
/*
    Player, its representation and movement 
*/
var Player = function () {
    
    /* <IGameObject dynamic interface> */
    this.cx = 0;
    this.cy = 0;
    this.obstacle = true;
    this.sprite = null;
    /* </IGameObject> */
    this.direction = 'down';
    this.prev_direction = 'down';
    
    this.roomx = 0;
    this.roomy = 0;
    
    this.inventory = [];
    
    this.teleport_to_room = function (room, rx, ry) {
        if (rx !== undefined) {
            this.roomx = rx; this.roomy = ry;
        }
        room.enter();
        this.go_absolute(room.entry_point.x, room.entry_point.y);
    };
    
    /* enter another room by crossing the border
        @param bool only_try: if true, do not actually cross the border, only test
                              the possibility.
    */
    this.walk_to_room = function (drx, dry, only_test) {
        var nrx = this.roomx + drx;
        var nry = this.roomy + dry;
        var room = (Game.world.cells[nrx] || [])[nry];
        if (!room) return false;
        var nx = ((this.cx + drx) >= 0 ? (this.cx + drx) : (this.cx + drx + room.width)) % room.width;
        var ny = ((this.cy + dry) >= 0 ? (this.cy + dry) : (this.cy + dry + room.height)) % room.height;
        var obs = room.get_obstacles(nx, ny);
        if (obs)
            return false;
        if (only_test)
            return true;
        this.roomx = nrx; this.roomy = nry;
        /* enter room with animation */
        room.enter(function () {
            this.go_absolute(nx,ny);
        }.bind(this), drx, dry);
    };
    
    /* call this in response to keyboard events */
    this.go = function (dx, dy, with_shift) {
        var nx = this.cx + dx;
        var ny = this.cy + dy;
        var new_dir;
        if (dx < 0) new_dir = 'left';
        else if (dx > 0) new_dir = 'right';
        else if (dy < 0) new_dir = 'up';
        else if (dy > 0) new_dir = 'down';
        this.set_direction(new_dir);
        if (with_shift)
            this.push_pull(dx, dy);
        else
            this.go_absolute(nx,ny);
    };
    
    /* call this to turn the hero in a specific direction */
    this.set_direction = function (new_dir) {
        this.prev_direction = this.direction;
        if (this.direction == new_dir)
            return;
        this.sprite.setTile(PLAYER_IMGS[new_dir]);
        this.direction = new_dir;
    };
    
    /* checks whether it is possible to move to specified coords. 
       return value: 1 if these coords are free;
                     obj if they are occupied by an ActiveObject descendant, and a bump action will be performed;
                     2 if they are occupied by a StaticObject (cannot step around)
                     3 if they are occupied by a StaticObject (may try to step around);
                     4 coords lie outside the room.
    */
    this.try_goto = function (nx, ny) {
        if (nx < 0 || nx >= Game.grid.width || ny < 0 || ny >= Game.grid.height)
            return 4;
        /* check collisions with objects */
        var obstacle = Game.currentroom.get_obstacles(nx, ny);
        if (obstacle)   {
            if (obstacle.on_bump)
                return obstacle;
            /* sidestep only if you were already looking that way */
            if (this.direction == this.prev_direction)
                return 3;
            else
                return 2;
        }
        return 1;
    };
    
    this.go_absolute = function (nx, ny) {
        var d = SIDESTEPS[this.direction];
        var variants = [{x: nx, y: ny}, {x: nx+d.dx, y: ny+d.dy}, {x: nx-d.dx, y: ny-d.dy}];
        if (Math.random() < 0.5) {
            /* choose sidestepping direction randomly */
            variants =  [{x: nx, y: ny}, {x: nx-d.dx, y: ny-d.dy}, {x: nx+d.dx, y: ny+d.dy}];
        }
        nx = null;
        var p;
        while (variants.length > 0) {
            p = variants.shift();
            var r = this.try_goto(p.x, p.y);
            if (r === 1) {
                /* way is free */
                nx = p.x; ny = p.y;
                break;
            } else if (r === 4) {
                /* out of room bounds: moving to another room */
                this.walk_to_room(p.x-this.cx, p.y-this.cy);
                /* todo: move to another room */
                return;
            } else if (r === 2) {
                /* static object, cannot step around yet */
                return;
            } else if (r === 3) {
                /* may try to step around */
                continue;
            } else {
                /* r is a bumpable obstacle */
                if (variants.length == 2) {
                    /* player intended to bump against it */
                    r.on_bump();
                    return;
                } else {
                    /* it is reachable by a sidestep */
                    continue;
                }
            }
        }
        if (nx == null) return; /* tried thrice, no way found */
        /* move */
        this.cx = nx; this.cy = ny;
        var pos = Game.grid.offsets[nx][ny];
        this.sprite.setPosition(pos.left, pos.top);
        
        /* shift the viewport so that player is always in center, except when
           near the room's edge.
           So, pos.left should be at Math.floor(VIEWPORT_SIDE/2)*32...
        */
        var vx = -pos.left + Math.floor(VIEWPORT_SIDE/2)*32;
        var vy = -pos.top + Math.floor(VIEWPORT_SIDE/2)*32;
        vx = Math.min(vx, 0); vx = Math.max(vx, -(Game.grid.widthPx - VIEWPORT_SIDE*32));
        vy = Math.min(vy, 0); vy = Math.max(vy, -(Game.grid.heightPx - VIEWPORT_SIDE*32));
        Game.positionLayers(vx, vy);
    };
    
    /* perform push or pull */
    this.push_pull = function (dx, dy) {
        var obj_at_front = Game.currentroom.get_obstacles(this.cx+dx, this.cy+dy);
        var obj_at_back = Game.currentroom.get_obstacles(this.cx-dx, this.cy-dy);
        
        if (!obj_at_front && !obj_at_back) return; /* nothing to move */
        
        var obj;
        if (obj_at_front) { /* pushing */
            obj = obj_at_front;
            if (!obj.movable) return;
            var nox = this.cx + dx + dx, noy = this.cy + dy + dy;
            var r = this.try_goto(nox,noy);
            if (r != 1) return; /* that cell must be free */
            obj.on_move(nox, noy);
            this.go_absolute(this.cx+dx, this.cy+dy);
        } else { /* pulling */
            obj = obj_at_back; 
            if (!obj.movable) return;
            var nox = this.cx, noy = this.cy;
            var r = this.try_goto(this.cx+dx, this.cy+dy);
            if (r != 1) return; /* that cell must be free */
            this.go_absolute(this.cx+dx, this.cy+dy);
            obj.on_move(nox, noy);
        }
        
    };
    
    /* Enter pickup mode (all freezes, object blinks) */
    this.pickup = function (obj) {
        /* we must move picked object from main layer and to the overlayer,
           while preserving its on-screen position 
        */
        this.picked_thing = obj;
        this.picked_thing.remove(true) /* from room, but leave sprite */
        var pos = this.picked_thing.sprite._calculatedPosition;
        Game.layer1.removeChild(this.picked_thing.sprite);
        Game.layer1_layer._refresh(true); /* just repaint, do not call sprite's callbacks */
        
        Game.overlayer.addSprite(this.picked_thing.sprite);
        /* overlayer uses absolute, not relative positioning */
        this.picked_thing.sprite.setPosition(pos.left, pos.top);
        Game.startOverlayer();
    };
    /* Leave pickup mode */
    this.finish_pickup = function () {
        this.inventory.push(this.picked_thing);
        this.picked_thing.leaveRoom() /* remove sprite for good */
        this.picked_thing = null;
        /* TODO: display a notification? */
        Game.stopOverlayer();
    };
    
    /* handles collisions with projectiles */
    this.on_hit = function (damage) {
        /* TODO */
    };
    
    /* ============ HANDLING INPUT ===============*/
    /* for stiuations where all controls must be disabled for unknown amount of time 
     * (i.e. animation) */
    this.controls_enabled = true;
    
    this.move_delay = 0; /* number of frames to skip before movement is possible again */
    var key_go_handler = function (dx,dy) {
        return function () {
            if (this.move_delay > 0) return;
            this.go(dx,dy, jstile.keytracker[16]); /* 16 = SHIFT */
            this.move_delay = 3;
        }.bind(this);
    }.bind(this);
    
    /* same thing with delays for shooting */
    this.shoot_delay = 0;
    var shoot_handler = function () {
        if (this.shoot_delay > 0) return;
        var projectile = Projectile.factory("green", this.direction, 16, 2, this);
        this.shoot_delay = 5;
    }.bind(this);
    
    var locator_handler = function () {
        if (this.move_delay > 0) return; /* prevents immed. return to locator */
        /* TODO check if player has a locator */
        new LocatorScreen();
    }.bind(this);
    
    this.main_keymap = {
        65 /* A */: key_go_handler(-1,0),
        68 /* D */: key_go_handler(+1,0),
        87 /* W */: key_go_handler(0,-1),
        83 /* S */: key_go_handler(0,+1),
        37 /* left  */: key_go_handler(-1,0),
        38 /* up    */: key_go_handler(0,-1),
        39 /* right */: key_go_handler(+1,0),
        40 /* down  */: key_go_handler(0,+1),
        75 /* K */ : shoot_handler,
        70 /* F */ : shoot_handler,
        76 /* L */ : locator_handler,
        77 /* M */ : locator_handler,
    };
    this.keymap = this.main_keymap;
    
    /* this is called on every frame, unless overlayer is active */
    this.on_frame = function () {
        if (this.controls_enabled) {
            for (var keycode in this.keymap) {
                if (jstile.keytracker[keycode])
                    this.keymap[keycode]();
            }
        }
        if (this.move_delay > 0) this.move_delay--;
        if (this.shoot_delay  > 0) this.shoot_delay--;
    }.bind(this);
    
    this.sprite = jstile.Sprite.tileFactory(PLAYER_IMGS.down, 0, 0, 255, this.on_frame);
    this.sprite.obj = this;
    Game.layer1.addChild(this.sprite);
    
};