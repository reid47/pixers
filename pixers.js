function el(selector) {
  return document.querySelector(selector);
}

function els(selector) {
  return document.querySelectorAll(selector);
}

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function rgb(r, g, b) {
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function addPaletteColor(r, g, b) {
  colorPalette.push({r: r, g: g, b: b});

  const paletteEl = el('#color-palette');
  const newBox = document.createElement('div');
  newBox.className = 'color-palette-item';
  newBox.style.backgroundColor = rgb(r, g, b);
  paletteEl.appendChild(newBox);
}

let acrossCount;
let downCount;
let rInput;
let gInput;
let bInput;
let colordisplay;
let framecounter = el('#framecounter');
let canvas = el('#canvas');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let ctx = canvas.getContext('2d');
let canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
let timer;
let frameCount = 0;
let playing = true;
let controlsShown = false;
let infoBoxShown = false;
let randomPlacement = true;
let editingColor = '';
let maxX = canvasWidth - 1;
let minX = 0;
let maxY = canvasHeight - 1;
let minY = 0;
let pixersInRow = randomInt(1, 50);
let pixersInCol = randomInt(1, 50);
let colorPalette = [];
let numColors;
let pixers = [];
let numPixers = pixersInRow * pixersInCol;
let spaceBetweenPixersX = calculateSpacing(pixersInRow, canvasWidth);
let spaceBetweenPixersY = calculateSpacing(pixersInCol, canvasHeight);

window.onload = function go() {
  setToWhite();

  document.body.addEventListener('click', loadColorForEditing, false);

  acrossCount = el('#pixers_across');
  downCount = el('#pixers_down');
  acrossCount.addEventListener('input', updatePixerCount);
  downCount.addEventListener('input', updatePixerCount);
  acrossCount.addEventListener('blur', function() {
    if (isNaN(parseInt(el('#pixers_across').value, 10))) {
      el('#pixers_across').value = 1;
    } else if (parseInt(el('#pixers_across').value, 10) < 0) {
      el('#pixers_across').value = 1;
    } else if (parseInt(el('#pixers_across').value, 10) > 600) {
      el('#pixers_across').value = 600;
    }
    pixersInRow = newPxAcross;
    pixersInCol = newPxDown;
  });

  downCount.addEventListener('blur', function() {
    if (isNaN(parseInt(el('#pixers_down').value, 10))) {
      el('#pixers_down').value = 1;
    } else if (parseInt(el('#pixers_down').value, 10) < 0) {
      el('#pixers_down').value = 1;
    } else if (parseInt(el('#pixers_down').value, 10) > 400) {
      el('#pixers_down').value = 400;
    }
    pixersInRow = newPxAcross;
    pixersInCol = newPxDown;
  });

  rInput = el('#color_r');
  gInput = el('#color_g');
  bInput = el('#color_b');
  colordisplay = el('#colordisplay');

  rInput.addEventListener('input', editColor);
  rInput.addEventListener('blur', function() {
    if (rInput.value == '')
      rInput.value = 0;
  });

  gInput.addEventListener('input', editColor);
  gInput.addEventListener('blur', function() {
    if (gInput.value == '')
      gInput.value = 0;
  });

  bInput.addEventListener('input', editColor);
  bInput.addEventListener('blur', function() {
    if (bInput.value == '')
      bInput.value = 0;
  });

  initializeColorPalette();
  initializePixers();
  updateControlPanel();

  loop();
}

function loop() {
  clearTimeout(timer);

  if (playing) {
    for (let x = 0; x < numPixers; x++) {
      pixers[x].takeStep();
    }
    updateCanvas();

    framecounter.innerHTML = frameCount;
    frameCount++;
  }

  timer = setTimeout('loop()', 1);
}

function initializeColorPalette() {
  numColors = randomInt(2, 9);
  colorPalette = [];

  for (let c = 0; c < numColors; c++) {
    const r = randomInt(0, 255);
    const g = randomInt(0, 255);
    const b = randomInt(0, 255);

    addPaletteColor(r, g, b);
  }
}

function initializePixersToControls() {
  numPixers = pixersInCol * pixersInRow;
  spaceBetweenPixersX = calculateSpacing(pixersInRow, canvasWidth);
  spaceBetweenPixersY = calculateSpacing(pixersInCol, canvasHeight);
  numColors = colorPalette.length;
  pixers = [];
  let row = -1;
  for (let i = 0; i < numPixers; i++) {
    colorSwitch = Math.floor(Math.random() * numColors);

    let col = i % pixersInRow;
    if (col === 0) { row++; }

    theR = colorPalette[colorSwitch].r;
    theG = colorPalette[colorSwitch].g;
    theB = colorPalette[colorSwitch].b;

    if (randomPlacement) {
      theX = randomInt(0, canvasWidth);
      theY = randomInt(0, canvasHeight);
    } else {
      theX = spaceBetweenPixersX * col + Math.round((spaceBetweenPixersX / 2));
      theY = spaceBetweenPixersY * row + Math.round((spaceBetweenPixersY / 2));
    }

    pixers[i] = new Pixer(theX, theY, theR, theG, theB, 255);
  }
}

function initializePixers() {
  let colorSwitch = 0;
  let row = -1;
  pixers = [];
  randomPlacement = randomInt(0, 1);
  for (let i = 0; i < numPixers; i++) {
    colorSwitch = Math.floor(Math.random() * numColors);

    let col = i % pixersInRow;
    if (col == 0) { row++; }

    theR = colorPalette[colorSwitch].r;
    theG = colorPalette[colorSwitch].g;
    theB = colorPalette[colorSwitch].b;

    if (randomPlacement) {
      theX = randomInt(0, canvasWidth);
      theY = randomInt(0, canvasHeight);
    } else {
      theX = spaceBetweenPixersX * col + Math.round((spaceBetweenPixersX/2));
      theY = spaceBetweenPixersY * row + Math.round((spaceBetweenPixersY/2));
    }

    pixers[i] = new Pixer(theX, theY, theR, theG, theB, 255);
  }
}

function choosePreset(preset) {
  colorPalette = [];
  switch (preset) {
    case 'simple':
      numColors = 6;
      pixersInRow = 20;
      pixersInCol = 20;
      randomPlacement = false;
      colorPalette[0] = {r: 255, g: 0, b: 0};
      colorPalette[1] = {r: 0, g: 255, b: 0};
      colorPalette[2] = {r: 0, g: 0, b: 255};
      colorPalette[3] = {r: 255, g: 255, b: 0};
      colorPalette[4] = {r: 255, g: 0, b: 255};
      colorPalette[5] = {r: 0, g: 255, b: 255};
      break;
    case 'lines':
      numColors = 6;
      pixersInRow = 200;
      pixersInCol = 3;
      randomPlacement = false;
      colorPalette[0] = {r: 255, g: 0, b: 0};
      colorPalette[1] = {r: 0, g: 255, b: 0};
      colorPalette[2] = {r: 0, g: 0, b: 255};
      colorPalette[3] = {r: 255, g: 255, b: 0};
      colorPalette[4] = {r: 255, g: 0, b: 255};
      colorPalette[5] = {r: 0, g: 255, b: 255};
      break;
    case 'clouds':
      numColors = 5;
      pixersInRow = 24;
      pixersInCol = 12;
      randomPlacement = true;
      colorPalette[0] = {r: 2, g: 10, b: 181};
      colorPalette[1] = {r: 250, g: 250, b: 255};
      colorPalette[2] = {r: 200, g: 200, b: 255};
      colorPalette[3] = {r: 5, g: 50, b: 255};
      colorPalette[4] = {r: 220, g: 230, b: 255};
      break;
    case 'trees':
      numColors = 5;
      pixersInRow = 4;
      pixersInCol = 120;
      randomPlacement = false;
      colorPalette[0] = {r: 0, g: 200, b: 0};
      colorPalette[1] = {r: 150, g: 100, b: 0};
      colorPalette[2] = {r: 70, g: 50, b: 0};
      colorPalette[3] = {r: 55, g: 115, b: 0};
      colorPalette[4] = {r: 100, g: 50, b: 0};
      break;
    case 'fire':
      numColors = 6;
      pixersInRow = 40;
      pixersInCol = 40;
      randomPlacement = true;
      colorPalette[0] = {r: 220, g: 0, b: 0};
      colorPalette[1] = {r: 240, g: 200, b: 0};
      colorPalette[2] = {r: 210, g: 100, b: 0};
      colorPalette[3] = {r: 80, g: 0, b: 0};
      colorPalette[4] = {r: 255, g: 255, b: 0};
      colorPalette[5] = {r: 150, g: 0, b: 0};
      break;
    case 'twotone':
      numColors = 2;
      pixersInRow = 30;
      pixersInCol = 30;
      randomPlacement = true;
      colorPalette[0] = {r: 55, g: 255, b: 0};
      colorPalette[1] = {r: 220, g: 0, b: 220};
      break;
    case 'horizon':
      numColors = 4;
      pixersInRow = 500;
      pixersInCol = 1;
      randomPlacement = false;
      colorPalette[0] = {r: 55, g: 25, b: 0};
      colorPalette[1] = {r: 180, g: 255, b: 100};
      colorPalette[2] = {r: 255, g: 20, b: 30};
      colorPalette[3] = {r: 0, g: 255, b: 255};
  }
  updateControlPanel();
}

function randomizeAll() {
  numColors = randomInt(2, 9);
  colorPalette = [];
  for (let c = 0; c < numColors; c++) {
    addPaletteColor(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
  }
  randomPlacement = Math.floor(Math.random() * 2);
  pixersInRow = randomInt(1, 100);
  pixersInCol = randomInt(1, 100);
  updateControlPanel();
}

function updatePixerCount() {
  const acrossInp = el('#pixers_across');
  const downInp = el('#pixers_down');
  const newPxAcross = parseInt(el('#pixers_across').value, 10);
  const newPxDown = parseInt(el('#pixers_down').value, 10);

  if (newPxAcross < 0) {
    acrossInp.value = 1;
  } else if (newPxAcross > 600) {
    acrossInp.value = 600;
  } else if (newPxDown < 0) {
    downInp.value = 1;
  } else if (newPxDown > 400) {
    downInp.value = 400;
  } else {
    pixersInRow = newPxAcross;
    pixersInCol = newPxDown;
  }
}

function editColor() {
  if (editingColor != '') {
    if (parseInt(rInput.value, 10) < 0 || isNaN(rInput.value)) {
        rInput.value = 0;
      } else if (parseInt(rInput.value, 10) > 255) {
        rInput.value = 255;
    }
    if (parseInt(gInput.value, 10) < 0 || isNaN(gInput.value)) {
      gInput.value = 0;
      } else if (parseInt(gInput.value, 10) > 255) {
      gInput.value = 255;
    }
    if (parseInt(bInput.value, 10) < 0 || isNaN(bInput.value)) {
      bInput.value = 0;
    } else if (parseInt(bInput.value, 10) > 255) {
      bInput.value = 255;
    }
    let colorIndex = parseInt(editingColor.charAt(5), 10);
    colorPalette[colorIndex].g = parseInt(gInput.value, 10);
    colorPalette[colorIndex].b = parseInt(bInput.value, 10);
    colorPalette[colorIndex].r = parseInt(rInput.value, 10);
    let newbg = 'rgb(' + rInput.value + ',' + gInput.value + ',' + bInput.value + ')';
    el('#' + editingColor).style.background = newbg;
    colordisplay.style.backgroundColor = newbg;
  }
}

function addColor() {
  if (colorPalette.length < 10) {
    const i = colorPalette.length;
    colorPalette[i] = {r: 255, g: 255, b: 255};
    el('#color' + i).className = 'colorpalette_box active';
    el('#color' + i).style.backgroundColor = 'rgb(255, 255, 255)';
    editingColor = 'color' + i;
  }
}

function removeColor() {
  if (editingColor != '') {
    const colorIndex = parseInt(editingColor.charAt(5), 10);
    if (colorPalette.length == 1) {
      colorPalette = [];
      updateControlPanel();
    } else {
      colorPalette.splice(colorIndex, 1);
      editingColor = '';
      updateControlPanel();
    }
  }
}

function setPosition(position) {
  if (position === 'random') {
    randomPlacement = true;
    addClass(el('#position_random'), 'active');
    removeClass(el('#position_even'), 'active');
  } else if (position === 'even') {
    randomPlacement = false;
    addClass(el('#position_even'), 'active');
    removeClass(el('#position_random'), 'active');
  }
}

function updateControlPanel() {
  el('#pixers_across').value = pixersInRow;
  el('#pixers_down').value = pixersInCol;

  if (randomPlacement) {
    addClass(el('#position_random'), 'active');
    removeClass(el('#position_even'), 'active');
  } else {
    addClass(el('#position_even'), 'active');
    removeClass(el('#position_random'), 'active');
  }
}

function loadColorForEditing(evt) {
  if (!evt || !evt.target) return;

  const target = evt.target;

  const boxes = els('.color-palette-item');
  for (let b = 0; b < boxes.length; b++) {
    removeClass(boxes[b], 'editing');
  }

  if (target.classList.contains('color-palette-item')) {
    addClass(target, 'editing');
  }

  // if (target.className.match(/empty/)) {
  //   editingColor = '';
  //   rInput.value = '';
  //   gInput.value = '';
  //   bInput.value = '';
  //   el('#colordisplay').style.backgroundColor = '#cacaca';
  //   el('#colordisplay').innerHTML = 'select palette color to edit';
  // } else if (target.className.match(/colorinput/)) {
  //   el('#' + editingColor).className = 'colorpalette_box active';
  //   return;
  // } else if (target.className.match(/colorpalette_box/)) {
  //   target.className = target.className+' active';
  //   let id = target.getAttribute('id');
  //   editingColor = id;
  //   let colorIndex = parseInt(editingColor.charAt(5), 10);
  //   rInput.value = colorPalette[colorIndex].r;
  //   gInput.value = colorPalette[colorIndex].g;
  //   bInput.value = colorPalette[colorIndex].b;
  //   let thisColor = 'rgb(' + colorPalette[colorIndex].r + ',' + colorPalette[colorIndex].g + ',' + colorPalette[colorIndex].b + ')';
  //   el('#colordisplay').style.backgroundColor = thisColor;
  //   el('#colordisplay').innerHTML = 'now editing ' + id;
  // } else {
  //   editingColor = '';
  //   rInput.value = '';
  //   gInput.value = '';
  //   bInput.value = '';
  //   el('#colordisplay').style.backgroundColor = '#cacaca';
  //   el('#colordisplay').innerHTML = 'select palette color to edit';
  // }
}

function clearCanvas() {
  playing = false;
  el('#pausetxt').innerHTML = 'start';
  frameCount = 0;
  framecounter.innerHTML = frameCount;
  setToWhite();
}

function restartDrawing() {
  playing = false;
  frameCount = 0;
  framecounter.innerHTML = frameCount;
  setToWhite();
  initializePixersToControls();
  playing = true;
}

function calculateSpacing(num, total) {
  return Math.round(total / num);
}

function setToWhite() {
  for (let i = 0; i < canvasData.data.length; i++) {
    canvasData.data[i] = 255;
  }

  updateCanvas();
}

function togglePlay() {
  playing = !playing;

  el('#pausetxt').innerHTML = !playing ? 'resume' : 'pause';
}

function updateCanvas() {
  ctx.putImageData(canvasData, 0, 0);
}

function toggleInfoBox() {
  infoBoxShown = !infoBoxShown;

  el('#toggle-info').innerHTML = infoBoxShown ? 'okay, got it' : 'what is this?';
  el('#infobox').style.display = infoBoxShown ? 'block' : 'none';
}

function Pixer(x, y, r, g, b, a) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
}

Pixer.prototype.takeStep = function() {
  const dir = Math.floor(Math.random() * 8);

  switch(dir) {
    case 0: this.x++; this.y--; break;
    case 1: this.x++; break;
    case 2: this.x++; this.y++; break;
    case 3: this.y++; break;
    case 4: this.x--; this.y++; break;
    case 5: this.x--; break;
    case 6: this.x--; this.y--; break;
    case 7: this.y--; break;
  }

  if (this.x < minX) {
    this.x = maxX;
  } else if (this.x > maxX) {
    this.x = minX;
  }

  if (this.y < minY) { this.y = maxY; }
  else if (this.y > maxY) { this.y = minY; }

  this.colorPixel(this.x, this.y, this.r, this.g, this.b, this.a);
}

Pixer.prototype.colorPixel = function(x, y, r, g, b, a) {
  const index = (x + y * canvasWidth) * 4;

  if (canvasData.data[index + 0] == 255 && canvasData.data[index + 1] == 255 && canvasData.data[index + 2] == 255) {
    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
  } else if (canvasData.data[index + 0] == r && canvasData.data[index + 1] == g && canvasData.data[index + 2] == b) {
    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
  } else {
    canvasData.data[index + 0] = Math.round((canvasData.data[index + 0] + r) / 2);
    canvasData.data[index + 1] = Math.round((canvasData.data[index + 1] + g) / 2);
    canvasData.data[index + 2] = Math.round((canvasData.data[index + 2] + b) / 2);
  }

  this.r = Math.round((canvasData.data[index + 0] + r) / 2);
  this.g = Math.round((canvasData.data[index + 1] + g) / 2);
  this.b = Math.round((canvasData.data[index + 2] + b) / 2);
}
