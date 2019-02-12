const { Canvas } = require('./Canvas');
const { Pixer } = require('./Pixer');
const { randomInt } = require('./utils');

const settings = require('./settings.json');

const start = Date.now();
console.log('Starting...');

const canvas = new Canvas(settings.canvasWidth, settings.canvasHeight);

const pixers = [];
for (let i = 0; i < settings.pixerCount; i++) {
  const x = randomInt(0, settings.canvasWidth);
  const y = randomInt(0, settings.canvasHeight);

  let r, g, b;
  if (settings.colorPalette && settings.colorPalette.length) {
    const colorIndex = randomInt(0, settings.colorPalette.length - 1);
    [r, g, b] = settings.colorPalette[colorIndex];
  } else {
    [r, g, b] = [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
  }

  pixers.push(new Pixer(canvas, x, y, r, g, b));
}

let frameCount = 0;

while (true) {
  pixers.forEach(pixer => pixer.takeStep());

  frameCount++;

  if (settings.untilFilled && canvas.filled) break;
  if (settings.maxFrames && frameCount > settings.maxFrames) break;
}

canvas.saveToFile(`out/test-${start}.png`);

const seconds = (Date.now() - start) / 1000;
console.log(`Done in ${seconds}s (${frameCount} frames).`);
