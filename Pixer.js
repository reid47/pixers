const { randomInt, wrapAround, average } = require('./utils');

class Pixer {
  constructor(canvas, x, y, r, g, b) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  takeStep() {
    switch (randomInt(0, 7)) {
      case 0:
        this.x++;
        this.y--;
        break;
      case 1:
        this.x++;
        break;
      case 2:
        this.x++;
        this.y++;
        break;
      case 3:
        this.y++;
        break;
      case 4:
        this.x--;
        this.y++;
        break;
      case 5:
        this.x--;
        break;
      case 6:
        this.x--;
        this.y--;
        break;
      case 7:
        this.y--;
        break;
    }

    this.x = wrapAround(this.x, 0, this.canvas.width - 1);
    this.y = wrapAround(this.y, 0, this.canvas.height - 1);

    this.paint();
  }

  paint() {
    const [r, g, b, filled] = this.canvas.getPixel(this.x, this.y);

    const newR = filled ? average(r, this.r) : this.r;
    const newG = filled ? average(g, this.g) : this.g;
    const newB = filled ? average(b, this.b) : this.b;

    this.canvas.setPixel(this.x, this.y, newR, newG, newB);
  }
}

module.exports.Pixer = Pixer;
