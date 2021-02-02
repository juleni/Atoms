// objekt Base pre ukladanie a pracu so suradnicami
// vyuziva sa tu prototypova dedicnost

// metoda v prototype
var Base = {
  // spolocna metoda na pripocitanie suradnic
  add: function(other) {
      return XY(this.x + other.x, this.y + other.y);
  }
}

// nastav suradnice
// vyuzitie prototypovej dedicnosti
var XY = function(x, y) {
    var result = Object.create(Base);
    result.x = x;
    result.y = y;
}