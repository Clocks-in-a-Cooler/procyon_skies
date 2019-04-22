//the camera
var Camera = {
    //things required for drawing on the screen are here
    
    objects: [],
    players: [],
    width: null,
    height: null,
    offset_x: null,
    offset_y: null,
    
    line_spacing: 25,
    line_width: 1,
    line_colour: "#222222",
    
    draw_frame: function(cxt) {
        cxt.clearRect(0, 0, this.width, this.height);
        
        //draw the gridlines
        var x_line_offset = this.line_spacing - (this.offset_x % this.line_spacing);
        var y_line_offset = this.line_spacing - (this.offset_y % this.line_spacing);
        cxt.strokeStyle   = this.line_colour;
        cxt.lineWidth     = this.line_width;
        
        for (var a = x_line_offset; a <= this.width; a += this.line_spacing) {
            cxt.beginPath();
            cxt.moveTo(a, 0);
            cxt.lineTo(a, this.height);
            cxt.closePath();
            cxt.stroke();
        }
        
        for (var b = y_line_offset; b <= this.height; b += this.line_spacing) {
            cxt.beginPath();
            cxt.moveTo(0, b);
            cxt.lineTo(this.width, b);
            cxt.closePath();
            cxt.stroke();
        }
        
        //draw each object
        this.objects.forEach((f) => {
            //get the offset
            var draw_x = f.x - this.offset_x;
            var draw_y = f.y - this.offset_y;
            
            switch (f.type) {
                case "bubble":
                    //draw a circle
                    cxt.fillStyle = get_colour(f.colour, f.colour.alpha);
                    cxt.beginPath();
                    cxt.arc(draw_x, draw_y, 2, 0, Math.PI * 2);
                    cxt.closePath();
                    cxt.fill();
                    break;
                default:
                    log("unrecognized type: " + f.type);
                //what else?
            }
        });
        
        this.players.forEach((p) => {
            //get the offset
            var draw_x = p.x - this.offset_x;
            var draw_y = p.y - this.offset_y;
            
            cxt.fillStyle = get_colour(p.colour);
            //write their name first
            cxt.font = "14pt VT323";
            //at 14pt, VT323 is about 7.5 by 14 pixels (it's a monospace font)
            cxt.textAlign = "center";
            cxt.fillText(p.name, draw_x, draw_y - 29);
            cxt.save();
            cxt.translate(draw_x, draw_y);
            cxt.rotate(p.angle);
            cxt.beginPath();
            cxt.moveTo(0, 0); cxt.lineTo(-5, 5); cxt.lineTo(10, 0); cxt.lineTo(-5, -5); cxt.lineTo(0, 0);
            cxt.closePath();
            cxt.fill();
            cxt.restore();
        });
        
        //draw in the player's coordinates at the top left corner
        cxt.textAlign = "left";
        cxt.fillStyle = get_colour(Game.colour);
        cxt.fillText("x: " + Math.round(this.width / 2 + this.offset_x), 5, 15);
        cxt.fillText("y: " + Math.round(this.height / 2 + this.offset_y), 5, 30);
    },
    
    resize: function() {
        this.width  = canvas.width;
        this.height = canvas.height;
    },
};

function get_colour(c, alpha) {
    if (alpha) {
        return "rgba(" + c.r + ", " + c.g + ", " + c.b + ", " + alpha + ")";
    } else {
        return "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
    }
}