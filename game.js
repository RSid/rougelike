W=100, H=40;

var Game = {
    display: null,
    map: {},
    engine: null,
    player: null,
    doors: new Array(),

    init: function() {
        this.display = new ROT.Display({width: W, height: H + 5});
        document.body.appendChild(this.display.getContainer());

        this._generateMap();
        this.player = this._createBeing(Player);
        this.enemy = this._createBeing(Enemy);

        this.scheduler = new ROT.Scheduler.Simple();
        this.scheduler.add(this.player, true);
        this.scheduler.add(this.enemy, true);

        this.engine = new ROT.Engine(this.scheduler);
        this.engine.start();
    },

    _generateMap: function() {
        var digger = new ROT.Map.Digger(W, H);
        this.freeCells = [];

        var digCallback = function(x, y, value) {
            if (value) { return; }

            var key = x+","+y;
            this.map[key] = ".";
            this.freeCells.push(key);
        }
        digger.create(digCallback.bind(this));

        this._generateBoxes(this.freeCells);
        this._generateDoors(this.freeCells);
        this._drawWholeMap();
    },

    _destroyMap: function() {

      if(this.enemy) {
        Game.display.draw(this.enemy._x, this.enemy._y, Game.map[this.enemy._x+","+this.enemy._y]);
        this.scheduler.remove(this.enemy);
        delete this.enemy;
      }

      this._eraseWholeMap();
      this.map = new Array();
    },

    _createBeing: function(what) {
        var index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
        var key = this.freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        return new what(x, y);
    },

    _placeBeing: function(what) {
      var index = Math.floor(ROT.RNG.getUniform() * this.freeCells.length);
      var key = this.freeCells.splice(index, 1)[0];
      var parts = key.split(",");
      var x = parseInt(parts[0]);
      var y = parseInt(parts[1]);

      what._x = x;
      what._y = y;
    },

    _generateBoxes: function(freeCells) {
        for (var i=0;i<10;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            this.map[key] = "*";
            if (!i) { this.ananas = key; } /* first box contains an ananas */
        }
    },

    _generateDoors: function(freeCells) {
      for (var i=0;i<2;i++) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        this.map[key] = "H";
        this.doors.push(key);
      }
    },

    _drawWholeMap: function() {
        for (var key in this.map) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.display.draw(x, y, this.map[key]);
        }
    },

    _eraseWholeMap: function() {
      for (var key in this.map) {
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        this.display.draw(x, y, "");
        }
    }

};
