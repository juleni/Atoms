// trieda xy je urcena k pouzitiu s operatorom new - vytvori tak instanciu objektu
// vyuziva sa tu prototypova dedicnost


// nastav suradnice
// pokial sa pouzije klucove slovo 'new' pred volanim funkcie, dojde pred jej spustenim
// k implicitnemu vytvoreniu objektu pomocou Object.create. Prototypom bude objekt,
// ktory ma funkcie k dispozicii vo svojej vlastnosti 'prototype'. Funkcia samotna bude nasledne 
// vykonavana s klucovym slovom 'this' nastavenym na novo vzniknuty objekt (a tento bude implicitne vrateny)
var XY = function(x, y) {
    // funkciu je mozne volat bez parametrov a v pripade x,y == undefined
    // sa hodnoty suradnic nastavia na 0,0
    this.x = x || 0;
    this.y = y || 0;
}

// staticka metoda na prevod retazcoveho zapisu suradnic "x,y" do pola
XY.fromString = function(str) {
   var parts = str.split(",");
   var x = Number(parts[0]);
   var y = Number(parts[1]);
   return new this(x,y);
}

// funkcia na pripocitanie
// pokial sa pouzije klucove slovo 'new' pred volanim funkcie, dojde pred jej spustenim
// k implicitnemu vytvoreniu objektu pomocou Object.create. Prototypom bude objekt,
// ktory ma funkcie k dispozicii vo svojej vlastnosti 'prototype'. Funkcia samotna bude nasledne 
// vykonavana s klucovym slovom 'this' nastavenym na novo vzniknuty objekt (a tento bude implicitne vrateny)
XY.prototype.add = function(xy) {
  return new XY(this.x + xy.x, this.y + xy.y);
}

// funkcia na nasobenie suradnic skalarnou hodnotou
XY.prototype.multiply = function(z) {
  return new XY(this.x * z, this.y * z);
}

// funkcia na delenie suradnic skalarnou hodnotou so zaokruhlovanim nadol
XY.prototype.divide = function(z) {
  return new XY(Math.floor(this.x / z), Math.floor(this.y / z));
}

// funkcia na porovnanie suradnic
XY.prototype.equals = function(xy) {
  return (this.x == xy.x && this.y == xy.y);
}

// funkcia na vratenie retazca suradnic oddelenych ciarkou
// tato reprezentacia sa hodi pri vypisovani objektu a aj ako kluc
XY.prototype.toString = function() {
  return (this.x + ", " + this.y);
}

// --------------------------------------------------------
// Vrat pole so susediacimi bunkami k danej aktualnej bunke
// --------------------------------------------------------
XY.prototype.getNeighbours = function() {
    var results = [];
    if (  this.x > 0)         { results.push(new XY(this.x-1,   this.y)); }
    if (this.x+1 < Game.SIZE) { results.push(new XY(this.x+1,   this.y)); }
    if (  this.y > 0)         { results.push(new XY(  this.x, this.y-1)); }
    if (this.y+1 < Game.SIZE) { results.push(new XY(  this.x, this.y+1)); }
    return results;
   }
  