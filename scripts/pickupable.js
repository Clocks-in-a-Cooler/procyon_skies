var Players   = require(__dirname + "/players.js");
var Misc_math = require(__dirname + "/misc_math.js");

var Pickupable = module.exports = {};

function Resource_item(x, y, au, ag, fe, si) {
    this.x = x;
    this.y = y;
    
    this.au = isNaN(au) ? 0 : au;
    this.ag = isNaN(ag) ? 0 : ag;
    this.fe = isNaN(fe) ? 0 : fe;
    this.si = isNaN(si) ? 0 : si;
    
    this.visible  = true;
    this.lifetime = 0;
    this.active   = true;
    this.type     = "resource";
}

Resource_item.prototype.flash_delay  = 750;
Resource_item.prototype.start_flash  = 7500;
Resource_item.prototype.max_lifetime = 1e4;

Resource_item.prototype.attraction_radius = 25;

Resource_item.prototype.speed = 0.007;

Resource_item.prototype.update = function(lapse) {
    this.lifetime += lapse;
    if (this.lifetime >= this.max_lifetime) {
        this.active = false;
        return;
    }
    
    if (this.lifetime >= this.start_flash) {
        var is_visible = Math.floor((this.lifetime - this.start_flash) / this.flash_delay);
        
        this.visible = (is_visible % 2 == 0);
    }
    
    var nearest = Players.get_closest(this.x, this.y);
    
    if (nearest == undefined ||
        Misc_math.get_distance(this.x, this.y, nearest.x, nearest.y) > this.attraction_radius
    ) {
        return;
    } else if (Misc_math.get_distance(this.x, this.y, nearest.x, nearest.y) > this.attraction_radius) {
        this.give_to(nearest);
    } else {
        this.x += (nearest.x - this.x) * this.speed * lapse;
        this.y += (nearest.y - this.y) * this.speed * lapse;
    }
};

Resource_item.prototype.give_to = function(player) {
    Player.give_resources(this.au, this.ag, this.fe, this.si);
    this.active = false;
};

Pickupable.Resource_item = Resource_item;