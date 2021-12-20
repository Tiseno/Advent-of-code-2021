const input = require("./input2.json");
const map = input.map(r => Array.from(r).map(l => parseInt(l)));

// Part 1
let lowPoints = 0;
let riskLevel = 0;
const height = map.length;
const width = map[0].length;
for (let y = 0; y < height; y++)
for (let x = 0; x < width; x++) {
  const upIsGreater = y === 0
    ? true : map[y-1][x] > map[y][x];
  const downIsGreater = y === (height - 1)
    ? true : map[y+1][x] > map[y][x];
  const leftIsGreater = x === 0
    ? true : map[y][x-1] > map[y][x];
  const rightIsGreater = x === (width - 1)
    ? true : map[y][x+1] > map[y][x];
  const isLowPoint = upIsGreater && downIsGreater && leftIsGreater && rightIsGreater
  lowPoints += !isLowPoint ? 0 : 1;
  riskLevel += !isLowPoint ? 0 : (map[y][x] + 1);
}
console.log({lowPoints});
console.log({riskLevel});

// Part 2
let basins = [];

const countAndGrow = (y, x, count) => {
  if (y < 0 || y >= height || x < 0 || x >= width || map[y][x] === 9 || map[y][x] === null) {
    return count;
  }
  map[y][x] = null;
  return count + 1
    + countAndGrow(y,   x+1, 0)
    + countAndGrow(y,   x-1, 0)
    + countAndGrow(y+1, x,   0)
    + countAndGrow(y-1, x,   0);
}

for (let y = 0; y < height; y++)
for (let x = 0; x < width; x++) {
  // If cell is marked, skip
  if (map[y][x] === 9 || map[y][x] === null) {
    continue;
  }
  // Grow outward from map[y][x] until basin is compeletely surrounded by 9
  const count = countAndGrow(y, x, 0);
  if (count > 0) {
    basins.push(count);
  }
}
console.log({basins: basins.length});

const top3BasinProduct = basins.sort((a,b) => b-a).slice(0,3).reduce((product, e) => product*e,1);
console.log({top3BasinProduct});

