var WORLDSIDE = 10;
var QUESTNODE_COUNT = 11; /* number of nodes in a quest tree */
var TRADER_COUNT = 2;

var shuffle = function (arr) {
     for (var rc = 0; rc < arr.length-1; rc++) {
        var i = rc + Math.floor(Math.random() * (arr.length-rc));
        var tmp = arr[i];
        arr[i] = arr[rc];
        arr[rc] = tmp;
     }
     return arr;
};

var pickRandomKey = function (obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
};

/* World: a set of Rooms along with quest tree */
var World = function (seed) {
    this.cells = []; /* 2d-array of pointers to Rooms */
    for (var j = 0; j < WORLDSIDE; j++) {
        var row = [];
        for (var i = 0; i < WORLDSIDE; i++) 
            row.push(null);
        this.cells.push(row);
    }
    
    /* let's make a quest tree */
    /* first, build a list of all cells in 9x9 world grid: */
    var coordset = [];
    for (var j = 0; j < WORLDSIDE; j++) {
        for (var i = 0; i < WORLDSIDE; i++) 
            coordset.push({x: i, y: j});
    }
    /* shuffle it in-place */
    shuffle(coordset);
    /* ensure that first item is the central tile */
    var CENTER = Math.floor(WORLDSIDE/2);
    for (var i = 0; i < coordset.length; i++) {
        if (coordset[i].x == CENTER && coordset[i].y == CENTER) {
            var tmp = coordset[0];
            coordset[0] = coordset[i];
            coordset[i] = tmp;
            break;
        }
    }
    
    var questheap = coordset.slice(0, QUESTNODE_COUNT+1); 
    coordset = coordset.slice(QUESTNODE_COUNT+1);
    /* questheap[1,..] is now a heap, i.e. a binary tree represented in array. */
    /* prime quest-giver (yoda) will reside at questheap[0].  */
    
    var leafs = [];
    for (var i = 1; i < questheap.length; i++) {
        var left_child_id = 2*i;
        if (!questheap[left_child_id])
            leafs.push(i);
    }
    /* leafs array now contains indices of all leaf nodes */
    /* let's scan all non-leaf nodes... */
    for (var i = leafs[0]-1; i > 0; i--) {
        var left_child_id = 2*i;
        var right_child_id = left_child_id+1;
        if (left_child_id >= leafs[0] && questheap[right_child_id]) {
            /* this node has two childs and they are both leafs */
            /*if (Math.random() < 0.333) {
                questheap[right_child_id] = undefined;
            }*/
        }
    }
    
    /* Choose quest items. */
    /* all quests will use items from this array: */
    this.quest_items = QUEST_ITEMS.slice(0);
    shuffle(this.quest_items);
    var unused_items = this.quest_items.slice(QUESTNODE_COUNT+1);
    this.quest_items = this.quest_items.slice(0, QUESTNODE_COUNT+1); 
    /* questheap[i] will GIVE player quest_items[i] after quest completion,
       but quest_items[0] is the item that prime quest giver (yoda) desires.
    */
    this.quest_items[0] = this.quest_items[1];
    
    /* Some quests will require an item that should be purchased in a shop.
       They will append appropriate item index to this list.
    */
    this.trade_repo = [];
    
    /* Choose persons */
    this.quest_persons = QUEST_PERSONS.slice(0);
    shuffle(this.quest_persons);
    var unused_persons = this.quest_persons.slice(QUESTNODE_COUNT+1);
    this.quest_persons = this.quest_persons.slice(0, QUESTNODE_COUNT+1);
    /* questheap[i] will be represented by quest_persons[i] */
    
    /* Now let's build actual quests. */
    /* what each make*(heap, id, unused_coords) function will do:
     *  -- create a Room at coords heap[id],
     *  -- a Character in Room (this.quest_persons[id])
     *     -- who wants an item this.quest_items[id],
     *  -- assign this.cells[x][y] a reference to Room,
     *  -- possibly create another neighboring Room (from unused_coords)
     *     and fill it with monsters or items in chests or whatever         
    */
    
    /* Leaf quests */
    /* first of them will require an item that we will get from Yoda */
    this.starter_item = null; /*  */
    for (var i = 0; i < leafs.length; i++) {
        if (!questheap[leafs[i]]) continue;
        var item = unused_items.shift(); /* the quest will require to bring this item, or no item at all */
        if (!this.starter_item)
            this.starter_item = item;
        this.makeLeafQuest(questheap, leafs[i], item, coordset);
    }
    
    /* intermediary quests */
    for (var i = leafs[0]-1; i > 0; i--) {
        var left_child_id = 2*i;
        var right_child_id = left_child_id+1;
        /* either of children may be missing */
        if (questheap[left_child_id] && questheap[right_child_id])
            this.makeBinaryIntermQuest(questheap, i, coordset);
        else
            this.makeSingleIntermQuest(questheap, i, coordset);
    }
    /* prime quest: will require quest_items[0] and give this.starter_item in advance */
    this.makePrimeQuest(questheap, coordset);
    this.start_pos = questheap[0];
    
    /* place several traders... */
    shuffle(this.trade_repo);
    for (var i = 0; i < TRADER_COUNT; i++) {
        var coord = coordset.shift();
        if (i == 0) {
            /* place first trader in a cell adjacent to the start position */
            var possible_deltas = [{dx:-1,dy:0}, {dx:1,dy:0}, {dx:0,dy:1}, {dx:0,dy:-1}];
            shuffle(possible_deltas);
            var d = possible_deltas[0];
            coord = {x: this.start_pos.x + d.dx, y: this.start_pos.y + d.dy};
        }
        var inventory = BASE_TRADE.slice(0);
        for (var ii = 0; ii < this.trade_repo.length; ii++)
            inventory.push(this.trade_repo[ii]);
        for (var ii = 0; ii < 2; ii++) 
            inventory.push(unused_items.shift());
        
        this.makeTrader(coord, inventory, unused_persons.shift());
    }
    
    /* now we need to connect all locations together. */
    /* we use wilderness rooms to do it.              */
    
    shuffle(WILD_ZONES); /* makeWilderness() pops zone indices from this array */
    
    var unconnected = [];
    for (var j = 0; j < WORLDSIDE; j++)
        for (var i = 0; i < WORLDSIDE; i++) 
            if (this.cells[i][j])
                unconnected.push({x: i, y: j, room: this.cells[i][j]});
    
    
    /* connected component grows around start position */
    
    /* this function makes path from point a {x,y}, to point b */
    var connect = function (a, b) {
        var dx = (b.x == a.x) ? 0: Math.round((b.x - a.x) / Math.abs(b.x - a.x));
        var dy = (b.y == a.y) ? 0: Math.round((b.y - a.y) / Math.abs(b.y - a.y));
        var x = a.x; 
        var y = a.y;
        for (; y != b.y; y += dy)
            if (!this.cells[x][y])
                this.makeWilderness(x,y);
        for (; x != b.x; x += dx)
            if (!this.cells[x][y])
                this.makeWilderness(x,y);
    }.bind(this);
    
    var connected = [{x: this.start_pos.x, y: this.start_pos.y, room: this.cells[this.start_pos.x][this.start_pos.y]}];
    while (unconnected.length > 0) {    
        var r = unconnected.shift();
        var closest = connected[0];
        var closest_dist = WORLDSIDE * WORLDSIDE;
        /* find nearest from central connected component */
        for (var i = 0; i < connected.length; i++) {
            /* Manhattan distance */
            var dist = Math.abs(connected[i].x-r.x) + Math.abs(connected[i].y-r.y);
            if (dist < closest_dist) {
                closest = connected[i];
                closest_dist = dist;
            }
        }
        /* connect r and closest by placing wilderness tiles on the path */
        connect(r, closest);
        connected.push(r);
    }
    
    /* we now have a minimal spanning tree, but for better accessibility
       let's connect all quest cells to start point directly */
    for (var i = 1; i < questheap.length; i++) {
        var p = questheap[i];
        if (!p) continue;
        connect(p, this.start_pos);
    }
    
};

/* places the room at specified position */
World.prototype.setRoom = function(coords, room) {
    this.cells[coords.x][coords.y] = room;
};

/* makes a non-quest cell filled with random monsters */
World.prototype.makeWilderness = function (x,y) {
    var room = new WildRoom(WILD_ZONES.pop());
    this.setRoom({x: x, y: y}, room);
    
    this.populateWithMonsters(room);
};

/* Spawns some random monsters in the room.
   Returns name of the monster set.
*/
World.prototype.populateWithMonsters = function (room) {
    /* first, determine empty cells where monsters can be placed */
    var empty_cells = room.get_empty_cells();
    shuffle(empty_cells);
    
    var monster_set = pickRandomKey(MONSTER_SETS);
    var MonsterClass = SHOOTING_MONSTERS[monster_set] ? ShootingMonster : WanderingMonster;
    
    var count = 4 + Math.round(Math.random() * 6);
    for (var i = 0; i < count && empty_cells.length > 1; i++) {
        var cell = empty_cells.pop();
        new MonsterClass(room, MONSTER_SETS[monster_set], cell.x,cell.y, 10, 1, 1, random_loot(0.33));
    }
    
    return monster_set;
};

World.prototype.makeLeafQuest = function (heap, id, item, unused_coords) {
    /* leaf quest can be a non-person, e.g. "find something useful here"
     * or it can be a person giving something for free.
     * special case: a person who wants `item` (if item == this.starter_item);
     *               this item is given by Yoda at the beginning.
    */
    console.warn("I'm", MAIN_ITEMS[this.quest_persons[id]].name, "(leaf)",
                 "at", heap[id].x, heap[id].y, 
                 "and I will give", MAIN_ITEMS[this.quest_items[id]].name,
                 "in exchange for", MAIN_ITEMS[item].name);
    
    var room = new SimpleRoom();
    room.quest = new Quest("puzzle", "Find something useful");
    this.setRoom(heap[id], room);
    
    var quest_type = Math.floor(Math.random() * 4);
    if (item == this.starter_item) quest_type = -1; 
    switch (quest_type) {
        case -1: /* requires starter item */
            room.quest.description = "Requires " + MAIN_ITEMS[item].name;
            var person = new CharacterObject(room, this.quest_persons[id], 
                Math.round(room.width/2), Math.round(room.height/2), {
                    unsolved_text:  "Bring me %1! I will reward you with %2.",        
                    desired_items:   this.starter_item,
                    notneeded_text: "No, thanks.",
                    thankyou_text:  "Great! Here's your %2.",
                    payment_item:   this.quest_items[id],
                    solved_text:    "Have a nice day!",
            });
            break;
            
        case 0: /* person needs item which can be bought from traders */
            room.quest.description = "Requires " + MAIN_ITEMS[item].name;
            this.trade_repo.push(item);
            var person = new CharacterObject(room, this.quest_persons[id], 
                Math.round(room.width/2), Math.round(room.height/2), {
                    unsolved_text:  "Could you get me %1? I heard junk traders sell them. I'll give you %2 in exchange.",        
                    desired_items:   item,
                    notneeded_text: "No, thanks.",
                    thankyou_text:  "Great! Here's your %2.",
                    payment_item:   this.quest_items[id],
                    solved_text:    "Have a nice day!",
            });
            break;
            
        case 1: /* item in a chest */
            var chest = new ContainerObject(room, CONTAINER_SETS["sandchest"], 
                Math.round(room.width/2), Math.round(room.height/2), this.quest_items[id]);
            chest.on_open = function () {
                room.quest.solved = true;
            };
            /* some monsters to guard it */
            this.populateWithMonsters(room);
            break;
            
        case 2: /* kill some monsters, bring a proof */
            var monster_set = this.populateWithMonsters(room);
            var person = new CharacterObject(room, this.quest_persons[id], 
                Math.round(room.width/2), Math.round(room.height/2), {
                    unsolved_text:  "These " + monster_set + "s are horrible! They took my %1!! " +
                                    "Please, kill them and get my %1 back.",        
                    desired_items:   item,
                    notneeded_text: "No, thanks.",
                    thankyou_text:  "Thank you, oh thank you! I hope this %2 will suffice as the payment.",
                    payment_item:   this.quest_items[id],
                    solved_text:    "Have a nice day!",
            });
            
            /* only one monster will have the desired item */
            var empty_cells = room.get_empty_cells();
            shuffle(empty_cells);
            var cell = empty_cells.pop();
            
            var MonsterClass = SHOOTING_MONSTERS[monster_set] ? ShootingMonster : WanderingMonster;
            new MonsterClass(room, MONSTER_SETS[monster_set], cell.x,cell.y, 10, 1, 1, item);
            
            break;
            
        case 3: /* charity */
            var person = new CharacterObject(room, this.quest_persons[id], 
                Math.round(room.width/2), Math.round(room.height/2), {
                    desired_items:   [],
                    payment_item:   this.quest_items[id],
                    solved_text:    "Have a nice day!",
            });
            person.on_bump = function () {
                if (this.state == 'UNSOLVED') {
                    Game.show_speech(this, "Wandering in the desert is dangerous! Here, take this.", function () {
                        var obj = new PickableObject(this.room, this.behaviour.payment_item, this.cx, this.cy);
                        obj.enterRoom().bringToFront();
                        obj.on_bump();
                        this.state = 'SOLVED';
                        this.room.quest.solved = true;
                    }.bind(this));
                } else {
                    Game.show_speech(this, this.subst_names(this.behaviour.solved_text));
                }
            };
            break;
    }
};

/* This quest requires player to bring two items in exchange of one. */
World.prototype.makeBinaryIntermQuest = function (heap, id, unused_coords) {
    /* has both children */
    var left_child_id = 2*id;
    var right_child_id = left_child_id+1;
    console.warn("I'm", MAIN_ITEMS[this.quest_persons[id]].name,
                 "at", heap[id].x, heap[id].y, 
                 "and I will give", MAIN_ITEMS[this.quest_items[id]].name,
                 "in exchange for", MAIN_ITEMS[this.quest_items[left_child_id]].name,
                 "and", MAIN_ITEMS[this.quest_items[right_child_id]].name
                 );
                 
    var room = new SimpleRoom();
    room.quest = new Quest("puzzle", "requires two items");
    this.setRoom(heap[id], room);
    
    var person = new CharacterObject(room, this.quest_persons[id], 
        Math.round(room.width/2), Math.round(room.height/2), {
            unsolved_text:  "Bring me %1. I will pay you with %2.",        
            bringmore_text: "Okay. Bring %1, and we will close the deal.",
            desired_items:   [this.quest_items[left_child_id], this.quest_items[right_child_id]],
            notneeded_text: "No, thanks.",
            thankyou_text:  "Great. Here's your %2. Pleasure doing business with you.",
            payment_item:   this.quest_items[id],
            solved_text:    "Have a nice day!",
    });
    room.quest.description = person.subst_names("Requires %1");
};

/* Simple quest: player is required to bring item A to get item B as a reward */
World.prototype.makeSingleIntermQuest = function (heap, id, unused_coords) {
    /* only one child, left or right */
    var left_child_id = 2*id;
    var right_child_id = left_child_id+1;
    var child = (heap[left_child_id]) ? left_child_id : right_child_id;
    console.warn("I'm", MAIN_ITEMS[this.quest_persons[id]].name,
                 "at", heap[id].x, heap[id].y, 
                 "and I will give", MAIN_ITEMS[this.quest_items[id]].name,
                 "in exchange for", MAIN_ITEMS[this.quest_items[child]].name);
    var room = new SimpleRoom();
    room.quest = new Quest("puzzle", "requires " + MAIN_ITEMS[this.quest_items[child]].name, true);
    this.setRoom(heap[id], room);
    
    var person = new CharacterObject(room, this.quest_persons[id], 
        Math.round(room.width/2), Math.round(room.height/2), {
            unsolved_text:  "I really need %1. Can you get it for me? I can give you %d in exchange.",        
            desired_items:   this.quest_items[child],
            notneeded_text: "No, thanks.",
            thankyou_text:  "Just what I needed. Here's your %2. Pleasure doing business with you.",
            payment_item:   this.quest_items[id],
            solved_text:    "Have a nice day!",
    });
    room.quest.description = person.subst_names("Requires %1");
};

World.prototype.makePrimeQuest = function (heap, unused_coords) {
    var id = 0;
    console.warn("I'm Master", MAIN_ITEMS[this.quest_persons[id]].name,
                 "at", heap[id].x, heap[id].y, 
                 ", I will give you", MAIN_ITEMS[this.starter_item].name,
                 "and will expect", MAIN_ITEMS[this.quest_items[id]].name, "in return.");
    
    var room = new SimpleRoom();
    room.quest = new Quest("home", "Start");
    room.entry_point = {x:7,y:7};
    
    var person = new CharacterObject(room, this.quest_persons[id], 7,6, {
        unsolved_text:  "Bring me %1, Luke!",        
        desired_items:   this.quest_items[id],
        notneeded_text: "No, thanks.",
        thankyou_text:  "At last! Your quest is complete now.",
        payment_item:   null,
        solved_text:    "Have a nice day!",
        on_solve: function () { Game.explain("You won! Game over."); }
    });
    
    room.quest.npc = person;
    
    this.makeTutorial(room);
    
    this.setRoom(heap[id], room);
};

/* Places a trader in the room */
World.prototype.makeTrader = function (coord, inventory, person) {
    var room = new SimpleRoom();
    room.quest = new Quest("", "Junk trader", true);
    this.setRoom(coord, room);
    
    var person = new CharacterObject(room, person, 
        Math.round(room.width/2), Math.round(room.height/2), {
            unsolved_text:  "I'm a junk trader! Bring me junk, weapons or credits, and I'll give you something in exchange.",        
            desired_items:   BARTERABLE.slice(0),
            notneeded_text: "No, thanks. Bring me junk, weapons or credits.",
            bringmore_text: null,
            thankyou_text:  "<none>",
            payment_item:   null,
            solved_text:    "<none>",
            
    });
    person.behaviour.on_bringmore = function (given_item_index) {
        /* restore desired item set */
        this.behaviour.desired_items = BARTERABLE.slice(0);
        this.state = 'UNSOLVED';
        var store_text = "Tradeable. Now select something from my store of goods:\n";
        for (var i = 0; i < inventory.length; i++) {
            store_text += "[" + i + "] " + MAIN_ITEMS[inventory[i]].name + "\n"
        }
        store_text += "(input a number 0.." + (inventory.length-1) + " and press Enter)";
        
        Game.startOverlayer();
        var chosen = prompt(store_text, "0");
        Game.stopOverlayer();
        var item_to_give;
        if (chosen === null) {
            /* player cancelled the transaction */
            item_to_give = given_item_index;
        } else {
            chosen = Math.floor(Number(chosen.trim()));
            if (isNaN(chosen) || chosen < 0 || chosen >= inventory.length) {
                /* wrong input */
                Game.explain("There is no such item in the store.")
                item_to_give = given_item_index;
            } else {
                item_to_give = inventory[chosen];
            }
        }
        var obj = new PickableObject(this.room, item_to_give, this.cx, this.cy);
        obj.enterRoom().bringToFront();
        obj.on_bump();
        
    }.bind(person);
};

/* Moves the player to the starting room and plays intro sequence */
World.prototype.startGame = function () {
    var r = this.cells[this.start_pos.x][this.start_pos.y];
    Game.player.teleport_to_room(r, this.start_pos.x, this.start_pos.y);
    Game.player.set_direction('up');
    
    var world = this;
    setTimeout( function () {
        Game.show_speech(r.quest.npc, 
            "Bring me " + MAIN_ITEMS[world.quest_items[0]].name + ", Luke! " + 
            "Take this, I hope it will help you in your quest.",
            function () {
                var obj = new PickableObject(this.room, world.starter_item, this.cx, this.cy);
                obj.enterRoom().bringToFront();
                obj.on_bump();
            }.bind(r.quest.npc)
        )
    }, 500);
    
};

/*==========================================================================*/
/* Quest objects - an annotation for Room                                   */
var Quest = function (kind, description, is_trader) {
    this.kind = kind;
    this.description = description; /* for map */
    this.npc = null;
    this.solved = false;
    this.is_trader = !!is_trader;
};



/*==========================================================================*/
/* LocatorScreen: displays a world map in overlayer mode.                   */
/* Creating a new instance will immediately display the map.                */
var LocatorScreen = function () {
    Game.startOverlayer();
    
    this.grid = new jstile.Grid(WORLDSIDE+1, WORLDSIDE+1, 28, 28, jstile.ORTHOGONAL);
    this.key_delay = 5;
    var on_frame = function () {
        /* TODO */
        if (this.key_delay <= 0) {
            if (jstile.keytracker[32 /* SPACE */] 
                || jstile.keytracker[76 /* L */]
                || jstile.keytracker[77 /* M */]
                ) {
                this.destroy();
            }
        } else {
            this.key_delay--;
        }
    }.bind(this);
    this.sprite = jstile.Sprite.tileFactory(EMPTY_TILE, 0, 0, 1, on_frame);
    
    this.cells = [];
    for (var j = 0; j < WORLDSIDE; j++) {
        for (var i = 0; i < WORLDSIDE; i++) {
            var room = Game.world.cells[i][j];
            var offset = this.grid.offsets[i][j];
            var mkcell = function (tilename) {
                return jstile.Sprite.tileFactory(LOCATOR_TILES[tilename], offset.left, offset.top, 1);
            };
            var cell;
            if (!room) {
                cell = mkcell("nothing");
            } else {
                /* TODO */
                if (i == Game.world.start_pos.x && j == Game.world.start_pos.y)
                    cell = mkcell("home");
                else if (!room.visited) 
                    cell = mkcell("unvisited");
                else if (room.quest && room.quest.is_trader)
                    cell = mkcell("trader");
                else if (room.quest && room.quest.kind)
                    cell = mkcell((room.quest.solved ? "solved" : "") + room.quest.kind);
                else
                    cell = mkcell("wilderness");
            }
            this.cells.push(cell);
        }
    }
    
    onMouseMove = function (evt) {
        var i = Math.floor((evt.pageX - this.offsetLeft) / 28);
        var j = Math.floor((evt.pageY - this.offsetTop) / 28);
        if (i < 0 || j < 0 || i >= WORLDSIDE || j >= WORLDSIDE) 
            return;
        var room = Game.world.cells[i][j];
        var hint = "";
        if (room) {
            if (i == Game.world.start_pos.x && j == Game.world.start_pos.y)
                hint = "Starting location";
            else if (!room.visited) 
                hint = "Unvisited";
            else if (room.quest && room.quest.is_trader) {
                hint = "Trading post";
            }
            else if (room.quest && room.quest.kind) {
                hint = room.quest.description;
                if (room.quest.solved) 
                    hint += " (solved!)";
            }
            else
                hint = "Wilderness";
        };
        Game.explain(hint);
    };
    
    $('#overlayer').mousemove(onMouseMove);
    
    this.destroy = function () {
        $('#overlayer').mousemove(function () {});
        this.sprite.remove();
        Game.player.move_delay = 3; /* key is still pressed, prevent immediate return to this screen */
        Game.stopOverlayer();
    };
    
    this.sprite.addChild(this.cells);
    
    var offset = this.grid.offsets[Game.player.roomx][Game.player.roomy];
    var anim = jstile.Sprite.animationFactory(
                    ANIMATIONS["iamhere"],
                    offset.left, offset.top-1, 1000, false);
    this.sprite.addChild(anim);
    
    Game.overlayer.addSprite(this.sprite);
    
}

/* =========================================================================== */
/* Create a couple of tutorial rooms and link parentroom to them */
World.prototype.makeTutorial = function (parentroom) {
    var room = new SimpleRoom(18,18);
    room.is_interior = true;
    room.entry_point = {x:5,y:2};
    new StaticObject(room,     252, 2,3);
    new MovableObject(room,     7, 2,4);
    new ContainerObject(room, CONTAINER_SETS["sandchest"], 4,4, THINGS['Navicomputer']);
    /*new PickableObject(room,   THINGS['Red Key Card'], 7,5);*/
    
    /*new ShootingMonster(room, MONSTER_SETS['Scouttrooper'], 8,8, 10, 1, 1, random_loot());
    new WanderingMonster(room, MONSTER_SETS['Tusken'], 1,4, 10, 1, 1, random_loot());
    new WanderingMonster(room, MONSTER_SETS['Jawa'], 8,3, 10, 1, 1, random_loot());
    new WanderingMonster(room, MONSTER_SETS['Jawa'], 10,6, 10, 1, 1, random_loot());
    new WanderingMonster(room, MONSTER_SETS['Jawa'], 5,14, 10, 1, 1, random_loot());*/
    
    
    /* rock with a door */
    new StaticObject(parentroom, 57, 8,7);
    new StaticObject(parentroom, 54, 9,7);
    new StaticObject(parentroom, 54, 10,7);
    new StaticObject(parentroom, 54, 11,7);
    new StaticObject(parentroom, 59, 12,7);
    new StaticObject(parentroom, 67, 8,8);
    new StaticObject(parentroom, 53, 9,8);
    new DoorObject(parentroom, DOOR_SETS["rockbeeline"], 10,8, room, undefined, {x:3,y:3});
    new StaticObject(parentroom, 53, 11,8);
    new StaticObject(parentroom, 69, 12,8);
    
    new DoorObject(room, DOOR_SETS["rockbeeline"], 3,4, parentroom, undefined, {x:10,y:9});
    
    /* wall with a door */
    new StaticObject(room, 240, 11,0);
    new StaticObject(room, 240, 11,1);
    new StaticObject(room, 240, 11,2);
    new StaticObject(room, 240, 11,3);
    new StaticObject(room, 240, 11,4);
    new StaticObject(room, 247, 11,5);
    new StaticObject(room, 236, 12,5);
    new DoorObject(room, DOOR_SETS["archwalldoor"], 13,5, null, THINGS["Red Key Card"]);
    new StaticObject(room, 236, 14,5);
    new StaticObject(room, 236, 15,5);
    new StaticObject(room, 236, 16,5);
    new StaticObject(room, 236, 17,5);
    
    new MovableHidingObject(room,     7, 15,3, THINGS['10,000 Credits']);
    
    new CharacterObject(room, PEOPLE['Fibbs'], 14,6, {
        unsolved_text:  "I'm supposed to guard this door, but Jawas attacked me and took my %1!" + 
                        " Can you get it for me? Please? \n They also took the key card for this door :(",        
        desired_items:   THINGS['Blaster Rifle'],
        notneeded_text: "No, thanks.",
        thankyou_text:  "Great! Here's something for your trouble.",
        payment_item:   THINGS['Pile of Credits'],
        solved_text:    "Have a nice day!",
        on_solve:       null
    });
    
    new WanderingMonster(room, MONSTER_SETS['Jawa'], 14,8, 10, 1, 1, THINGS['Blaster Rifle']);
    new WanderingMonster(room, MONSTER_SETS['Jawa'], 15,7, 10, 1, 1, THINGS["Red Key Card"]);
    new WanderingMonster(room, MONSTER_SETS['Jawa'], 16,6, 10, 1, 1, random_loot());
    
    
};