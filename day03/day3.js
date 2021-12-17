const input = require("./day3_2.json")

const acc = input.reduce((acc, e) => {
	console.log(acc)
	return Array.from(e).reduce((acc, digit, i) => {
		acc[i] = acc[i] + (digit === "0" ? 1 : -1)
		return acc
	}, acc)
}, Array.from(input[0]).fill(0))

console.log(acc)
const gamma = acc.reduce((acc, e) => acc + (e > 0 ? "0" : "1"), "")
const epsilon = acc.reduce((acc, e) => acc + (e < 0 ? "0" : "1"), "")

const gammaDecimal = parseInt(gamma, 2)
const epsilonDecimal = parseInt(epsilon, 2)

console.log(gammaDecimal * epsilonDecimal)

