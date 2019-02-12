class Pixer {
  constructor(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
  }

  takeStep() {
    const dir = Math.floor(Math.random() * 8);

    switch (dir) {
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

    if (this.x < minX) {
      this.x = maxX;
    } else if (this.x > maxX) {
      this.x = minX;
    }

    if (this.y < minY) {
      this.y = maxY;
    } else if (this.y > maxY) {
      this.y = minY;
    }

    this.colorPixel(this.x, this.y, this.r, this.g, this.b);
  }

  colorPixel(x, y, r, g, b) {
    const index = (x + y * canvasWidth) * 4;

    if (
      canvasData.data[index + 0] === 255 &&
      canvasData.data[index + 1] === 255 &&
      canvasData.data[index + 2] === 255
    ) {
      // If this pixel is all white, replace its color with my color
      canvasData.data[index + 0] = r;
      canvasData.data[index + 1] = g;
      canvasData.data[index + 2] = b;
    } else if (
      canvasData.data[index + 0] === r &&
      canvasData.data[index + 1] === g &&
      canvasData.data[index + 2] === b
    ) {
      // If this pixel is already my color, do nothing
    } else {
      canvasData.data[index + 0] = Math.round(
        (canvasData.data[index + 0] + r) / 2
      );
      canvasData.data[index + 1] = Math.round(
        (canvasData.data[index + 1] + g) / 2
      );
      canvasData.data[index + 2] = Math.round(
        (canvasData.data[index + 2] + b) / 2
      );
    }

    this.r = Math.round((canvasData.data[index + 0] + r) / 2);
    this.g = Math.round((canvasData.data[index + 1] + g) / 2);
    this.b = Math.round((canvasData.data[index + 2] + b) / 2);
  }
}
