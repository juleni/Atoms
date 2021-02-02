// abstraktny objekt Player pre pracu so vstupom od vseobecneho hraca - ai, human, ...

// kazdy hrac potrebuje meno a farbu, v ramci svojej konstrukcie 
// vyraba riadok textu a vklada ho do stranky
var Player = function(name, color) {
  this._color = color;
  this._name = name;

  this._score = document.createElement("span");

  var node = document.createElement("p");
  node.style.color = color;
  node.appendChild(document.createTextNode(name + ": "));
  node.appendChild(this._score);
  document.body.appendChild(node);
}

// vrat farbu hraca
Player.prototype.getColor = function() {
  return this._color;
}

// vrat meno hraca
Player.prototype.getName = function() {
  return this._name;
}

// nastav skore hraca
Player.prototype.setScore = function(score) {
  this._score.innerHTML = score;
}

// vyzva ku hre
Player.prototype.play = function(board, draw, callback) {
}