const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.filled = false;
    this.setPixels = new Set();

    this.data = Array(width);
    for (let x = 0; x < width; x++) {
      this.data[x] = Array(height);
      for (let y = 0; y < height; y++) {
        this.data[x][y] = [255, 255, 255, false];
      }
    }
  }

  getPixel(x, y) {
    return this.data[x][y];
  }

  setPixel(x, y, r, g, b) {
    this.data[x][y] = [r, g, b, true];

    this.setPixels.add(`${x}-${y}`);

    if (this.setPixels.size === this.width * this.height) {
      this.filled = true;
    }
  }

  saveToFile(fileName = `test-${Date.now()}.png`) {
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');
    const canvasData = ctx.getImageData(0, 0, this.width, this.height);

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const [r, g, b] = this.data[x][y];
        const index = (x + y * this.width) * 4;

        canvasData.data[index + 0] = r;
        canvasData.data[index + 1] = g;
        canvasData.data[index + 2] = b;
        canvasData.data[index + 3] = 255; // alpha
      }
    }

    ctx.putImageData(canvasData, 0, 0);

    const out = fs.createWriteStream(path.resolve(__dirname, fileName));
    canvas.createPNGStream().pipe(out);
    out.on('finish', () => console.log(`File '${fileName}' written.`));
  }
}

module.exports.Canvas = Canvas;
