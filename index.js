const { Canvas } = require('./Canvas');
const { Pixer } = require('./Pixer');
const { randomInt } = require('./utils');

const settings = {
  canvasWidth: 100,
  canvasHeight: 100,
  maxFrames: Infinity,
  untilFilled: true,
  pixerCount: 3
};

const canvas = new Canvas(settings.canvasWidth, settings.canvasHeight);

const pixers = [];
for (let i = 0; i < settings.pixerCount; i++) {
  const x = randomInt(0, settings.canvasWidth);
  const y = randomInt(0, settings.canvasHeight);
  const [r, g, b] = [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
  pixers.push(new Pixer(canvas, x, y, r, g, b));
}

let frameCount = 0;

while (true) {
  pixers.forEach(pixer => pixer.takeStep());

  frameCount++;

  if (settings.untilFilled && canvas.filled) break;
  if (frameCount > settings.maxFrames) break;
}

canvas.saveToFile();
