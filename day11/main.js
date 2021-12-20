const input = require("./input2.json");
const map = input.map(r => Array.from(r).map(l => parseInt(l)));
// console.log(map)

// Part 1
const height = map.length;
const width = map[0].length;

const incrementIfNotFlashed = (y, x) => {
  // An invalid cell
  if (y < 0 || x < 0 || y >= height || x >= width) {
    return
  }
  if (map[y][x] !== 0 && map[y][x] < 10) {
    map[y][x] += 1
  }
}

const flash = (y, x) => {
  // An invalid cell
  if (y < 0 || x < 0 || y >= height || x >= width) {
    return
  }
  // This is not ready to flash
  if (map[y][x] < 10) {
    return
  }
  // logMap(`${y}, ${x}    `)
  // Set this to 0, increment surrounding and flash them if needed
  map[y][x] = 0;
  [-1, 0, 1].forEach(dy => [-1, 0, 1].forEach(dx => incrementIfNotFlashed(y+dy, x+dx)));
  [-1, 0, 1].forEach(dy => [-1, 0, 1].forEach(dx => flash(y+dy, x+dx)));
  // logMap(`              `)
}

const increment = (y, x) => {
  if (map[y][x] < 10) {
    map[y][x] += 1
  }
}
const logMap = (i = "") => {
  map.forEach(r => { const p = Array.from(r).map(a => a === 0 ? a : String(a)); console.log(i, ...p);})
  console.log()
}

// logMap()

const countFlashes = () => map.reduce((count, row) => count + row.reduce((count2, e) => count2 + (e === 0 ? 1 : 0), 0), 0)

let totalFlashes = 0
let allFlashingStep = 0
for (let step = 1; step < 5001; step++) {
  // console.log(step)
  for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    increment(y, x)
  }
  // logMap("    ")
  for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    // console.log(`Starting flash ${y}, ${x}`)
    flash(y, x)
  }
  if (step < 101) {
    totalFlashes += countFlashes()
  }

  // logMap()
  // Part 2
  const allFlashing = map.every(r => r.every(c => c === 0))
  if (allFlashing) {
    allFlashingStep = step
    break;
  }
}
console.log({totalFlashes})
console.log({allFlashingStep})
