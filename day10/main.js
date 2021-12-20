const input = require("./input1.json")
const util = require('util')
const log = a => console.log(util.inspect(a, {showHidden: false, depth: null, colors: true}))

// input.forEach(i => log(i))
const lines = input.map(l => Array.from(l))

// Part 1
const makeError = (error, expected, symbol) => ({type: "ERROR", error, symbol, expected})
const makeEmpty = () => ({type: "EMPTY"})
const makeChunks = (chunkType, children) => ({type: "CHUNK", chunkType, children})
// const makeState = () => ({ openChunks: { ")": 0, "]": 0, "}": 0, ">": 0 } })
const symbolMap = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
}

const readChunk = (a, pos) => {
  const opening = a[pos]
  // Symbol is not opening, we cannot read a chunk
  if (symbolMap[opening] === undefined) {
    return [makeEmpty(), pos]
  }
  [result, pos] = readChunks(a, pos+1)
  if (result[0].type === "ERROR" && result[0].error === "CHUNK_CLOSING_MISMATCH") {
    return result
  }
  const closing = a[pos]
  if (closing === undefined) {
    const completedBy = (result[0].type === "ERROR" && result[0].error === "CHUNK_NOT_CLOSED" ? result[0].completedBy : "") + symbolMap[opening]
    return [{type: "ERROR", error: "CHUNK_NOT_CLOSED", pos, opening, completedBy}, pos+1]
  } else if (closing !== symbolMap[opening]) {
    return [{type: "ERROR", error: "CHUNK_CLOSING_MISMATCH", pos, expected: symbolMap[opening], actual: closing}, pos+1]
  }
  return [makeChunks(opening+closing, result[0].type === "EMPTY" ? [] : result), pos+1]
}

const readChunks = (a, pos) => {
  [result, pos] = readChunk(a, pos)
  let results = [result]
  while (result.type !== "ERROR" && result.type !== "EMPTY") {
    [result, pos] = readChunk(a, pos)
    if (result.type !== "EMPTY") {
      results.push(result)
    }
  }
  if (result.type === "ERROR") {
    return [[result], pos]
  }
  return [results, pos]
}

const readLine = (line) => {
  const [result, pos] = readChunks(line, 0)
  return result
}

const parsed = lines.map(l => readLine(l, 0))
log(parsed)

const closingMismatchErrors = parsed.filter(p => p[p.length-1].type === "ERROR" && p[p.length-1].error ===  "CHUNK_CLOSING_MISMATCH").map(r => r[0])

const mismatchScoreMap = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
}
const mismatchErrorScore = closingMismatchErrors.reduce((count, error) => count + mismatchScoreMap[error.actual],0)
log({mismatchErrorScore})

// Part 2
const notClosedErrors = parsed.filter(p => p[p.length-1].type === "ERROR" && p[p.length-1].error ===  "CHUNK_NOT_CLOSED").map(r => r[0])

const closingErrorScoreMap = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
}
const closingErrorScores = notClosedErrors.map(e => Array.from(e.completedBy).reduce((count, closingChar) => count * 5 + closingErrorScoreMap[closingChar], 0)).sort((a,b) => a-b)
const closingErrorFinalScore = closingErrorScores[Math.floor(closingErrorScores.length / 2)]
log({closingErrorFinalScore})

