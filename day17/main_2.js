// Part 2
const createArea = (xmin, xmax, ymin, ymax) => ({xmin, xmax, ymin, ymax})

const input = [
  // createArea(20, 30, -10, -5),
  createArea(244, 303, -91, -54),
]

const possibleXRanges = (area) => {
  const maxVelocity = area.xmax
  const velocities = [{velocity: maxVelocity, steps: [1]}]

  for(let velocity = maxVelocity - 1; velocity >= 0; velocity--) {
    let successFulSteps = []

    let x = 0
    let v = velocity
    let steps = 0
    while(v > 0 && x < area.xmax) {
      x += v
      v--
      steps++
      if(x >= area.xmin && x <= area.xmax) {
        successFulSteps.push(steps)
      }
    }
    if(x >= area.xmin && x <= area.xmax && v === 0) {
      successFulSteps.push(Infinity)
    }
    if(successFulSteps.length > 0) {
      velocities.push({velocity, steps: successFulSteps})
    }
  }
  return velocities
}

const possibleYRanges = (area) => {
  const maxVelocity = Math.abs(area.ymin)
  const minVelocity = -Math.abs(area.ymin)
  const velocities = []

  for(let velocity = maxVelocity; velocity >= minVelocity; velocity--) {
    let successFulSteps = []

    let y = 0
    let v = velocity
    let steps = 0
    while(v >= minVelocity) {
      y += v
      steps++
      if(y >= area.ymin && y <= area.ymax) {
        successFulSteps.push(steps)
      }
      v--
    }
    if(successFulSteps.length > 0) {
      velocities.push({velocity, steps: successFulSteps})
    }
  }
  return velocities
}
const combine = (xranges, yranges) => {
  const possibleInitialConditions = []
  for(let yr of yranges) {
    for(let xr of xranges) {
      for(let ysteps of yr.steps) {
        if(xr.steps.includes(ysteps) || (xr.steps.includes(Infinity) && ysteps > xr.steps.filter(e => e !== Infinity).reduce((big, s) => big > s ? big : s, 0))) {
          if(possibleInitialConditions.find(p => p.x === xr.velocity && p.y === yr.velocity) === undefined) {
            possibleInitialConditions.push({x: xr.velocity, y: yr.velocity})
          }
        }
      }
    }
  }
  return possibleInitialConditions
}

input.forEach(input => {
  const xranges = possibleXRanges(input)
  // xranges.forEach(e => console.log(e))
  const yranges = possibleYRanges(input)
  // xranges.forEach(e => console.log(e))
  const possibleInitialConditions = combine(xranges, yranges)
  // console.log(possibleInitialConditions.reduce((acc, e) => acc + `  ${e.x},${e.y}`, ""))
  const possibleNumberOfInitialConditions = possibleInitialConditions.length
  console.log({possibleNumberOfInitialConditions})
})

