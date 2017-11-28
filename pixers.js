function byId(id) {
	return document.getElementById(id);
}

let acrossCount;
let downCount;
let rInput;
let gInput;
let bInput;
let colordisplay;
let framecounter = byId('framecounter');
let canvas = byId('canvas');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let ctx = canvas.getContext('2d');
let canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
let timer;
let frameCount = 0;
let playing = true;
let isComplete = false;
let controlsShown = false;
let infoBoxShown = false;
let randomPlacement = true;
let editingColor = '';
let maxX = canvasWidth-1;
let minX = 0;
let maxY = canvasHeight-1;
let minY = 0;
let pixersInRow = Math.floor(Math.random()*50)+1;
let pixersInCol = Math.floor(Math.random()*50)+1;
let colorPalette = [];
let numColors;
let pixers = [];
let numPixers = pixersInRow*pixersInCol;
let spaceBetweenPixersX = calculateSpacing(pixersInRow, canvasWidth);
let spaceBetweenPixersY = calculateSpacing(pixersInCol, canvasHeight);

window.onload = function go() {
	setToWhite();

	if (document.body.addEventListener) {
		document.body.addEventListener('click', loadColorForEditing, false);
	} else {
		document.body.attachEvent('onclick', loadColorForEditing);
	}

	acrossCount = byId('pixers_across');
	downCount = byId('pixers_down');
	acrossCount.addEventListener('input', updatePixerCount);
	downCount.addEventListener('input', updatePixerCount);
	acrossCount.addEventListener('blur', function() {
		if (isNaN(parseInt(byId('pixers_across').value, 10))) {
			byId('pixers_across').value = 1;
		} else if (parseInt(byId('pixers_across').value, 10)<0) {
			byId('pixers_across').value = 1;
		} else if (parseInt(byId('pixers_across').value, 10)>600) {
			byId('pixers_across').value = 600;
		}
		pixersInRow = newPxAcross;
		pixersInCol = newPxDown;
	});
	downCount.addEventListener('blur', function() {
		if (isNaN(parseInt(byId('pixers_down').value, 10))) {
			byId('pixers_down').value = 1;
		} else if (parseInt(byId('pixers_down').value, 10) < 0) {
			byId('pixers_down').value = 1;
		} else if (parseInt(byId('pixers_down').value, 10) > 400) {
			byId('pixers_down').value = 400;
		}
		pixersInRow = newPxAcross;
		pixersInCol = newPxDown;
	});

	rInput = byId('color_r');
	gInput = byId('color_g');
	bInput = byId('color_b');
	colordisplay = byId('colordisplay');
	rInput.addEventListener('input', editColor);
	rInput.addEventListener('blur', function() {
		if (rInput.value=='')
			rInput.value = 0;
	});
	gInput.addEventListener('input', editColor);
	gInput.addEventListener('blur', function() {
		if (gInput.value=='')
			gInput.value = 0;
	});
	bInput.addEventListener('input', editColor);
	bInput.addEventListener('blur', function() {
		if (bInput.value=='')
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

		isComplete = checkForCompletion();

		if (isComplete) {
			togglePlay();
			window.location.reload();
		}
	}

	timer = setTimeout('loop()', 1);
}

function checkForCompletion() {
	for (let i = 0; i < canvasData.data.length; i += 4) {
		if (canvasData.data[i + 0] === 255 
			&& canvasData.data[i + 1] === 255 
			&& canvasData.data[i+2] === 255) {
			return false;
		}
	}

	return true;
}

function initializeColorPalette() {
	numColors = Math.floor(Math.random() * 9) + 2;
	colorPalette = [];
	for (let c = 0; c < numColors; c++) {
		let thisR = Math.floor(Math.random() * 255);
		let thisG = Math.floor(Math.random() * 255);
		let thisB = Math.floor(Math.random() * 255);
		colorPalette[c] = {'r': thisR, 'g': thisG, 'b': thisB};
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
			theX = Math.floor(Math.random() * canvasWidth);
			theY = Math.floor(Math.random() * canvasHeight);
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
	randomPlacement = Math.floor(Math.random() * 2);
	for (let i=0; i<numPixers; i++) {
		colorSwitch = Math.floor(Math.random() * numColors);

		let col = i % pixersInRow;
		if (col==0) { row++; }

		theR = colorPalette[colorSwitch].r;
		theG = colorPalette[colorSwitch].g;
		theB = colorPalette[colorSwitch].b;

		if (randomPlacement) {
			theX = Math.floor(Math.random() * canvasWidth);
			theY = Math.floor(Math.random() * canvasHeight);
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
			colorPalette[0] = {'r': 255, 'g': 0, 'b': 0};
			colorPalette[1] = {'r': 0, 'g': 255, 'b': 0};
			colorPalette[2] = {'r': 0, 'g': 0, 'b': 255};
			colorPalette[3] = {'r': 255, 'g': 255, 'b': 0};
			colorPalette[4] = {'r': 255, 'g': 0, 'b': 255};
			colorPalette[5] = {'r': 0, 'g': 255, 'b': 255};
			break;
		case 'lines':
			numColors = 6;
			pixersInRow = 200;
			pixersInCol = 3;
			randomPlacement = false;
			colorPalette[0] = {'r': 255, 'g': 0, 'b': 0};
			colorPalette[1] = {'r': 0, 'g': 255, 'b': 0};
			colorPalette[2] = {'r': 0, 'g': 0, 'b': 255};
			colorPalette[3] = {'r': 255, 'g': 255, 'b': 0};
			colorPalette[4] = {'r': 255, 'g': 0, 'b': 255};
			colorPalette[5] = {'r': 0, 'g': 255, 'b': 255};
			break;				
		case 'clouds':
			numColors = 5;
			pixersInRow = 24;
			pixersInCol = 12;
			randomPlacement = true;
			colorPalette[0] = {'r': 2, 'g': 10, 'b': 181};
			colorPalette[1] = {'r': 250, 'g': 250, 'b': 255};
			colorPalette[2] = {'r': 200, 'g': 200, 'b': 255};
			colorPalette[3] = {'r': 5, 'g': 50, 'b': 255};
			colorPalette[4] = {'r': 220, 'g': 230, 'b': 255};
			break;
		case 'trees':
			numColors = 5;
			pixersInRow = 4;
			pixersInCol = 120;
			randomPlacement = false;
			colorPalette[0] = {'r': 0, 'g': 200, 'b': 0};
			colorPalette[1] = {'r': 150, 'g': 100, 'b': 0};
			colorPalette[2] = {'r': 70, 'g': 50, 'b': 0};
			colorPalette[3] = {'r': 55, 'g': 115, 'b': 0};
			colorPalette[4] = {'r': 100, 'g': 50, 'b': 0};
			break;
		case 'fire':
			numColors = 6;
			pixersInRow = 40;
			pixersInCol = 40;
			randomPlacement = true;
			colorPalette[0] = {'r': 220, 'g': 0, 'b': 0};
			colorPalette[1] = {'r': 240, 'g': 200, 'b': 0};
			colorPalette[2] = {'r': 210, 'g': 100, 'b': 0};
			colorPalette[3] = {'r': 80, 'g': 0, 'b': 0};
			colorPalette[4] = {'r': 255, 'g': 255, 'b': 0};
			colorPalette[5] = {'r': 150, 'g': 0, 'b': 0};
			break;
		case 'twotone':
			numColors = 2;
			pixersInRow = 30;
			pixersInCol = 30;
			randomPlacement = true;
			colorPalette[0] = {'r': 55, 'g': 255, 'b': 0};
			colorPalette[1] = {'r': 220, 'g': 0, 'b': 220};
			break;
		case 'horizon':
			numColors = 4;
			pixersInRow = 500;
			pixersInCol = 1;
			randomPlacement = false;
			colorPalette[0] = {'r': 55, 'g': 25, 'b': 0};
			colorPalette[1] = {'r': 180, 'g': 255, 'b': 100};
			colorPalette[2] = {'r': 255, 'g': 20, 'b': 30};
			colorPalette[3] = {'r': 0, 'g': 255, 'b': 255};				
	}
	updateControlPanel();
}

function randomizeAll() {
	numColors = Math.floor(Math.random()*9)+2;
	colorPalette = [];
	for (let c=0; c<numColors; c++) {
		let thisR = Math.floor(Math.random()*255);
		let thisG = Math.floor(Math.random()*255);
		let thisB = Math.floor(Math.random()*255);
		colorPalette[c] = {'r': thisR, 'g': thisG, 'b': thisB};
	}
	randomPlacement = Math.floor(Math.random()*2);
	pixersInRow = Math.floor(Math.random()*100)+1;
 	pixersInCol = Math.floor(Math.random()*100)+1;
	updateControlPanel();
}

function updatePixerCount() {
	let acrossInp = byId('pixers_across');
	let downInp = byId('pixers_down');
	let newPxAcross = parseInt(byId('pixers_across').value, 10);
	let newPxDown = parseInt(byId('pixers_down').value, 10);
	if (newPxAcross<0) { acrossInp.value = 1; }
	else if (newPxAcross>600) { acrossInp.value = 600; }
	else if (newPxDown<0) { downInp.value = 1; }
	else if (newPxDown>400) { downInp.value = 400; }
	else {
		pixersInRow = newPxAcross;
		pixersInCol = newPxDown;
	}
}

function changePixerCount(dir, i) {
	let sum = 0;

	switch(dir) {
		case 'across':
			sum = parseInt(byId('pixers_across').value, 10) + i;
			if (sum > 0 && sum < 601) {
				pixersInRow = sum;
				byId('pixers_across').value = sum;
			}
			break;
		case 'down':
			sum = parseInt(byId('pixers_down').value, 10) + i;
			if (sum > 0 && sum < 401) {
				pixersInCol = sum;
				byId('pixers_down').value = sum;
			}
			break;			
	}
}

function editColor() {
	if (editingColor!='') {
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
		let newbg = 'rgb('+rInput.value+','+gInput.value+','+bInput.value+')';
		byId(editingColor).style.background = newbg;
		colordisplay.style.backgroundColor = newbg;
	}
}

function addColor() {
	if (colorPalette.length < 10) {
		let i = colorPalette.length;
		colorPalette[i] = {'r':255, 'g':255, 'b':255};
		byId('color' + i).className = 'colorpalette_box active';
		byId('color' + i).style.backgroundColor = 'rgb(255, 255, 255)';
		editingColor = 'color' + i;
	}
}

function removeColor() {
	if (editingColor != '') {
		let colorIndex = parseInt(editingColor.charAt(5), 10);
		if (colorPalette.length==1) {
			colorPalette = [];
			updateControlPanel();
		} else {
			colorPalette.splice(colorIndex, 1);
			editingColor = '';
			updateControlPanel();
		}
	}
}

function pickOption(i) {
	switch(i) {
		case 1:
			randomPlacement = true;
			byId('option1').className = 'option picked';
			byId('option2').className = 'option';
			break;
		case 2:
			randomPlacement = false;
			byId('option2').className = 'option picked';
			byId('option1').className = 'option';
			break;
	}
}

function updateControlPanel() {
	byId('pixers_across').value = pixersInRow;
	byId('pixers_down').value = pixersInCol;

	if (randomPlacement) {
		byId('option1').className = 'option picked';
		byId('option2').className = 'option';
	} else {
		byId('option2').className = 'option picked';
		byId('option1').className = 'option';			
	}

	for (let c = 0; c < 10; c++) {
		if (colorPalette[c] === undefined) {
			byId('color' + c).removeAttribute('style');
			byId('color' + c).className = 'colorpalette_box empty';				
		} else {
			byId('color' + c).className = 'colorpalette_box';
			let currentColor = 'rgb(' + colorPalette[c].r + ',' + colorPalette[c].g + ',' + colorPalette[c].b + ')';
			byId('color' + c).style.background = currentColor;
		}
	}

}

function loadColorForEditing(e) {
	e = e || window.event;
	let target = e.target || e.srcElement;
	let boxes = document.getElementsByClassName('colorpalette_box');
	for (let b = 0; b < boxes.length; b++) {
		if (boxes[b].className.match(/active/)) {
			boxes[b].className = 'colorpalette_box';
		}
	}
	if (target.className.match(/empty/)) {
		editingColor = '';
		rInput.value = '';
		gInput.value = '';
		bInput.value = '';
		byId('colordisplay').style.backgroundColor = '#cacaca';			
		byId('colordisplay').innerHTML = 'select palette color to edit';	
	} else if (target.className.match(/colorinput/)) {
		byId(editingColor).className = 'colorpalette_box active';
		return;
	} else if (target.className.match(/colorpalette_box/)) {
		target.className = target.className+' active';
		let id = target.getAttribute('id');
		editingColor = id;
		let colorIndex = parseInt(editingColor.charAt(5), 10);
		rInput.value = colorPalette[colorIndex].r;
		gInput.value = colorPalette[colorIndex].g;
		bInput.value = colorPalette[colorIndex].b;
		let thisColor = 'rgb('+colorPalette[colorIndex].r+','+colorPalette[colorIndex].g+','+colorPalette[colorIndex].b+')';
		byId('colordisplay').style.backgroundColor = thisColor;
		byId('colordisplay').innerHTML = 'now editing '+id;
	} else {
		editingColor = '';
		rInput.value = '';
		gInput.value = '';
		bInput.value = '';
		byId('colordisplay').style.backgroundColor = '#cacaca';			
		byId('colordisplay').innerHTML = 'select palette color to edit';			
	}
}

function clearCanvas() {
	playing = false;
	byId('pausetxt').innerHTML = 'start';
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

	byId('pausetxt').innerHTML = !playing ? 'resume' : 'pause';
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
	let dir = Math.floor(Math.random() * 8);

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

	if (this.x < minX) { this.x = maxX; }
	else if (this.x > maxX) { this.x = minX; }

	if (this.y < minY) { this.y = maxY; }
	else if (this.y > maxY) { this.y = minY; }

	this.colorPixel(this.x, this.y, this.r, this.g, this.b, this.a);
}

Pixer.prototype.colorPixel = function(x, y, r, g, b, a) {
	let index = (x + y * canvasWidth) * 4;

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

function updateCanvas() { ctx.putImageData(canvasData, 0, 0); }

function toggleControls() {
	if (!controlsShown) {
		byId('paneltoggle').innerHTML = 'hide control panel -';
		byId('panel').style.display = 'block';
		byId('paneltoggle').style.bottom = '180';
	} else {
		byId('paneltoggle').innerHTML = 'show control panel +';
		byId('panel').style.display = 'none';
		byId('paneltoggle').style.bottom = '0';
	}
	controlsShown = !controlsShown;
}

function toggleInfoBox() {
	if (!infoBoxShown) {
		byId('infobox_toggle').innerHTML = 'okay, got it';
		byId('infobox').style.display = 'block';
		byId('infobox_toggle').style.bottom = '225';
	} else {
		byId('infobox_toggle').innerHTML = 'what is this?';
		byId('infobox').style.display = 'none';
		byId('infobox_toggle').style.bottom = '0';
	}
	infoBoxShown = !infoBoxShown;
}