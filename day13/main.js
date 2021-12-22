const input = require("./input2.json")
// console.log(input)

const logMatrix = (matrix) => {
  // Part 2
  for(let i = 0; i < matrix.length; i++) {
    if (matrix[0][i] === "|") {
      break;
    }
    const a = []
    for(let j = 0; j < matrix[0].length; j++) {
      const c = matrix[j][i]
      if (c === "_") {
        break;
      } else if (c === ".") {
        a.push(" ")
      } else {
        a.push(matrix[j][i])
      }
    }
    console.log(a.join(" "))
  }
}

const [bigX, bigY] = input.points.reduce((biggest, point) =>
  [
    biggest[0] > point[0] ? biggest[0] : point[0],
    biggest[1] > point[1] ? biggest[1] : point[1]
  ], [0,0])

const width = bigX + 1;
const height = bigY + 1;
console.log({bigX, bigY})

const matrix = input.points.reduce((m, p) => {
  m[p[0]][p[1]] = "#"
  return m
}, Array(width).fill().map(_ => Array(height).fill(".")))

const foldX = (matrix, x) => {
  // For fun mark the x line
  for (let y = 0; y < height; y++) {
    matrix[x][y] = "_";
  }
  // Go outwards from x line and mirror all dots
  for (let y = 0; y < height; y++) {
    for (let offset = 1; (x + offset) < width && (x - offset) >= 0; offset++) {
      if (matrix[x+offset][y] === "#" || matrix[x-offset][y] === "#") {
        matrix[x+offset][y] = "#";
        matrix[x-offset][y] = "#";
      }
    }
  }
  // After copy blank everything under x line
  for (let y = 0; y < height; y++) {
    for (let ix = x+1; ix < width; ix++) {
      matrix[ix][y] = " ";
    }
  }
  return matrix;
}

const foldY = (matrix, y) => {
  // For fun mark the y line
  for (let x = 0; x < width; x++) {
    matrix[x][y] = "|";
  }
  // Go outwards from y line and mirror all dots
  for (let offset = 1; (y + offset) < height && (y - offset) >= 0; offset++) {
    for (let x = 0; x < width; x++) {
      if (matrix[x][y+offset] === "#" || matrix[x][y-offset] === "#") {
        matrix[x][y+offset] = "#";
        matrix[x][y-offset] = "#";
      }
    }
  }
  // After copy blank everything under y line
  for (let iy = y+1; iy < height; iy++) {
    for (let x = 0; x < width; x++) {
      matrix[x][iy] = " ";
    }
  }
  return matrix;
}

const countDots = (matrix) => matrix.reduce((count, l) =>
  count + l.reduce((count2, e) =>
    count2 + (e === "#" ? 1 : 0), 0), 0)

const newMatrix = input.instructions.reduce((m, instruction, i) => {
  // Part 1
  console.log("Dots remaining: ", countDots(m))
  console.log("Instruction ", i+1)
  if (instruction[0] === "y") {
    return foldY(m, instruction[1])
  } else {
    return foldX(m, instruction[1])
  }
  return m
}, matrix)
logMatrix(matrix)

const answer = countDots(matrix)

console.log({answer})
