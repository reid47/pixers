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

module.exports = {
  randomInt,
  average,
  wrapAround
};
