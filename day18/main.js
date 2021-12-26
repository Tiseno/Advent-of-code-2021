const util = require("util");
const input = require("./input0.json")
const explodeExamples = require("./explode.json")
const log = (obj) => console.log(util.inspect(obj, showHidden=false, depth=1000, colorize=true))

const addCarry => (fromSide, n) => {
  if(fromSide === "left") {

  } else if(fromSide === "right") {

  }
  throw new Error(`fromSide ${fromSide}`)
}

const explodeR = (level, n) => {
  // If the level of nesting is 3 and we have a pair in this snail number we must explode that number
  if(level >= 3) {
    const explodeIndex = n.findIndex(m => Array.isArray(m))
    // This number should be a pair of regular numbers, as we always reduce to a maximum of nesting = 3
    if(explodeIndex === -1)
      return n

    const explodingNumber = n[explodeIndex]
    const head = n.slice(0, explodeIndex - 1)
    const tail = n.slice(explodeIndex)
    if(tail.length === 0) {
      return {"leftCarry": explodingNumber
    } else {

    }
  }

  return n.map(m => explode(level + 1))
}

const explode = n => explodeR(0, n)

const split = n => n
const shouldExplode = n => false
const shouldSplit = n => false

const reduceSnail = n => {
  if(typeof n === "number") return n

  let m = [reduceSnail(n[0]), reduceSnail(n[1])]
  if(shouldExplode(m))
    return reduceSnail(explode(m))
  if(shouldSplit(m))
    return reduceSnail(split(m))
  return m
}

const addSnail = (n, m) => reduceSnail([n, m])

// log(input.map(a => reduceSnail(a).reduce((a, b) => addSnail(a, b))))

explodeExamples.forEach((example, i) => {
  console.log("Example", i)
  log(explode(example.input))
  log(example.output)
  console.log()
})
