var Player = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
}

Player.prototype.act = function() {
    Game.engine.lock();
    window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function(e) {
    var keyMap = {};
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;

    var code = e.keyCode;
    if (code == 13 || code == 32) {
        this._checkBox();
        return;
    }
    /* one of numpad directions? */
    if (!(code in keyMap)) { return; }

    /* is there a free space? */
    var dir = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + dir[0];
    var newY = this._y + dir[1];
    var newKey = newX + "," + newY;
    if (!(newKey in Game.map)) { return; }

    Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
}

Player.prototype._checkBox = function() {
    var key = this._x + "," + this._y;
    if (Game.map[key] != "*") {
        alert("There is no box here!");
    } else if (key == Game.ananas) {
        Game.display.drawText(1,  H, "Hooray! You reached the McGuffin before your doom.");
        Game.engine.lock();
        window.removeEventListener("keydown", this);
    } else {
        Game.display.drawText(1,  H, "This box is empty :-(");
    }
}

Player.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "@", "#ff0");
}

Player.prototype.getX = function() { return this._x; }

Player.prototype.getY = function() { return this._y; }
