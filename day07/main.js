const input = require("./input2.json")

// Part 1
const costFunction1 = (a, b) => Math.abs(a - b)
const costToPosition = (costFn, position, crabs) => crabs.reduce((count, crab) => count + costFn(position, crab), 0)
const largest = input.reduce((big, e) => big > e ? big : e, 0)

// Part 2
const costTriangle = (n) => ((n+1)*n)/2
const costFunction2 = (a, b) => costTriangle(costFunction1(a, b))
let smallestCost = Infinity
for (let i = 0; i <= largest; i++) {
  const cost = costToPosition(costFunction2, i, input)
  if (cost < smallestCost) {
    smallestCost = cost
  }
}
console.log(smallestCost)

