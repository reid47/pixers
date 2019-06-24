const presets = {
  simple: {
    pixersInRow: 20,
    pixersInCol: 20,
    randomPlacement: false,
    colorPalette: [
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 0, b: 255 },
      { r: 0, g: 255, b: 255 }
    ]
  },
  lines: {
    pixersInRow: 200,
    pixersInCol: 3,
    randomPlacement: false,
    colorPalette: [
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 0, b: 255 },
      { r: 0, g: 255, b: 255 }
    ]
  },
  clouds: {
    pixersInRow: 24,
    pixersInCol: 12,
    randomPlacement: true,
    colorPalette: [
      { r: 2, g: 10, b: 181 },
      { r: 250, g: 250, b: 255 },
      { r: 200, g: 200, b: 255 },
      { r: 5, g: 50, b: 255 },
      { r: 220, g: 230, b: 255 }
    ]
  },
  trees: {
    pixersInRow: 4,
    pixersInCol: 120,
    randomPlacement: false,
    colorPalette: [
      { r: 0, g: 200, b: 0 },
      { r: 150, g: 100, b: 0 },
      { r: 70, g: 50, b: 0 },
      { r: 55, g: 115, b: 0 },
      { r: 100, g: 50, b: 0 }
    ]
  },
  fire: {
    pixersInRow: 40,
    pixersInCol: 40,
    randomPlacement: true,
    colorPalette: [
      { r: 220, g: 0, b: 0 },
      { r: 240, g: 200, b: 0 },
      { r: 210, g: 100, b: 0 },
      { r: 80, g: 0, b: 0 },
      { r: 255, g: 255, b: 0 },
      { r: 150, g: 0, b: 0 }
    ]
  },
  twotone: {
    pixersInRow: 30,
    pixersInCol: 30,
    randomPlacement: true,
    colorPalette: [
      { r: 55, g: 255, b: 0 },
      { r: 220, g: 0, b: 220 }
    ]
  },
  horizon: {
    pixersInRow: 500,
    pixersInCol: 1,
    randomPlacement: false,
    colorPalette: [
      { r: 55, g: 25, b: 0 },
      { r: 180, g: 255, b: 100 },
      { r: 255, g: 20, b: 30 },
      { r: 0, g: 255, b: 255 }
    ]
  }
};
