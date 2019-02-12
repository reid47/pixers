const { Canvas } = require('./Canvas');
const { Pixer } = require('./Pixer');
const { randomInt } = require('./utils');

function run(settings) {
  console.log(`Starting with settings: ${JSON.stringify(settings, null, 2)}`);

  const start = Date.now();

  const canvas = new Canvas(settings.width, settings.height);
  const pixers = [];

  for (let i = 0; i < settings.number; i++) {
    const x = randomInt(0, settings.width);
    const y = randomInt(0, settings.height);

    let r, g, b;
    if (settings.colors && settings.colors.length) {
      const colorIndex = randomInt(0, settings.colors.length - 1);
      [r, g, b] = settings.colors[colorIndex];
    } else {
      [r, g, b] = [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
    }

    pixers.push(new Pixer(canvas, x, y, r, g, b));
  }

  let frameCount = 0;

  while (true) {
    pixers.forEach(pixer => pixer.takeStep());

    frameCount++;

    if (settings.fill && canvas.filled) break;
    if (settings.max && frameCount > settings.max) break;
  }

  canvas.saveToFile(`../out/test-${start}.png`);

  const seconds = (Date.now() - start) / 1000;
  console.log(`Done in ${seconds}s (${frameCount} frames).`);
}

module.exports.run = run;
