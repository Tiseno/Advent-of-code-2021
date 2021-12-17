const input = require("./input2.json")

const logBoards = (boards) => boards.forEach((board) => console.log(board))

const whileReduce = (predicate, transform, input) => {
  let result = input
  while(predicate(result)) {
    // logBoards(result.boards)
    result = transform(result)
  }
  // logBoards(result.boards)
  return result
}

const rowIsWinner = (row) => row.every((e) => e === null)
const columnIsWinner = (board, index) => board.every((row) => row[index] === null)
// Lol diagonals do not count
// const diagonalIsWinner = (board) => board.every((row, i) => row[i] === null) || board.every((row, i) => row[row.length-i-1] === null)
const boardIsWinner = (board) => board.some((row) => rowIsWinner(row))
  || Array(board[0].length).fill().some((_, i) => columnIsWinner(board, i))

// Part 1 predicate
const noBoardIsWinner = (boards) => boards.every((board) => !boardIsWinner(board))
const numbersLeftAndNoWinners = (input) => input.numbers.length > 0 && noBoardIsWinner(input.boards)

// Part 2 predicate
const numbersLeftAndMultipleNonWinners = (input) => input.numbers.length > 0 && input.boards.reduce((nonWinners, board) => !boardIsWinner(board) ? (nonWinners + 1) : nonWinners, 0) > 1

const removeNumberFromBoard = (num, board) => board.map((row) => row.map((element) => element === num ? null : element))

const removeNumberFromAllBoards = (input) => {
  const currentNumber = input.numbers[0]
  return ({
      usedNumbers: [currentNumber].concat(input.usedNumbers),
      numbers: input.numbers.slice(1),
      boards: input.boards.map((board) => removeNumberFromBoard(currentNumber, board)),
  })
}


// Part 1
const result = whileReduce(numbersLeftAndNoWinners, removeNumberFromAllBoards, input)
const findWinner = (boards) => boards.find((board) => boardIsWinner(board))
const winningBoard = findWinner(result.boards)
// console.log(winningBoard)
const sumBoard = (board) => board.reduce((sum, row) => sum + row.reduce((sum2, element) => sum2 + (element === null ? 0 : element), 0),0)
const sum = sumBoard(winningBoard)
// console.log("Used numbers:", result.usedNumbers)
// console.log("Total sum:", sum)
console.log("Part 1")
console.log("Answer:", sum * result.usedNumbers[0])
console.log()

// Part 2
const result2 = whileReduce(numbersLeftAndMultipleNonWinners, removeNumberFromAllBoards, input)
const findNonWinner = (boards) => boards.find((board) => !boardIsWinner(board))
const lastBoard = findNonWinner(result2.boards)
// console.log("lastBoard")
// console.log(lastBoard)
// console.log("Unused numbers:", result2.numbers)

const input2 = {
  usedNumbers: [],
  numbers: result2.numbers,
  boards: [lastBoard],
}
const resultLast = whileReduce(numbersLeftAndNoWinners, removeNumberFromAllBoards, input2)
const lastWinningBoard = findWinner(resultLast.boards)
// console.log("lastWinningBoard")
// console.log(lastWinningBoard)
const lastWinningSum = sumBoard(lastWinningBoard)
// console.log("Total last sum:", lastWinningSum)
// console.log("Used last numbers:", resultLast.usedNumbers)
console.log("Part 2")
console.log("Answer last:", lastWinningSum * resultLast.usedNumbers[0])

