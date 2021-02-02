// objekt Draw pre vykreslovanie

// konstruktor
var Draw = function() {
  this.POSITIONS = [  // pozicie atomov v bunke
    null, // na pozicii 0 nas rozmiestnenie nezaujima - prazdna bunka
    [[1/2, 1/2]],  // 1 atom
    [[1/4, 1/4], [3/4, 3/4]],  // 2 atomy
    [[1/2, 1/2], [1/4, 1/4], [3/4, 3/4]],  // 3 atomy
    [[1/4, 1/4], [1/4, 3/4], [3/4, 3/4], [3/4, 1/4]],  // 4 atomy
    [[1/2, 1/2], [1/4, 1/4], [1/4, 3/4], [3/4, 3/4], [3/4, 1/4]],  // 5 atomov
    [[1/4, 1/4], [1/4, 1/2], [1/4, 3/4], [3/4, 1/4], [3/4, 1/2], [3/4, 3/4]],  // 6 atomov
    [[1/4, 1/4], [1/4, 1/2], [1/4, 3/4], [1/2, 1/2], 
     [3/4, 1/4],[3/4, 1/2], [3/4, 3/4]],  // 7 atomov
    [[1/4, 1/4], [1/4, 1/2], [1/4, 3/4], [1/2, 1/4],
     [1/2, 3/4], [3/4, 1/4],[3/4, 1/2], [3/4, 3/4]]  // 8 atomov
  ];
  this.CELL = 60; // velkost bunky hracieho pola [px]
  this.LINE = 2; // hrubka ciary bunky [px]
  this.ATOM = 7; // polomeR atomu [px]
  this._context = null;  // 2D kontext canvasu


  var canvas = document.createElement("canvas");
  this.CELL += this.LINE;
                
  var size = Game.SIZE * this.CELL + this.LINE;
  canvas.width = size; // nastav sirku canvasu
  canvas.height = size; // nastav vysku canvasu
   
  this._context = canvas.getContext("2d");
  this._context.lineWidth = this.LINE;
  this._context.fillStyle = "#000";
  this._context.fillRect(0, 0, size, size);

  // vykresli vsetky jednotlive bunky hracieho pola na cierny canvas
  for (var i=0; i<Game.SIZE; i++) {
    for (var j=0; j<Game.SIZE; j++) {
      var xy = new XY(i, j);
      this.cell(xy);
    }
  }

  document.body.appendChild(canvas);
};

// ---------------------------
// Vykresli celu hraciu plochu
// ---------------------------
Draw.prototype.all = function() {

  this._context.fillStyle = "#fff"; // vypln bielou farbou

  var width = this._context.canvas.width;  
  var height = this._context.canvas.height;

  this._context.fillRect(0, 0, width, height);
  
  this._lines(); // vykresli mriezku
  this._cells(); // vykresli atomy v jednotlivych bunkach
}

// ------------------------------
// Vykresli mriezku hracej plochy
// ------------------------------
Draw.prototype._lines = function() {
  this._context.beginPath();  // zacni obecnu krivku
  
  for (var i=0; i<Game.SIZE+1; i++) { // zvisle ciary
    var x = this.LINE/2 + i*this.CELL;
    // definuje pohyb virtualneho pera - zvisle usecky
    this._context.moveTo(x, 0);
    this._context.lineTo(x, this._context.canvas.height);
  }
  
  for (var i=0; i<Game.SIZE+1; i++) { // vodorovne ciary
    var y = this.LINE/2 + i*this.CELL;
    // definuje pohyb virtualneho pera - vodorovne usecky
    this._context.moveTo(0, y);
    this._context.lineTo(this._context.canvas.width, y);
  }
  
  this._context.stroke(); // zobraz nadefinovane krivky - usecky
}

// -------------------------------
// Vykresli vsetky bunky s atomami
// -------------------------------
Draw.prototype._cells = function() {

  for (var i=0; i<Game.SIZE; i++) {
    for (var j=0; j<Game.SIZE; j++) {
       this._cell(i, j, Board._data[i][j].atoms); // vykresli atomy v danej bunke
    }
  }
}

// -------------------------------
// Vykresli jednu bunku s atomami
// @param xy - suradnice x,y v hracom poli
// @param atoms - pocet atomov
// @param player - instancia Player
// -------------------------------
Draw.prototype.cell = function(xy, atoms, player) {
  // najskor premazat bielou
  var size = this.CELL - this.LINE;
  var offset = new XY(this.LINE, this.LINE);
  // var top = y*this.CELL + this.LINE;
  // prevod na pixely - nasobenim velkostou bunky a pripocitanim hrubky ciary
  var leftTop = xy.multiply(this.CELL).add(offset);

  this._context.fillStyle = "#fff";
  this._context.fillRect(leftTop.x, leftTop.y, size, size);
  
  // zisti pocet atomov
  if (!atoms) { return; }
 
  // zisti hraca (farbu)
  var color = player.getColor();

  // vykresli atomy v jednej bunke
  var positions = this.POSITIONS[atoms];
  
  for (var i=0; i<positions.length; i++) {
    var position = positions[i];
    var posX = position[0];
    var posY = position[1];
    // var atomX = (x + posX) * this.CELL;
    // var atomY = (y + posY) * this.CELL;
    // this._atom(atomX, atomY, color);
    var pxy = new XY(posX, posY);
    var atom = pxy.add(xy).multiply(this.CELL);
    this._atom(atom, color);
  } 
}

// -------------------------------
// Vykresli jeden atom
// @param x - pozicia x v canvase
// @param y - pozicia y v canvase
// -------------------------------
Draw.prototype._atom = function(xy, color) {

  this._context.beginPath();
  
  this._context.moveTo(xy.x+this.ATOM, xy.y);
  this._context.arc(xy.x, xy.y, this.ATOM, 0, 2*Math.PI, false);
  
  this._context.fillStyle = color;
  this._context.fill();
  this._context.stroke(); // zobraz nadefinovanu krivku - kruh
}

// ----------------------------------------------------
// Prevod pozicie kurzora po kliknuti, na suradnice bunky
// @param cursor - suradnica kurzora - objekt XY
// @return - suradnice hracieho pola
// ----------------------------------------------------
Draw.prototype.getPosition = function(cursor) {
  // urci suradnice viewportu - okna s aktualnou strankou
  // suradnice maju pociatok v lavom hornom rohu
  var rectangle = this._context.canvas.getBoundingClientRect();
  // transformuj suradnice
  cursor.x -= rectangle.left;
  cursor.y -= rectangle.top;
  
  if (cursor.x < 0 || cursor.x > rectangle.width) { return null; }
  if (cursor.y < 0 || cursor.y > rectangle.height) { return null; }
  // transformovane suradnice vydel rozmerom bunky a zaokrukli dole

  return cursor.divide(this.CELL);
}







// ---------------------------------------------------------------------------

/*
// --------------------------------------------
// VERZIA 0
// Vykresli hraciu dosku (tabulku) aj s atomami
// --------------------------------------------
Draw.all = function() {
  var html = "<table>";
  for (var i=0; i<Board.length; i++) {
    html += "<tr>";
    for (var j=0; j<Board.length; j++) {
      html += "<td>";
      html += Draw.atoms(Board[j][i]);
      html += "</td>";
    }
    html += "</tr>";
  }
  html += "</table>";
  
  document.body.innerHTML = html;
}

// ---------------------------
// Vykresli atomy
// @param count - pocet atomov
// @return - retazec s atomami
// ---------------------------

Draw.atoms = function(count) {
  var result = "";
  for (var i=0; i<count; i++) {
    result += "o";
  }
  return result;
}

// ----------------------------------------------------
// Vrat suradnice hracieho pola uzla na ktory sa kliklo
// @param node - node element na ktory sa kliklo
// @return - suradnice hracieho pola
// ----------------------------------------------------
Draw.getPosition = function(node) {
  if (node.nodeName != "TD") { return null; }
  
  var x=0;
  while (node.previousSibling) {
    x++;
    node = node.previousSibling;
  }
  
  var row = node.parentNode;
  var y=0;
  while (row.previousSibling) {
    y++;
    row = row.previousSibling;
  }
  alert ([x, y]);
  return [x, y];
}
*/