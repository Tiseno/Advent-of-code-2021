const input = require("./day2_input.json")

const acc = input.reduce((acc, e) => {
	[command, valueStr] = e.split(" ")
	const value = parseInt(valueStr)
	return {
		x: acc.x + (command === "forward" ? value : 0),
		y: acc.y + (command === "down" ? value : command === "up" ? -value : 0),
	}
}, {x: 0, y: 0})
console.log(acc)
console.log(acc.x * acc.y)

const input2 = require("./day2_input2.json")

const acc2 = input.reduce((acc, e) => {
	[command, valueStr] = e.split(" ")
	const value = parseInt(valueStr)
	switch(command) {
		case "down":
			return { ...acc, aim: acc.aim + value }
		case "up":
			return { ...acc, aim: acc.aim - value }
		case "forward":
			return {
				...acc,
				horizontal: acc.horizontal + value,
				depth: acc.depth + acc.aim * value,
			}
	}
	throw new Error("Should not happen!")
}, {aim: 0, horizontal: 0, depth: 0})
console.log(acc2)
console.log(acc2.horizontal * acc2.depth)
