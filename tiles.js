var TILES_PER_ROW = 16;
var TILES_PER_TILESET = TILES_PER_ROW * TILES_PER_ROW;
var TILESET_COUNT = 9;
var TILESETS = {
};

/* given a tile index, return tileset name and x,y coords in the tileset */
var get_tile_coords = function (tile_index) {
    if (tile_index == 65535)
        tile_index = EMPTY_TILE;
    var tile = tile_index % TILES_PER_TILESET;
    return {
        tileset: Math.floor(tile_index / TILES_PER_TILESET) % TILESET_COUNT,
        col: tile % TILES_PER_ROW,
        row: Math.floor(tile / TILES_PER_ROW)
    };
};

var ensure_tileset_loaded = function (tileset_index) {
    var img = TILESETS[tileset_index];
    if (!img) {
        var filename = 'yotiles/sprites00' + tileset_index.toString() + '.png';
        TILESETS[tileset_index] = new jstile.Image(filename, 32, 32, jstile.VERTICAL, TILES_PER_ROW-1, 0);
    }
};

/* Create a new sprite and set it to specific tileset and tile */
jstile.Sprite.tileFactory = function(tile_index, left, top, zindex, onDrawCallback, once, onDone)
{
    var tc = get_tile_coords(tile_index);
    ensure_tileset_loaded(tc.tileset);
    
    if(jstile.Sprite._recyclebin.length) {
        var sprite = jstile.Sprite._recyclebin.shift();
        jstile.Sprite.call(sprite, TILESETS[tc.tileset], left, top, zindex, 0, onDrawCallback, once, onDone);
        sprite.setTile(tile_index);
        return sprite;
    }
    var sprite = new this(TILESETS[tc.tileset], left, top, zindex, 0, onDrawCallback, once, onDone);
    sprite.setTile(tile_index);
    return sprite;
};

/* Create a new animated sprite 
    @param array tile_sequence: list of tile indices
*/
jstile.Sprite.animationFactory = function(tile_sequence, left, top, zindex, once, onDone)
{
    var tile_index = tile_sequence[0];
    var tc = get_tile_coords(tile_index);
    ensure_tileset_loaded(tc.tileset);
    
    var frame_delay = 1;
    var on_frame = function () {
        if (!this.delay) { this.delay = 0; this.frame_no = -1; }
        if (--this.delay <= 0) {
            this.delay = frame_delay;
            this.frame_no++; 
            if (this.frame_no >= tile_sequence.length && once) {
                if (onDone) onDone();
                this.delay = null; /* sprite might be reused */
                this.remove();
            } else {
                this.frame_no = this.frame_no % tile_sequence.length;
                this.setTile(tile_sequence[this.frame_no]);
            }
        }
    };
    
    if(jstile.Sprite._recyclebin.length) {
        var sprite = jstile.Sprite._recyclebin.shift();
        jstile.Sprite.call(sprite, TILESETS[tc.tileset], left, top, zindex, 0, on_frame, once, onDone);
        return sprite;
    }
    var sprite = new this(TILESETS[tc.tileset], left, top, zindex, 0, on_frame, once, onDone);
    return sprite;
};


/*
    @param int tile_index             
    @return jstile.Sprite self
*/
jstile.Sprite.prototype.setTile = function(tile_index) {
    var tc = get_tile_coords(tile_index);
    ensure_tileset_loaded(tc.tileset);
    
    this.image = TILESETS[tc.tileset];
    this.frame = tc.col;
    this.currentframe = tc.row;
    
    this._calculateImageOffset(); 
    return this;
};

/* Draws specified tile on a given <canvas> context */
jstile.Sprite.directDrawTile = function (canvascontext, tile_index, x, y) {
    x = x || 0; y = y || 0;
    var tc = get_tile_coords(tile_index);
    ensure_tileset_loaded(tc.tileset);
    
    var image = TILESETS[tc.tileset];
    canvascontext.drawImage(image.node, tc.col * 32, tc.row * 32, 32, 32, x, y, 32, 32);
};

var MAIN_ITEMS = {
    0: {name: "Lightsaber", tile_index: 18},
    1: {name: "Pile of Junk", tile_index: 174},
    2: {name: "Pile of Junk", tile_index: 175},
    3: {name: "Invis.Blocker", tile_index: 355},
    4: {name: "5,000 Credits", tile_index: 405},
    5: {name: "Pile of Junk", tile_index: 418},
    6: {name: "Locator", tile_index: 421},
    7: {name: "Pile of Junk", tile_index: 425},
    8: {name: "Collapsible Bridge", tile_index: 428},
    9: {name: "10,000 Credits", tile_index: 429},
    10: {name: "Gas Grenade", tile_index: 430},
    11: {name: "Smoke Grenade", tile_index: 431},
    12: {name: "Sonic Cleaver", tile_index: 432},
    13: {name: "Ice Drill", tile_index: 433},
    14: {name: "Droid Detector", tile_index: 434},
    15: {name: "Alluvial Damper", tile_index: 435},
    16: {name: "Vial of Tibanna Gas", tile_index: 436},
    17: {name: "Thermal Cape", tile_index: 437},
    18: {name: "Restraining Bolt", tile_index: 438},
    19: {name: "Power Terminal", tile_index: 439},
    20: {name: "Power Prybar", tile_index: 440},
    21: {name: "Navicomputer", tile_index: 441},
    22: {name: "Pile of Credits", tile_index: 442},
    23: {name: "Bar of Durasteel", tile_index: 443},
    24: {name: "Shield Generator", tile_index: 444},
    25: {name: "Drive Compensator", tile_index: 445},
    26: {name: "Comm Unit", tile_index: 446},
    27: {name: "Anti-Grav Generator", tile_index: 447},
    28: {name: "Lantern of Sacred Light", tile_index: 448},
    29: {name: "Data Card", tile_index: 449},
    30: {name: "Lommite Crystal", tile_index: 450},
    31: {name: "Kaiburr Crystal", tile_index: 451},
    32: {name: "Sample of Ryll", tile_index: 452},
    33: {name: "Sensor Array", tile_index: 453},
    34: {name: "Repulsor", tile_index: 454},
    35: {name: "Hyperspace Compass", tile_index: 455},
    36: {name: "Fusion Welder", tile_index: 456},
    37: {name: "Beamdrill", tile_index: 457},
    38: {name: "Vocabulator", tile_index: 458},
    39: {name: "Adegan Crystal", tile_index: 459},
    40: {name: "Sensor Pack", tile_index: 460},
    41: {name: "Holocron", tile_index: 461},
    42: {name: "Decoder", tile_index: 462},
    43: {name: "Holocube", tile_index: 463},
    44: {name: "Transponder", tile_index: 464},
    45: {name: "Droid Part", tile_index: 465},
    46: {name: "Power Converter", tile_index: 466},
    47: {name: "Motivator", tile_index: 467},
    48: {name: "Energy Cell", tile_index: 468},
    49: {name: "Computer Probe", tile_index: 469},
    50: {name: "Droid Caller", tile_index: 470},
    51: {name: "Crate of Spice", tile_index: 471},
    52: {name: "Blue Key Card", tile_index: 472},
    53: {name: "Red Key Card", tile_index: 473},
    54: {name: "Green Key Card", tile_index: 474},
    55: {name: "Training Remote", tile_index: 475},
    56: {name: "Locomotor", tile_index: 476},
    57: {name: "Electrolockpick", tile_index: 477},
    58: {name: "Glow Rod", tile_index: 478},
    59: {name: "Power Coupling", tile_index: 479},
    60: {name: "Bacta Fluid", tile_index: 480},
    61: {name: "Sample of Carbonite ", tile_index: 481},
    62: {name: "Chakroot", tile_index: 482},
    63: {name: "Blumfruit", tile_index: 483},
    64: {name: "Nav Card", tile_index: 484},
    65: {name: "Homing Beacon", tile_index: 485},
    66: {name: "Drive Guide", tile_index: 486},
    67: {name: "Electroscope", tile_index: 487},
    68: {name: "Rangefinder", tile_index: 488},
    69: {name: "Condenser Unit", tile_index: 489},
    70: {name: "Pair of Binoculars", tile_index: 490},
    71: {name: "Macrofuser", tile_index: 491},
    72: {name: "Hydrospanner", tile_index: 492},
    73: {name: "Imperial Belt", tile_index: 493},
    74: {name: "Generator", tile_index: 494},
    75: {name: "Macroscope", tile_index: 495},
    76: {name: "Utility Belt", tile_index: 496},
    77: {name: "Fusion Furnace", tile_index: 497},
    78: {name: "Telesponder", tile_index: 498},
    79: {name: "Breath Mask", tile_index: 499},
    80: {name: "Holocomm", tile_index: 500},
    81: {name: "Transfer Register", tile_index: 501},
    82: {name: "C-3PO's Head", tile_index: 502},
    83: {name: "Comlink", tile_index: 503},
    84: {name: "Rebel First Aid Kit", tile_index: 505},
    85: {name: "Imperial First Aid Kit", tile_index: 506},
    86: {name: "Q-Rations", tile_index: 507},
    87: {name: "Purple Key Card", tile_index: 508},
    88: {name: "Yellow Key Card", tile_index: 509},
    89: {name: "Lightsaber", tile_index: 510},
    90: {name: "THE FORCE", tile_index: 511},
    91: {name: "Blaster", tile_index: 512},
    92: {name: "Blaster Rifle", tile_index: 513},
    93: {name: "Thermal Detonator", tile_index: 514},
    94: {name: "IM Mine", tile_index: 515},
    95: {name: "Orange Key Card", tile_index: 516},
    96: {name: "Fusion Cutter", tile_index: 518},
    97: {name: "Stasis Mine", tile_index: 523},
    98: {name: "Mine Pin", tile_index: 524},
    99: {name: "Igniter", tile_index: 525},
    100: {name: "Sequencer Charge", tile_index: 526},
    101: {name: "Sequencer Charge", tile_index: 527},
    102: {name: "Yubnut", tile_index: 528},
    103: {name: "End8A", tile_index: 529},
    104: {name: "Transport Generator", tile_index: 532},
    105: {name: "Ore Drill", tile_index: 609},
    106: {name: "Sith Amulet", tile_index: 610},
    107: {name: "Obi Wan Kenobi", tile_index: 779},
    108: {name: "Yoda", tile_index: 780},
    109: {name: "Jawa", tile_index: 784},
    110: {name: "Captain Blob", tile_index: 785},
    111: {name: "Darth Vader", tile_index: 788},
    112: {name: "Emperor's BG", tile_index: 790},
    113: {name: "Obi Wan", tile_index: 791},
    114: {name: "Probot-snow", tile_index: 792},
    115: {name: "Probot-Desert", tile_index: 793},
    116: {name: "R2-D2", tile_index: 794},
    117: {name: "R2-AmNot", tile_index: 795},
    118: {name: "Mine Droid", tile_index: 796},
    119: {name: "2-1B", tile_index: 797},
    120: {name: "Luke Skywalker", tile_index: 799},
    121: {name: "Boba Fett", tile_index: 800},
    122: {name: "Stormtrooper", tile_index: 801},
    123: {name: "Han Solo", tile_index: 809},
    124: {name: "END1A", tile_index: 810},
    125: {name: "END1B", tile_index: 816},
    126: {name: "Gnudo Heap", tile_index: 1052},
    127: {name: "Advorzse", tile_index: 1053},
    128: {name: "Advorzse2", tile_index: 1054},
    129: {name: "Bilbo", tile_index: 1055},
    130: {name: "Nikto", tile_index: 1056},
    131: {name: "Frodo", tile_index: 1057},
    132: {name: "Duros", tile_index: 1058},
    133: {name: "Defel", tile_index: 1061},
    134: {name: "Groucho", tile_index: 1062},
    135: {name: "Abyssin", tile_index: 1063},
    136: {name: "Nien Nunb", tile_index: 1064},
    137: {name: "Brainee", tile_index: 1065},
    138: {name: "Brainee", tile_index: 1066},
    139: {name: "Chico", tile_index: 1067},
    140: {name: "Harpo", tile_index: 1069},
    141: {name: "Labria", tile_index: 1071},
    142: {name: "Bith", tile_index: 1072},
    143: {name: "Ice Mushroom", tile_index: 1196},
    144: {name: "Mushroom", tile_index: 1197},
    145: {name: "Scrubroot", tile_index: 1198},
    146: {name: "Captain Bahl", tile_index: 1211},
    147: {name: "General Marutz", tile_index: 1212},
    148: {name: "Fibbs", tile_index: 1213},
    149: {name: "Doctor Nambu", tile_index: 1214},
    150: {name: "DataCube", tile_index: 1215},
    151: {name: "Star Sapphire", tile_index: 1216},
    152: {name: "Dianoga Heart", tile_index: 1217},
    153: {name: "R2L7", tile_index: 1218},
    154: {name: "Key Card", tile_index: 1231},
    155: {name: "Key Card", tile_index: 1232},
    156: {name: "Key Card", tile_index: 1233},
    157: {name: "Key Card", tile_index: 1234},
    158: {name: "Key Card", tile_index: 1235},
    159: {name: "Stormtrooper ID", tile_index: 1236},
    160: {name: "ID Card", tile_index: 1237},
    161: {name: "Key", tile_index: 1238},
    162: {name: "Sonic Hammer", tile_index: 1239},
    163: {name: "Imperial Key", tile_index: 1240},
    164: {name: "Key Card", tile_index: 1241},
    165: {name: "Key Card", tile_index: 1242},
    166: {name: "Key Card", tile_index: 1243},
    167: {name: "Key Card", tile_index: 1244},
    168: {name: "Rebel ID Card", tile_index: 1245},
    169: {name: "Ladder", tile_index: 1246},
    170: {name: "Beacon", tile_index: 1268},
    171: {name: "Ice Merchant", tile_index: 1279},
    172: {name: "IP-8 Droid", tile_index: 1280},
    173: {name: "Bartender Droid", tile_index: 1281},
    174: {name: "Fuse", tile_index: 1284},
    175: {name: "Security Pass", tile_index: 1287},
    176: {name: "Grappling Hook", tile_index: 1292},
    177: {name: "Snow Trooper", tile_index: 1313},
    178: {name: "Jawa", tile_index: 1350},
    179: {name: "Energy Relay", tile_index: 1351},
    180: {name: "C-3PO", tile_index: 1353},
    181: {name: "END2B", tile_index: 1354},
    182: {name: "Droid Body", tile_index: 1357},
    183: {name: "Bug", tile_index: 1366},
    184: {name: "END13A", tile_index: 1378},
    185: {name: "END13B", tile_index: 1379},
    186: {name: "END15A", tile_index: 1419},
    187: {name: "END15B", tile_index: 1420},
    188: {name: "Spirit Heart", tile_index: 1432},
    189: {name: "END3A", tile_index: 1596},
    190: {name: "END3B", tile_index: 1597},
    191: {name: "Uncle Jimmy", tile_index: 1600},
    192: {name: "Sgt. Bilko", tile_index: 1601},
    193: {name: "Asinus Testa", tile_index: 1602},
    194: {name: "Private Lime", tile_index: 1603},
    195: {name: "Back", tile_index: 1604},
    196: {name: "Princess Leia", tile_index: 1607},
    197: {name: "END4A", tile_index: 1617},
    198: {name: "END4B", tile_index: 1618},
    199: {name: "END12A", tile_index: 1650},
    200: {name: "END12B", tile_index: 1651},
    201: {name: "END16A", tile_index: 1652},
    202: {name: "END16B", tile_index: 1653},
    203: {name: "Jungle Ray", tile_index: 1742},
    204: {name: "Tool Droid", tile_index: 1768},
    205: {name: "IG88", tile_index: 1769},
    206: {name: "ForestTrooper", tile_index: 1770},
    207: {name: "Droid1", tile_index: 1785},
    208: {name: "Droid2", tile_index: 1786},
    209: {name: "Ending5A", tile_index: 1788},
    210: {name: "Ending5B", tile_index: 1789},
    211: {name: "Key Card", tile_index: 1793},
    212: {name: "Yea Martini", tile_index: 1794},
    213: {name: "Key Card", tile_index: 1795},
    214: {name: "Ancient Key", tile_index: 1796},
    215: {name: "Tahmboix", tile_index: 1818},
    216: {name: "Limburger(Left)", tile_index: 1819},
    217: {name: "Dr. Filth", tile_index: 1820},
    218: {name: "Porker", tile_index: 1821},
    219: {name: "Nanuk", tile_index: 1822},
    220: {name: "Jimmy Corrigan", tile_index: 1823},
    221: {name: "Hiball", tile_index: 1824},
    222: {name: "Bill Carson", tile_index: 1825},
    223: {name: "Xizor Sal Ud", tile_index: 1826},
    224: {name: "Nai'ah", tile_index: 1827},
    225: {name: "END10A", tile_index: 1828},
    226: {name: "END10B", tile_index: 1829},
    227: {name: "Betsy Page", tile_index: 1830},
    228: {name: "Rumple", tile_index: 1831},
    229: {name: "Shaker", tile_index: 1832},
    230: {name: "Chubbs", tile_index: 1833},
    231: {name: "AshCan", tile_index: 1907},
    232: {name: "PodMobile", tile_index: 1908},
    233: {name: "End7A", tile_index: 1935},
    234: {name: "End7B", tile_index: 1936},
    235: {name: "Cloaking Device", tile_index: 1940},
    236: {name: "Imp Off One", tile_index: 1981},
    237: {name: "Imp Off Too", tile_index: 1982},
    238: {name: "END9B", tile_index: 1983},
    239: {name: "END6B", tile_index: 1984},
    240: {name: "END11A", tile_index: 1985},
    241: {name: "END11B", tile_index: 1986},
    242: {name: "Yoda's Back", tile_index: 1993},
    243: {name: "Dainougut", tile_index: 2036},
    244: {name: "Ewok Doc", tile_index: 2037},
    245: {name: "Chewbacca", tile_index: 2114}
};

/* Indices below point into array MAIN_ITEMS */
var BASE_TRADE = [84,92]; /* medpack and blaster rifle */
var BARTERABLE = [1,2,5,7,22,91,92,93,]; /* these items are accepted by traders as payment */

var LOOT = [1,2,5,7,22,62,86,92,93,143,144,145,];
var GENERIC_KEYCARDS = [154,155,156,157,158,160,161,164,165,166,167,211,213,];

/* Returns a random item_index from LOOT array.
 * If chance (real number 0.0 .. 1.0) is specified, it indicates the probability
 * of returning non-null index; otherwise chance=1.0 is assumed.
*/
var random_loot = function (chance) {
    if (chance === undefined) chance = 1.0;
    var i = Math.floor(Math.random() * LOOT.length);
    if (Math.random() <= chance)
        return LOOT[i];
    return null;
};
            
var QUEST_ITEMS = [8,10,11,12,13,14,15,16,17,18,
                   19,20,21,23,24,25,26,27,28,29,30,
                   31,32,33,34,35,36,37,38,39,40,41,
                   42,43,44,46,47,48,49,50,51,52,53,
                   54,55,56,57,58,59,60,61,63,64,65,
                   66,67,68,69,70,71,72,73,74,75,76,
                   77,78,79,80,81,83,87,88,94,95,96,
                   97,98,99,100,102,104,105,106,
                   150,151,152,159,162,163,168,169,
                   170,174,175,176,179,188,214,231,
                   232,235,
                   ];
var QUEST_PERSONS = [107,108,110,113,119,123,126,
                    127,129,130,131,132,133,134,135,
                    136,138,139,140,141,142,146,147,
                    148,149,171,172,173,180,191,192,
                    193,194,196,212,215,217,218,219,
                    220,221,222,223,224,227,228,229,
                    230,236,237,244];

var THINGS = {
    "Lightsaber": 89,
    "Pile of Junk": 1,
    "Heap of Junk": 2,
    "5,000 Credits": 4,
    "Stack of Junk": 5,
    "Locator": 6,
    "Stash of Junk": 7,
    "Collapsible Bridge": 8,
    "10,000 Credits": 9,
    "Gas Grenade": 10,
    "Smoke Grenade": 11,
    "Sonic Cleaver": 12,
    "Ice Drill": 13,
    "Droid Detector": 14,
    "Alluvial Damper": 15,
    "Vial of Tibanna Gas": 16,
    "Thermal Cape": 17,
    "Restraining Bolt": 18,
    "Power Terminal": 19,
    "Power Prybar": 20,
    "Navicomputer": 21,
    "Pile of Credits": 22,
    "Bar of Durasteel": 23,
    "Shield Generator": 24,
    "Drive Compensator": 25,
    "Comm Unit": 26,
    "Anti-Grav Generator": 27,
    "Lantern of Sacred Light": 28,
    "Data Card": 29,
    "Lommite Crystal": 30,
    "Kaiburr Crystal": 31,
    "Sample of Ryll": 32,
    "Sensor Array": 33,
    "Repulsor": 34,
    "Hyperspace Compass": 35,
    "Fusion Welder": 36,
    "Beamdrill": 37,
    "Vocabulator": 38,
    "Adegan Crystal": 39,
    "Sensor Pack": 40,
    "Holocron": 41,
    "Decoder": 42,
    "Holocube": 43,
    "Transponder": 44,
    "Droid Part": 45,
    "Power Converter": 46,
    "Motivator": 47,
    "Energy Cell": 48,
    "Computer Probe": 49,
    "Droid Caller": 50,
    "Crate of Spice": 51,
    "Blue Key Card": 52,
    "Red Key Card": 53,
    "Green Key Card": 54,
    "Training Remote": 55,
    "Locomotor": 56,
    "Electrolockpick": 57,
    "Glow Rod": 58,
    "Power Coupling": 59,
    "Bacta Fluid": 60,
    "Sample of Carbonite ": 61,
    "Chakroot": 62,
    "Blumfruit": 63,
    "Nav Card": 64,
    "Homing Beacon": 65,
    "Drive Guide": 66,
    "Electroscope": 67,
    "Rangefinder": 68,
    "Condenser Unit": 69,
    "Pair of Binoculars": 70,
    "Macrofuser": 71,
    "Hydrospanner": 72,
    "Imperial Belt": 73,
    "Generator": 74,
    "Macroscope": 75,
    "Utility Belt": 76,
    "Fusion Furnace": 77,
    "Telesponder": 78,
    "Breath Mask": 79,
    "Holocomm": 80,
    "Transfer Register": 81,
    "C-3PO's Head": 82,
    "Comlink": 83,
    "Rebel First Aid Kit": 84,
    "Imperial First Aid Kit": 85,
    "Q-Rations": 86,
    "Purple Key Card": 87,
    "Yellow Key Card": 88,
    "Lasersword": 89,
    "THE FORCE": 90,
    "Blaster": 91,
    "Blaster Rifle": 92,
    "Thermal Detonator": 93,
    "IM Mine": 94,
    "Orange Key Card": 95,
    "Fusion Cutter": 96,
    "Stasis Mine": 97,
    "Mine Pin": 98,
    "Igniter": 99,
    "Sequencer Charge A": 100,
    "Sequencer Charge B": 101,
    "Yubnut": 102,
    "Transport Generator": 104,
    "Ore Drill": 105,
    "Sith Amulet": 106, /*
    "Obi Wan Kenobi": 107,
    "Yoda": 108,
    "Jawa": 109,
    "Captain Blob": 110,
    "Darth Vader": 111,
    "Emperor's BG": 112,
    "Obi Wan": 113,
    "Probot-snow": 114,
    "Probot-Desert": 115,
    "R2-D2": 116,
    "R2-AmNot": 117,
    "Mine Droid": 118,
    "2-1B": 119,
    "Luke Skywalker": 120,
    "Boba Fett": 121,
    "Stormtrooper": 122,
    "Han Solo": 123,
    "END1A": 124,
    "END1B": 125,
    "Gnudo Heap": 126,
    "Advorzse": 127,
    "Advorzse2": 128,
    "Bilbo": 129,
    "Nikto": 130,
    "Frodo": 131,
    "Duros": 132,
    "Defel": 133,
    "Groucho": 134,
    "Abyssin": 135,
    "Nien Nunb": 136,
    "Brainee(left)": 137,
    "Brainee2": 138,
    "Chico": 139,
    "Harpo": 140,
    "Labria": 141,
    "Bith": 142,*/
    "Ice Mushroom": 143,
    "Mushroom": 144,
    "Scrubroot": 145, /*
    "Captain Bahl (I)": 146,
    "General Marutz": 147,
    "Fibbs (I)": 148,
    "Doctor Nambu (I)": 149, */
    "DataCube": 150,
    "Star Sapphire": 151,
    "Dianoga Heart": 152,
    "R2L7 (I)": 153,
    "Key Card A": 154,
    "Key Card B": 155,
    "Key Card C": 156,
    "Key Card D": 157,
    "Key Card E": 158,
    "Stormtrooper ID": 159,
    "ID Card": 160,
    "Key": 161,
    "Sonic Hammer": 162,
    "Imperial Key": 163,
    "Key Card F": 164,
    "Key Card G": 165,
    "Key Card H": 166,
    "Key Card I": 167,
    "Rebel ID Card": 168,
    "Ladder": 169,
    "Beacon": 170,
    //"Ice Merchant": 171,
    "IP-8 Droid": 172,
    //"Bartender Droid": 173,
    "Fuse": 174,
    "Security Pass": 175,
    "Grappling Hook": 176,
    //"Snow Trooper": 177,
    //"Jawa": 178,
    "Energy Relay": 179,
    /*"C-3PO": 180,
    "END2B": 181,
    "Droid Body": 182,
    "Bug": 183,
    "END13A": 184,
    "END13B": 185,
    "END15A": 186,
    "END15B": 187,*/
    "Spirit Heart": 188,
    /*"END3A": 189,
    "END3B": 190,
    "Uncle Jimmy": 191,
    "Sgt. Bilko(E)": 192,
    "Asinus Testa": 193,
    "Private Lime": 194,
    "Back": 195,
    "Princess Leia": 196,
    "END4A": 197,
    "END4B": 198,
    "END12A": 199,
    "END12B": 200,
    "END16A": 201,
    "END16B": 202,
    "Jungle Ray": 203,*/
    "Tool Droid": 204,
    /*"IG88(E)": 205,
    "ForestTrooper(E)": 206,
    "Droid1": 207,
    "Droid2": 208,
    "Ending5A": 209,
    "Ending5B": 210,*/
    "Key Card J": 211,
    //"Yea Martini": 212,
    "Key Card K": 213,
    "Ancient Key": 214,
    /*"Tahmboix": 215,
    "Limburger(Left)": 216,
    "Dr. Filth": 217,
    "Porker": 218,
    "Nanuk": 219,
    "Jimmy Corrigan": 220,
    "Hiball": 221,
    "Bill Carson": 222,
    "Xizor Sal Ud": 223,
    "Nai'ah": 224,
    "END10A": 225,
    "END10B": 226,
    "Betsy Page": 227,
    "Rumple": 228,
    "Shaker": 229,
    "Chubbs": 230,*/
    "AshCan": 231,
    "PodMobile": 232,/*
    "End7A": 233,
    "End7B": 234,*/
    "Cloaking Device": 235,/*
    "Imp Off One": 236,
    "Imp Off Too": 237,
    "END9B": 238,
    "END6B": 239,
    "END11A": 240,
    "END11B": 241,
    "Yoda's Back": 242,
    "Dainougut": 243,
    "Ewok Doc": 244,
    "Chewbacca": 245*/
};

var PEOPLE = {
    "Obi Wan's ghost": 107,
    "Yoda": 108,
    "Jawa": 109,
    "Captain Blob": 110,
    "Darth Vader": 111,
    "Emperor's BG": 112,
    "Obi Wan": 113,
    "2-1B": 119,
    //"Luke Skywalker": 120,
    "Boba Fett": 121,
    "Stormtrooper": 122,
    "Han Solo": 123,
    "Gnudo Heap": 126,
    "Advorzse": 127,
    "Eszrovda": 128,
    "Bilbo": 129,
    "Nikto": 130,
    "Frodo": 131,
    "Duros": 132,
    "Defel": 133,
    "Groucho": 134,
    "Abyssin": 135,
    "Nien Nunb": 136,
    "Brainee": 138,
    "Chico": 139,
    "Harpo": 140,
    "Labria": 141,
    "Bith": 142,
    "Captain Bahl": 146,
    "General Marutz": 147,
    "Fibbs": 148,
    "Doctor Nambu": 149, 
    "Ice Merchant": 171,
    "Bartender Droid": 173,
    "Snow Trooper": 177,
    "Jawa": 178,
    "C-3PO": 180,
    "Uncle Jimmy": 191,
    "Sgt. Bilko": 192,
    "Asinus Testa": 193,
    "Private Lime": 194,
    "Tool Droid": 204,
    "IG88": 205,
    "ForestTrooper": 206,
    "Yea Martini": 212,
    "Tahmboix": 215,
    "Dr. Filth": 217,
    "Sidor": 218,
    "Nanuk": 219,
    "Jimmy Corrigan": 220,
    "Hiball": 221,
    "Bill Carson": 222,
    "Xizor Sal Ud": 223,
    "Nai'ah": 224,
    "Betsy Page": 227,
    "Rumple": 228,
    "Shaker": 229,
    "Chubbs": 230,
    "Melvar": 236,
    "Zsinj": 237,
    "Ewok Shaman": 244,
    "Chewbacca": 245
};

/* Indices below specify tile indices */

/* this index in any tileset must contain a blank transparent tile */
var EMPTY_TILE = 355;

var PLAYER_IMGS = {
    // facing...
    left:  1778,
    right: 1779,
    up:    1780, 
    down:  1781
};

var MONSTER_SETS = {
    'Stormtrooper':  {left: 1310, right: 1312, up: 1311, down: 801},
    'Snowtrooper':   {left: 1314, right: 1315, up: 1316, down: 1313},
    'Scouttrooper':  {left: 1771, right: 1772, up: 1773, down: 1770},
    'Tusken':        {left: 1726, right: 1725, up: 1727, down: 1059},
    'Jawa':          {left: 1764, right: 1763, up: 1418, down: 784},
    'Fett':          {left: 1723, right: 1724, up: 1732, down: 800},
    'Smallwampa':    {left: 1262, right: 1263, up: 1264, down: 1261}, 
    'Snake':         {left: 1372, right: 1361, up: 1371, down: 1362}, 
    'Bug':           {left: 1363, right: 1366, up: 1364, down: 1365}, 
    'Snowstar':      {left: 1405, right: 1406, up: 1405, down: 1407}, 
    'Cancer':        {left: 1384, right: 1387, up: 1385, down: 1386}, 
    'Heavytrooper':  {left: 1730, right: 1731, up: 1729, down: 1728}, 
    'Wampa':         {left: 1733, right: 1734, up: 1735, down: 1098}, 
    'Turtle':        {left: 1738, right: 1736, up: 1737, down: 1739},
    'Manaan':        {left: 1740, right: 1743, up: 1742, down: 1741},
    'Hydra':         {left: 1744, right: 1745, up: 1744, down: 1745},  
    'IG88':          {left: 1783, right: 1784, up: 1782, down: 1769},    
    'R2':            {left: 1775, right: 1774, up: 1777, down: 1776}  
        /* todo: pages sprite07 and 08 */
};

var SHOOTING_MONSTERS = {
    'Stormtrooper':  true,
    'Snowtrooper':   true,
    'Scouttrooper':  true,
    'Fett': true,
    'Heavytrooper': true,
    'IG88': true
};

var AUTO_MONSTERS = {
    1059: {name: 'Tusken', shooting: false, loot: 0, loot_chance: 0.0},
    784:  {name: 'Jawa', shooting: false, loot: 0, loot_chance: 0.0},
    801:  {name: 'Stormtrooper', shooting: true, loot: THINGS['Blaster'], loot_chance: 0.5},
    1312: {name: 'Stormtrooper', shooting: true, loot: THINGS['Blaster'], loot_chance: 0.5},
    1316: {name: 'Stormtrooper', shooting: true, loot: THINGS['Blaster'], loot_chance: 0.5},
};

var PROJECTILES = { 
    "red_up": 521,
    "red_down": 521,
    "red_right": 522,
    "red_left": 522,
    "green_up": 519,
    "green_down": 519,
    "green_right": 520,
    "green_left": 520 
};

var PROJECTILE_EXPLOSIONS = {
    "red": null
};

var DOOR_SETS = {
    "sandmetal":    {closed: 152, open: 151},
    "sandred":      {closed: 153, open: 154},
    "rockhatch":    {closed: 70,  open: 77},
    "rockbeeline":  {closed: 74,  open: 79},
    "archwalldoor": {closed: 2128, open: 2129},
};

var CONTAINER_SETS = {
    "sandchest": {closed: 16, open: 17},
    "woodchest": {closed: 258, open: 259},
    "beelinechest": {closed: 633, open: 634},
    "graychest": {closed: 635, open: 634},
    "redchest": {closed: 636, open: 637},
    "icechest": {closed: 1165, open: 1166},
    "minibar":  {closed: 1765, open: 1766}, 
    "fallenrebel": {closed: 1101, open: 1101},
    "car_left": {closed: 1175, open: 1250},  /* car facing left,  nose: 1174 */
    "car_right": {closed: 1922, open: 1934}, /* car facing right, nose: 1923 */ 
};

var CAR_NOSES = {
    "left": 1174,
    "right": 1923,
};

var ANIMATIONS = {
    "explosion": [1073,1074,1075],
    "iamhere":   [837,837,837,EMPTY_TILE,EMPTY_TILE,EMPTY_TILE]
};

var LOCATOR_TILES = {
    "puzzle": 817,
    "solvedpuzzle": 818,
    "gateway": 819,
    "solvedgateway": 820,
    
    "border_up": 821,
    "solvedborder_up": 822,
    "border_right": 823,
    "solvedborder_right": 824,
    "border_down": 825,
    "solvedborder_down": 826,
    "border_left": 827,
    "solvedborder_left": 828,
    
    "home": 829,
    "wilderness": 832,
    "teleport": 833,
    "unvisited": 835,
    "nothing": 836,
    "here": 837,
    
    "trader": 2130,
};