const input = require("./input2.json")
const logMap = (map) => map.forEach((row) => console.log(row.map((e) => e === 0 ? "." : e).join("")))
const findBiggest = (array) => array.reduce((big, e) => big > e ? big : e, 0)
const bigX = input.reduce((big, line) => findBiggest([big, line[0], line[2]]), 0)
const bigY = input.reduce((big, line) => findBiggest([big, line[1], line[3]]), 0)
const createArray = (num, filler) => Array(num).fill(filler())
const createMatrix = (input) => createArray(bigY+1, () => createArray(bigX+1, () => 0))
const map = createMatrix(input)
const reduceTimes = (times) => (reducer) => (state) => Array(times).fill().reduce((state) => reducer(state), state)
const markPointOnMap = (map, point) => map.map((row, i) => i !== point.y ? row : row.map((cell, j) => j !== point.x ? cell : (cell + 1)))
const markPointsOnMap = (map, pointList) => pointList.reduce((map, point) => markPointOnMap(map, point), map)
const mP = (x, y) => ({ x, y })

// Part 1
const createStraightLinePointListFromPoints = (a, b) => {
  const points = [a, b]
  const direction = a.x === b.x
  const [l, r] = direction
    ? [a.y < b.y ? a.y : b.y, a.y > b.y ? a.y : b.y]
    : [a.x < b.x ? a.x : b.x, a.x > b.x ? a.x : b.x];
  for (let i = l + 1; i < r; i++) {
    if (direction) {
      points.push({ x: a.x, y: i })
    } else {
      points.push({ x: i, y: a.y })
    }
  }
  return points
}
const markStraightLineOnMap = (map, line) => {
  const first = mP(line[0], line[1])
  const second = mP(line[2], line[3])
  const points = createStraightLinePointListFromPoints(first, second)
  return markPointsOnMap(map, points)
}
const straightLines = input.filter((line) => line[0] === line[2] || line[1] === line[3])
const markStraightLinesOnMap = (mapInput, lines) => lines.reduce((mapAcc, line) => markStraightLineOnMap(mapAcc, line), mapInput)
const mapWithStraightLines = markStraightLinesOnMap(map, straightLines)
// logMap(mapWithStraightLines)
const countBiggerThan1 = (map) => map.reduce((count, row) => count + row.reduce((count2, cell) => count2 + ((cell > 1) ? 1 : 0), 0), 0)
const numberOfOverlappingPointsWhenOnlyStraightLines = countBiggerThan1(mapWithStraightLines)
console.log({ numberOfOverlappingPointsWhenOnlyStraightLines })

// Part 2
const smallest = (n, m) => n < m ? n : m
const biggest = (n, m) => n > m ? n : m
const createLinePointListFromPoints = (a, b) => {
  const points = [a, b]
  if (a.x === b.x) {
    for (let y = smallest(a.y, b.y) + 1; y < biggest(a.y, b.y); y++) {
      points.push({ x: a.x, y })
    }
  } else if (a.y === b.y) {
    for (let x = smallest(a.x, b.x) + 1; x < biggest(a.x, b.x); x++) {
      points.push({ x, y: a.y })
    }
  } else {
    const xdir = a.x < b.x ? 1 : -1
    const ydir = a.y < b.y ? 1 : -1
    let x = a.x + xdir
    let y = a.y + ydir
    while(x !== b.x) {
      points.push({ x, y })
      x += xdir
      y += ydir
    }
  }
  return points
}
const markLineOnMap = (map, line) => {
  const first = mP(line[0], line[1])
  const second = mP(line[2], line[3])
  const points = createLinePointListFromPoints(first, second)
  return markPointsOnMap(map, points)
}
const markLinesOnMap = (mapInput, lines) => lines.reduce((mapAcc, line) => markLineOnMap(mapAcc, line), mapInput)
const mapWithLines = markLinesOnMap(map, input)
// logMap(mapWithLines)
const numberOfOverlappingPointsWhenAllLines = countBiggerThan1(mapWithLines)
console.log({ numberOfOverlappingPointsWhenAllLines })

