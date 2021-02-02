// objekt Board ako stav hracej plochy
// objekt uchovava pocet atomov a limit (kriticke mnozstvo) v danej bunke hracieho pola

// konstruktor Board
var Board = function(players, draw) {
    this.DELAY= 200;
    this.onTurnDone = function() {} // zavolame po kazdom tahu
    
    this._draw = draw;
    this._data = {};
    this._criticals = [];

    this._players = players;
    this._score = [];
    for (var i=0; i<players.length; i++) {
      this._score.push(0);
    }
    // inicializuj data hracej plochy
    this._build();
};

// konstruktor klonu hracej plochy - urceny pre brute force AI - na tejto ploche skusa 
// vsetky moznosti (jeden tak dopredu) a rozhodne sa pre najlepsiu
Board.prototype.clone = function() {
  // 1. parameter - pole hracov, ktore pouzivame
  // 2. parameter (draw) je null, nechceme nic vykreslovat ani zdrziavat cez setTimeout,
  // takze v pripade null sa to nebude vykonavat - v Board triede
  var clone = new Board(this._players, null);

  // kedze sa odvolavame odkazom, je potrebne vytvorit kopiu pola pomocou 'slice'
  // inac by doslo k zdielaniu pola oboma instanciami
  clone._score = this._score.slice(0);

  for (var p in this._data) {
    var ourCell = this._data[p];
    var cloneCell = clone._data[p];

    cloneCell.atoms = ourCell.atoms;
    cloneCell.player = ourCell.player;
  }

  return clone;
}

// ---------------------------------------------
// Vrat limit - kriticke mnozstvo atomov v bunke
// ---------------------------------------------
Board.prototype._getLimit = function(xy) {
  // var limit = 4;
  // if (x == 0 || x == Game.SIZE) { limit--; }
  // if (y == 0 || y == Game.SIZE) { limit--; }
  // return limit;
  return xy.getNeighbours().length;
}

// ------------------------------
// Inicializuj stav hracej plochy
// ------------------------------
Board.prototype._build = function() {
  for (var i=0; i<Game.SIZE; i++) {
    // this._data.push([]);
    for (var j=0; j<Game.SIZE; j++) {
      var xy = new XY(i, j)
      var limit = this._getLimit(xy);
      var cell = {
            atoms: 0,
            limit: limit,
            player: null
      }
      this._data[xy] = cell;
    }
  }
}



// ---------------------------------------------
// Vrat pocet atomov v bunke
// ---------------------------------------------
Board.prototype.getAtoms = function(xy) {
  return this._data[xy].atoms;
}

// ---------------------
// Vykonaj rozpad atomov
// ---------------------
Board.prototype._explode = function() {
  // odober prvy prvok z pola kritickych a dostaneme sa tak
  // k suradniciam nadkritickej bunky, ktorej sa mame venovat
  // var pair = this._criticals.shift();
  // var x = pair[0];
  // var y = pair[1];
  var xy = this._criticals.shift();
  var cell = this._data[xy];

  var neighbours = xy.getNeighbours();
  cell.atoms -= neighbours.length;

  if (this._draw) {
    this._draw.cell(xy, cell.atoms, cell.player);
  }

  // prejdeme susedov a vlozime do nich atom
  for (var i=0; i<neighbours.length; i++) {
    var nxy = neighbours[i];
    this._addAndCheck(nxy, cell.player);
  }

  if (Game.isOver(this._score)) {
    // skonci ak je koniec hry
    this.onTurnDone(this._score); 
  } else if (this._criticals.length > 0) {
    if (this._draw) {
        setTimeout(this._explode.bind(this), this.DELAY);
      } else {
        // vykonaj pre pripad brute force AI - skusa tahy bez zdrzania
        this._explode(); 
      }
  } else {
    // ak uz nie su nadkriticke bunky, pokracujeme v hre
    this.onTurnDone(this._score); 
  }
}

// --------------------------------------------------
// Skontroluj kriticke mnozstvo s pridaj atom v bunke
// pre zvoleneho hraca najdi jeho index v poli this._players a na 
// tomto indexe uprav hodnotu v this._score 
// @param xy - suradnice bunky
// @param player - vlastnik bunky (-1, 0, 1)
// --------------------------------------------------
Board.prototype._addAndCheck = function(xy, player) {
  var cell = this._data[xy];

  cell.atoms++;
  
  if (this._draw) {
    this._draw.cell(xy, cell.atoms, player);
  }

  if (cell.atoms > cell.limit) {
    // pokial uz bunka existuje vo fronte kritickych, tak ju nepridaj a skonci
    for (var i=0; i<this._criticals.length; i++) {
      var tmp = this._criticals[i];
      // if (tmp[0] == x && tmp[1] == y) { return; }
      if (tmp.equals(xy)) { return; }
    } 
    // ak bunka vo fronte kritickych neexistuje, tak ju tam pridaj
    this._criticals.push(xy); 
  }

  if (cell.player) { // odober bod predchadzajucemu hracovi, ak nejaky je
    var oldPlayerIndex = this._players.indexOf(cell.player);
    this._score[oldPlayerIndex]--;
    var oldPlayer = this._players[oldPlayerIndex];
    oldPlayer.setScore(this._score[oldPlayerIndex]);
  }

  // nastav vlastnictvo bunky na aktualneho hraca
  cell.player = player;

    // pridaj bod novemu hracovi
  var playerIndex = this._players.indexOf(player);
  this._score[playerIndex]++;
  var currentPlayer = this._players[playerIndex];
  currentPlayer.setScore(this._score[playerIndex]);
}

// --------------------
// Vrat vlastnika bunky
// --------------------
Board.prototype.getPlayer = function(xy) {
  return this._data[xy].player;
}

// --------------------
// Vrat skore daneho hraca z pola score[]
// --------------------
Board.prototype.getScoreFor = function(player) {
  var index = this._players.indexOf(player);
  return this._score[index];
}

// -----------------------------------------------
// Pridaj atom v bunke s moznou animaciou rozpadu
// @param x - x-ova suradnica bunky
// @param y - y-ova suradnica bunky
// @param player - vlastnik bunky (-1, 0, 1)
// -----------------------------------------------
Board.prototype.addAtom = function(xy, player) {
  this._addAndCheck(xy, player);

  if (Game.isOver(this._score)) {
    // skonci ak je koniec hry
    this.onTurnDone(this._score); 
  } else if (this._criticals.length > 0) {
    this._explode();
    } else {
      // pridanie bez rozpadu ci konca hry
      this.onTurnDone(this._score);
    }
}