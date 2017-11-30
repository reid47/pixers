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

function show(element) {
  removeClass(element, 'hidden');
}

function hide(element) {
  addClass(element, 'hidden');
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function rgb(r, g, b) {
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function normalizeInputValue(input, min, max) {
  if (parseInt(input.value, 10) < min || isNaN(input.value)) {
    input.value = min;
    return min;
  } else if (parseInt(input.value, 10) > max) {
    input.value = max;
    return max;
  }

  return parseInt(input.value, 10);
}

let acrossCount;
let downCount;
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
let editingPaletteIndex = -1;
let maxX = canvasWidth - 1;
let minX = 0;
let maxY = canvasHeight - 1;
let minY = 0;
let pixersInRow = randomInt(1, 50);
let pixersInCol = randomInt(1, 50);
let colorPalette = [];
let pixers = [];
let numPixers = pixersInRow * pixersInCol;
let spaceBetweenPixersX = calculateSpacing(pixersInRow, canvasWidth);
let spaceBetweenPixersY = calculateSpacing(pixersInCol, canvasHeight);

function addPaletteColor(r, g, b, index) {
  if (colorPalette.length >= 10) return;

  colorPalette.push({r: r, g: g, b: b});

  const paletteEl = el('#color-palette');
  const newBox = document.createElement('div');
  newBox.className = 'color-palette-item';
  newBox.tabIndex = colorPalette.length === 1 ? 0 : -1;
  newBox.style.backgroundColor = rgb(r, g, b);
  newBox.dataset.r = r;
  newBox.dataset.g = g;
  newBox.dataset.b = b;
  newBox.dataset.paletteIndex = index > 0 ? index : colorPalette.length - 1;
  newBox.addEventListener('focus', onPaletteColorFocus);
  newBox.addEventListener('blur', onPaletteColorBlur);
  newBox.addEventListener('keydown', onPaletteColorKey);

  paletteEl.appendChild(newBox);
}

function onPaletteColorFocus(evt) {
  editingPaletteIndex = -1;
  const boxes = els('.color-palette-item');
  for (let b = 0; b < boxes.length; b++) {
    removeClass(boxes[b], 'editing');
  }

  addClass(evt.target, 'editing');
  el('#color_r').value = evt.target.dataset.r;
  el('#color_g').value = evt.target.dataset.g;
  el('#color_b').value = evt.target.dataset.b;
  editingPaletteIndex = evt.target.dataset.paletteIndex;
  el('#editing-color-index').innerHTML = editingPaletteIndex;
  show(el('#color-editor'));
}

function onPaletteColorBlur(evt) {
  if (evt.relatedTarget &&
    (evt.relatedTarget.classList.contains('colorinput')
      || evt.relatedTarget.getAttribute('id') === 'remove-color')) return;

  editingPaletteIndex = -1;
  const boxes = els('.color-palette-item');
  for (let b = 0; b < boxes.length; b++) {
    removeClass(boxes[b], 'editing');
  }

  hide(el('#color-editor'));
}

function onPaletteColorKey(evt) {
  const key = evt.keyCode || evt.which;

  let nextFocusedElement;

  if (key === 37 /*left*/) {
    if (evt.target) {
      console.log(evt.target)
      nextFocusedElement = evt.target.previousElementSibling
        || evt.target.parentNode.lastElementChild;
    }
  } else if (key === 39 /*right*/) {
    if (evt.target) {
      nextFocusedElement = evt.target.nextElementSibling
        || evt.target.parentNode.firstElementChild;
    }
  }

  if (nextFocusedElement) {
    evt.target.tabIndex = -1;
    nextFocusedElement.tabIndex = 0;
    nextFocusedElement.focus();
  }
}

window.onload = function go() {
  setToWhite();

  acrossCount = el('#pixers_across');
  downCount = el('#pixers_down');
  acrossCount.addEventListener('input', updatePixerCount);
  downCount.addEventListener('input', updatePixerCount);

  acrossCount.addEventListener('blur', function() {
    pixersInRow = normalizeInputValue(el('#pixers_across'), 1, 600);
  });

  downCount.addEventListener('blur', function() {
    pixersInCol = normalizeInputValue(el('#pixers_down'), 1, 600);
  });

  el('#color_r').addEventListener('input', editColor);
  el('#color_r').addEventListener('blur', function() {
    normalizeInputValue(el('#color_r'), 0, 255);
  });

  el('#color_g').addEventListener('input', editColor);
  el('#color_g').addEventListener('blur', function() {
    normalizeInputValue(el('#color_g'), 0, 255);
  });

  el('#color_b').addEventListener('input', editColor);
  el('#color_b').addEventListener('blur', function() {
    normalizeInputValue(el('#color_b'), 0, 255);
  });

  el('#remove-color').addEventListener('blur', onPaletteColorBlur);

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

    ctx.putImageData(canvasData, 0, 0);

    framecounter.innerHTML = frameCount;
    frameCount++;
  }

  timer = setTimeout('loop()', 1);
}

function initializeColorPalette() {
  const numColors = randomInt(2, 9);
  colorPalette = [];

  for (let c = 0; c < numColors; c++) {
    const r = randomInt(0, 255);
    const g = randomInt(0, 255);
    const b = randomInt(0, 255);

    addPaletteColor(r, g, b, c);
  }
}

function initializePixersToControls() {
  numPixers = pixersInCol * pixersInRow;
  spaceBetweenPixersX = calculateSpacing(pixersInRow, canvasWidth);
  spaceBetweenPixersY = calculateSpacing(pixersInCol, canvasHeight);
  pixers = [];
  let row = -1;
  for (let i = 0; i < numPixers; i++) {
    colorSwitch = Math.floor(Math.random() * colorPalette.length);

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
    colorSwitch = Math.floor(Math.random() * colorPalette.length);

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
  pixersInRow = presets[preset].pixersInRow;
  pixersInCol = presets[preset].pixersInCol;
  randomPlacement = presets[preset].randomPlacement;
  colorPalette = presets[preset].colorPalette.map(p => ({
    r: p.r,
    g: p.g,
    b: p.b
  }));

  updateControlPanel();
  el('#color-palette').innerHTML = '';
  for (let c = 0; c < colorPalette.length; c++) {
    addPaletteColor(
      colorPalette[c].r,
      colorPalette[c].g,
      colorPalette[c].b,
      c);
  }
}

function randomizeAll() {
  const newNumColors = randomInt(2, 9);
  colorPalette = [];

  el('#color-palette').innerHTML = '';
  for (let c = 0; c < newNumColors; c++) {
    addPaletteColor(
      randomInt(0, 255),
      randomInt(0, 255),
      randomInt(0, 255),
      c);
  }

  randomPlacement = Math.floor(Math.random() * 2);
  pixersInRow = randomInt(1, 100);
  pixersInCol = randomInt(1, 100);
  updateControlPanel();
}

function updatePixerCount() {
  const newPxAcross = parseInt(el('#pixers_across').value, 10);
  const newPxDown = parseInt(el('#pixers_down').value, 10);

  if (newPxAcross < 0) {
    el('#pixers_across').value = 1;
  } else if (newPxAcross > 600) {
    el('#pixers_across').value = 600;
  } else if (newPxDown < 0) {
    el('#pixers_down').value = 1;
  } else if (newPxDown > 400) {
    el('#pixers_down').value = 400;
  } else {
    pixersInRow = newPxAcross;
    pixersInCol = newPxDown;
  }
}

function editColor() {
  if (editingPaletteIndex > -1) {
    const newR = normalizeInputValue(el('#color_r'), 0, 255);
    const newG = normalizeInputValue(el('#color_g'), 0, 255);
    const newB = normalizeInputValue(el('#color_b'), 0, 255);

    colorPalette[editingPaletteIndex].r = newR;
    colorPalette[editingPaletteIndex].g = newG;
    colorPalette[editingPaletteIndex].b = newB;

    const newbg = rgb(newR, newG, newB);
    el('[data-palette-index="' + editingPaletteIndex + '"]').style.background = newbg;
  }
}

function removePaletteColor() {
  if (editingPaletteIndex > -1) {
    if (colorPalette.length === 1) {
      colorPalette = [];
    } else {
      colorPalette.splice(editingPaletteIndex, 1);
    }

    const oldPalette = colorPalette;
    colorPalette = [];
    editingPaletteIndex = -1;
    el('#color-palette').innerHTML = '';
    for (let c = 0; c < oldPalette.length; c++) {
      addPaletteColor(
        oldPalette[c].r,
        oldPalette[c].g,
        oldPalette[c].b,
        c);
    }
    hide(el('#color-editor'));
    el('#add-color').focus();
    updateControlPanel();
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

  ctx.putImageData(canvasData, 0, 0);
}

function togglePlay() {
  playing = !playing;

  el('#pausetxt').innerHTML = !playing ? 'resume' : 'pause';
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
