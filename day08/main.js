const input = require("./input2.json")
// Part 1
const count1478 = input.reduce((count, note) => count + note.numbers.reduce((count2, word) => count2 + ((word.length === 2 || word.length === 3 || word.length === 4 || word.length === 7) ? 1 : 0), 0), 0)

console.log({count1478})

// Part 2
String.prototype.sort = function() {
  return Array.from(this).sort().join("")
}

String.prototype.map = function(fn) {
  return Array.from(this).map(fn).join("")
}

String.prototype.remove = function (str) {
  return Array.from(str).reduce((result, l) => result.replace(l, ""), this)
}

Array.prototype.splitFilter = function (predicate) {
  return [this.filter(predicate), this.filter((a,b,c) => !predicate(a,b,c))];
}

const computeTranslation = (patterns) => {
  const p1 = patterns.find(p => p.length === 2)
  const cfPatterns = patterns.filter(p => p.includes(p1[0]) && !p.includes(p1[1]) || !p.includes(p1[0]) && p.includes(p1[1])).splitFilter(e => e.includes(p1[0]))
  const [c, f] = cfPatterns.find(sub => sub.length === 1)[0].includes(p1[0]) ? [p1[0], p1[1]] : [p1[1], p1[0]]
  const p7 = patterns.find(p => p.length === 3)
  const a = p7.remove(c+f)
  // Probably the most complicated one, all the 5 and 6 patterns share g uniquely when removing c, f, and a
  const g = patterns.filter(e => e.length === 5 || e.length === 6)
    .map(w => w.remove(c+f+a))
    .reduce((acc, e) => acc.filter(e2 => e.includes(e2)), Array.from("abcdefg".remove(c+f+a)))[0]
  const d = patterns.filter(p => p.length === 5).map(e => e.remove(c+f+g+a)).find(e => e.length === 1)
  const b = patterns.filter(p => p.length === 6).map(e => e.remove(c+f+g+a+d)).find(e => e.length === 1)
  const e = patterns.find(p => p.length === 7).remove(a+b+c+d+f+g)

  const t = {};
  t[a] = "a";
  t[b] = "b";
  t[c] = "c";
  t[d] = "d";
  t[e] = "e";
  t[f] = "f";
  t[g] = "g";
  return t;
}

const display = {
/*
  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg
 */
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,

  // cf: 1,
  // acf: 7,
  // bcdf: 4,
  // acdeg: 2,
  // acdfg: 3,
  // abdfg: 5,
  // abcefg: 0,
  // abdefg: 6,
  // abcdfg: 9,
  // abcdefg: 8,
}

const result = input.map((line, i) => {
  const translation = computeTranslation(line.patterns)
  const numbers = line.numbers.map(a => Array.from(a))
  const translatedNumbers = numbers.map(n => n.map(l => translation[l]))
  const answer = translatedNumbers.map(translatedNumber => display[translatedNumber.sort().join("")])
  return parseInt(answer.join(""))
}).reduce((sum, e) => sum + e, 0)

console.log({result})
