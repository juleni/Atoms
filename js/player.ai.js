// objekt Player AI pre pracu s umelou inteligenciou - hrac = PC

// konstruktor potomka - Player.AI
Player.AI = function(name, color) {
  // zavolaj konstruktor predka
  Player.call(this, name, color);
}

// prototypove prepojenie Player.AI.prototype a Player.prototype
// nastav potomkov prototyp na prototyp predka 
Player.AI.prototype = Object.create(Player.prototype);

// VERZIA AI 2 MiniMax - vyskusaj vsetky varianty na jeden tah dopredu a vyber najlepsi 
Player.AI.prototype.play = function(board, draw, callback) {
  var scores = {};

  // daj skore pre kazdu bunku
  for (var i=0; i<Game.SIZE; i++) {
    for (var j=0; j<Game.SIZE; j++) {
      var xy = new XY(i, j);
      var player = board.getPlayer(xy);
      // spracuj len bunky patriace 
      if (player && player != this) { continue; }
      // nacitaj ciselne hodnoty jednotlivych tahov
      scores[xy] = this._getScore(board, xy);
    }
  }
  // vrat suradnice najlepsie ohodnoteneho tahu
  var best = this._pickBest(scores);

  callback(best);
}

Player.AI.prototype._getScore = function(board, xy) {
  var clone = board.clone();
  // kedze sa jedna o klon, mame istotu, ze metoda addAtom bude synchronna a po jej
  // skonceni sa mozeme hned opytat na skore
  clone.addAtom(xy, this);
  return clone.getScoreFor(this);
}

// vyber najlepsie skore z daneho pola scores[]
Player.AI.prototype._pickBest = function(scores) {
  var positions = [];
  var best = 0;

  for (var p in scores) {
    var score = scores[p];
    
    if (score > best) {
      best = score;
      positions = [];
    }

    if (score == best) {
      // ak je viac rovnakych best score, tak ich uloz do pola
      // v tomto poli sa vsak eviduju retazce v tvare "x,y"
      positions.push(p);
    }
  }

  // vrat nahodnu poziciu z pola best scores
  var position = positions[Math.floor(Math.random() * positions.length)];
  // kedze 'position' je retazec v tvare "x,y" a potrebujeme vratit objekt XY,
  // musime sa postarat o prevod - v objete XY
  return XY.fromString(position);
}

// VERZIA AI 1 - vyber nahodnu pripustnu bunku 
/*
Player.AI.prototype.play = function(board, draw, callback) {
  var available = [];

  // vyber nahodne do lubovolnej pripustnej bunky
  for (var i=0; i<Game.SIZE; i++) {
    for (var j=0; j<Game.SIZE; j++) {
      var xy = new XY(i, j);
      var player = board.getPlayer(xy);
      
      if (!player || player == this) { available.push(xy); }
    }
  }

  var index = Math.floor(Math.random() * available.length);
  callback(available[index]);
}
*/