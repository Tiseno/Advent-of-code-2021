const input = require("./input2.json")

// Part 1
const generation = (fishList) => {
  let newFish = 0
  const updatedFishList = fishList.map((fish) => {
    if (fish === 0) {
      newFish += 1
      return 6
    }
    return fish - 1
  })
  return updatedFishList.concat(Array(newFish).fill(8))
}
const result = Array(80).fill().reduce((fishList) => generation(fishList), input)
console.log("Fish after 80 days:", result.length)

// Part 2
const fishCounters = input.reduce((counters, fish) => {
  counters[fish] += 1
  return counters
}, Array(9).fill(0))
const generation2 = (fishCounters) => {
  const newFish = fishCounters[0]
  const fishCounters2 = fishCounters.slice(1)
  fishCounters2[6] += newFish
  return fishCounters2.concat(newFish)
}
const result2 = Array(256).fill().reduce((counters) => generation2(counters), fishCounters)
console.log("Fish after 256 days:", result2.reduce((count, a) => count + a, 0))
