// objekt Player pre pracu so vstupom od uzivatela

// konstruktor potomka - Player.Human
Player.Human = function(name, color) {
  // zavolaj konstruktor predka
  Player.call(this, name, color);
}

// prototypove prepojenie Player.AI.prototype a Player.prototype
// nastav potomkov prototyp na prototyp predka 
Player.Human.prototype = Object.create(Player.prototype);

Player.Human.prototype.play = function(board, draw, callback) {
  this._callback = callback;
  this._draw = draw;
  document.body.addEventListener("click", this);
}

// premenovana metoda player.click, aby sa dalo pristupovat k objektu
// posielanom v addEventListener a removeEventListener. Pri vyvolani
// udalosti sa na tomto objekte vyvola metoda s preddefinovanym nazvom
// handleEvent (a this v nej bude zodpovedat objedktu predanemu ako posluchac)
Player.Human.prototype.handleEvent = function(e) {
  var cursor = new XY(e.clientX, e.clientY);
  var position = this._draw.getPosition(cursor);
  if(!position) { return; }

  document.body.removeEventListener("click", this);

  this._callback(position);
 }