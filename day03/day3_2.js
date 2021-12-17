const input = require("./day3_2.json")

const commonalityInPosition = (position, array) => array.reduce((count, e) => count + (e[position] === "1" ? 1 : -1), 0)

const filterByCommonalityInPosition = (position, array, filterForMostCommon) => {
  const commonality = commonalityInPosition(position, array)
  const keepOnes = filterForMostCommon
    ? (commonality > -1)
    : (commonality < 0)

  return array.filter((e) => e[position] === (keepOnes ? "1" : "0"))
}



const oxygen = Array.from(input[0]).fill(undefined).reduce((acc, _, i) =>
  acc.length === 1 ? acc : filterByCommonalityInPosition(i, acc, true), input)

const co2 = Array.from(input[0]).fill(undefined).reduce((acc, _, i) =>
  acc.length === 1 ? acc : filterByCommonalityInPosition(i, acc, false), input)

console.log(parseInt(oxygen[0], 2) * parseInt(co2[0], 2))

