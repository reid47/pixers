const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const settings = {
  canvasWidth: 640,
  canvasHeight: 480,
  maxFrames: 3,
  pixerCount: 10
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function average(x, y) {
  return Math.round((x + y) / 2);
}

function wrapAround(n, min, max) {
  if (n < min) return max;
  if (n > max) return min;
  return n;
}

function saveToPng(canvas, fileName = `test-${Date.now()}.png`) {
  const out = fs.createWriteStream(path.resolve(__dirname, fileName));
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`File '${fileName}' written.`));
}

const canvas = createCanvas(settings.canvasWidth, settings.canvasHeight);
const ctx = canvas.getContext('2d');
const canvasData = ctx.getImageData(0, 0, settings.canvasWidth, settings.canvasHeight);

class Pixer {
  constructor(x, y, r, g, b) {
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

    this.x = wrapAround(this.x, 0, settings.canvasWidth);
    this.y = wrapAround(this.y, 0, settings.canvasHeight);
  }

  paint(canvasData) {
    const index = (this.x + this.y * settings.canvasWidth) * 4;

    const currentR = canvasData.data[index + 0];
    const newR = currentR === 255 ? this.r : average(currentR, this.r);
    canvasData.data[index + 0] = this.r = newR;

    const currentG = canvasData.data[index + 1];
    const newG = currentG === 255 ? this.g : average(currentG, this.g);
    canvasData.data[index + 1] = this.g = newG;

    const currentB = canvasData.data[index + 2];
    const newB = currentB === 255 ? this.b : average(currentB, this.b);
    canvasData.data[index + 2] = this.b = newB;
  }
}

// set to white
for (let i = 0; i < canvasData.data.length; i++) canvasData.data[i] = 255;
ctx.putImageData(canvasData, 0, 0);

// initialize pixers
const pixers = [];
for (let i = 0; i < settings.pixerCount; i++) {
  const x = randomInt(0, settings.canvasWidth);
  const y = randomInt(0, settings.canvasHeight);
  const [r, g, b] = [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
  pixers.push(new Pixer(x, y, r, g, b));
}

// loop until done
let frameCount = 0;
while (true) {
  frameCount++;

  pixers.forEach(pixer => {
    pixer.takeStep();
    pixer.paint(canvasData);
  });

  if (frameCount > settings.maxFrames) break;
}

ctx.putImageData(canvasData, 0, 0);
saveToPng(canvas);
