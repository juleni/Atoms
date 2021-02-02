// objekt Score s definiciou hracov, ich vlastnosti, 
// skore a metody nutne pre pracu s tymito datami

var Score = {
  _players: [
      {
          color: "blue",
          name: "Modry hrac",
          score: 0,
          node: null
      }, {
        color: "red",
        name: "Cerveny hrac",
        score: 0,
        node: null
      }
  ],
  _gameOver: false
};

// inicializacia
Score.init = function() {
  // pre kazdeho hraca sa urobi odstavec, naplni sa jeho menom a nastavi sa farba
  // na koniec odstavca sa vklada span, v ktorom sa bude menit skore
  for (var i=0; i<this._players.length; i++) {
    var obj = this._players[i];
    obj.node = document.createElement("span");

    var p = document.createElement("p");
    p.style.color = obj.color;
    p.appendChild(document.createTextNode(obj.name + ": "));
    p.appendChild(obj.node);

    document.body.appendChild(p);
  }
}

// vrat farbu hraca
// @param player - hrac -1, 0, 1 ... definovany v Board.init
Score.getColor = function(player) {
    return this._players[player].color;
}

// vrat pocet hracov
Score.getPlayerCount = function() {
    return this._players.length;
}

// vrat priznak, ci je koniec hry
Score.isGameOver = function() {
    return this._gameOver;
}

// odober skore hracovi
Score.removePoint = function(player) {
  // odober skore len pre neprazdnu bunku
  if (player == -1) { return; }  
  
  // nacitaj udaje hraca, odcitaj mu skore a vloz do html elementu
  var obj = this._players[player];
  obj.score--;
  obj.node.innerHTML = obj.score;
}

// pridaj skore hracovi
Score.addPoint = function(player) {
    // nacitaj udaje hraca, odcitaj mu skore a vloz do html elementu
    var obj = this._players[player];
    obj.score++;
    obj.node.innerHTML = obj.score;
    // ukonci hru, ak skore dosiahne pocet buniek hracej plochy
    if (obj.score == Game.SIZE * Game.SIZE ) {
        Player.stopListening();
        this._gameOver = true;
        alert("KONIEC HRY, VYHRAL " + obj._players[player].name);
    }
  }
  