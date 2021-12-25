// Part 1
const createArea = (xmin, xmax, ymin, ymax) => ({xmin, xmax, ymin, ymax})

const input = [
  createArea(20, 30, -10, -5),
  createArea(20, 1030, -10, -5),
  createArea(244, 303, -91, -54),
]

const stupidCalculation = (area) => {
  let velocity = Math.abs(area.ymin) - 1
  let y = 0
  let steps = 0
  while(velocity > 0) {
    y += velocity
    velocity -= 1
    steps += 1
  }
  console.log({velocity, y, steps})
  return y
}

input.forEach(input => {
  console.log(stupidCalculation(input))
})

