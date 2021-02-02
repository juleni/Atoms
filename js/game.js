// objekt Game pre riadenie hry

// konstruktor Game
// @param players - pole s instanciami hracov
var Game = function(players) {
  this._players = players;
  this._currentPlayer = 0;

  this._draw = new Draw();

  // konstruktoru Board je potrebne predat supisku hracov a instanciu Draw
  this._board = new Board(players, this._draw);
  // vlastnost Board.prototype.onTurnDone je posluchac udalosti dokoncenia tahu,
  // priradime do nej vlastnu metodu Game.prototype._turnDone a vyuzijeme 'bind', 
  // aby sme mohli korektne vyuzivat 'this'
  this._board.onTurnDone = this._turnDone.bind(this);

  this._askPlayer();
};
Game.SIZE = 6;

// vyzvy hraca ku hre
Game.prototype._askPlayer = function() {
  var player = this._players[this._currentPlayer];
  // vezmeme spravnu instanciu hraca a zavolame jej verejnu metodu play
  player.play(this._board, this._draw, this._playerDone.bind(this));
}

// metoda predavana hracovi na tahu
Game.prototype._playerDone = function(xy) {
  var player = this._players[this._currentPlayer];
  var existing = this._board.getPlayer(xy);

  if (!existing || existing == player) {
    // pridaj atom len v pripade, ze je to v ramci pravidiel
    this._board.addAtom(xy, player);
  } else {
    // vyzvy ho znova
    this._askPlayer();
  }
}

// posluchac dokoncenia tahu
Game.prototype._turnDone = function() {
  var scores = [];
console.log("======= Game.prototype._turnDone ================");
  for (var i=0; i<this._players.length; i++) {
    var player = this._players[i];
    var score = this._board.getScoreFor(player);
    player.setScore(score);
    scores.push(score);
  }

  if (Game.isOver(scores)) { 
     alert("KONIEC HRY, VYHRAL " + this._players[this._currentPlayer].getName()); 
     return;  
  } else {
      // modulo zaisti spravne orezanie indexu hraca
      this._currentPlayer = (this._currentPlayer+1) % this._players.length;
      this._askPlayer();    
    }
}

// staticka metoda, nezavisi na vnutornom stave instancie a potrebujeme ju volat aj z objektu Board
// je potrebne overit skore najlepsieho hraca - v poli 'score' je potrebne najst najvyssie cislo
// pomocou 'Math.max' - vdaka metode 'apply' jej dokazeme predat pole so skore ako jednotlive parametre
// prvy parameter je 'this' - konzervativne 'Math' (aby bolo zhodne ako pri volani Math.max)
Game.isOver = function(scores) {
  return (Math.max.apply(Math, scores) == this.SIZE * this.SIZE);
}