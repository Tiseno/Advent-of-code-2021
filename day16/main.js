const debug = false;
const log = debug ? console.log : () => null

const readBits = (n, bitString) => ({bits: bitString.slice(0,n), remaining: bitString.slice(n)})

const readBitsAsNumber = (n, bitString) => ({num: parseInt(bitString.slice(0,n), 2), remaining: bitString.slice(n)})

const readVersion = (bitString) => {
  const {num, remaining} = readBitsAsNumber(3, bitString)
  return {version: num, remaining}
}

const readPacketTypeID = (bitString) => {
  const {num, remaining} = readBitsAsNumber(3, bitString)
  return {typeId: num, remaining}
}

const readLengthTypeID = (bitString) => {
  const {num, remaining} = readBitsAsNumber(1, bitString)
  return {lengthTypeId: num, remaining}
}

const readLiteral = (bitString) => {
  let acc = ""
  let {bits, remaining} = readBits(5, bitString)
  acc = acc + bits.slice(1)
  while(bits != "" && bits.slice(0,1) === "1") {
    ({bits, remaining} = readBits(5, remaining))
    acc = acc + bits.slice(1)
  }
  return {literal: parseInt(acc, 2) , remaining}
}

const readSubPacketsByNumberOfBits = (bitString) => {
  let {num, remaining} = readBitsAsNumber(15, bitString)
  const expectedLengthAfterRead = remaining.length - num;
  const packets = []
  while(remaining.length > expectedLengthAfterRead) {
    let packet;
    ({packet, remaining} = readPacket(remaining))
    packets.push(packet)
  }
  return {subPackets: packets, remaining}
}

const readSubPacketsByNumberOfPackets = (bitString) => {
  let {num, remaining} = readBitsAsNumber(11, bitString);
  let packets;
  ({packets, remaining} = Array(num).fill().reduce((acc) => {
    const {packet, remaining: rem} = readPacket(acc.remaining)
    return {packets: acc.packets.concat(packet), remaining: rem}
  }, {packets: [], remaining}));
  return {subPackets: packets, remaining}
}

const readOperator = (bitString) => {
  let {lengthTypeId, remaining} = readLengthTypeID(bitString)
  log("lengthTypeId \t", lengthTypeId, "\t", remaining);

  if(lengthTypeId === 0) {
    return readSubPacketsByNumberOfBits(remaining)
  } else {
    return readSubPacketsByNumberOfPackets(remaining)
  }
}

const readPacket = (bitString) => {
  let {version, remaining} = readVersion(bitString);
  let typeId;
  ({typeId, remaining} = readPacketTypeID(remaining));
  if(typeId === 4) {
    let literal;
    ({literal, remaining} = readLiteral(remaining))
    return { packet: {version, typeId, type: "LITERAL", value: literal}, remaining}
  } else {
    let subPackets;
    ({subPackets, remaining} = readOperator(remaining))
    return { packet: {version, typeId, type: "OPERATOR", subPackets}, remaining}
  }
}

const hexToBinary = (str) => Array.from(str).reduce((bitString, hex) =>
  bitString + parseInt(hex, 16).toString(2).padStart(4, "0")
  , "")

const parseBITS = (input) => {
  log({input})
  const bitString = hexToBinary(input)
  log({bitString})

  const {packet, remaining} = readPacket(bitString)
  log("Remaining after BITS parsing ", remaining)
  return packet;
}

const sumVersionNumbers = (packet) => {
  if(packet.typeId === 4) {
    return packet.version
  } else {
    return packet.version + packet.subPackets.reduce((acc, subPacket) => acc + sumVersionNumbers(subPacket), 0)
  }
}

const eval = (packet) => {
  switch(packet.typeId) {
    case 0:
      // Sum
      return packet.subPackets.reduce((acc, packet) => acc + eval(packet), 0)
    case 1:
      // Product
      return packet.subPackets.reduce((acc, packet) => acc * eval(packet), 1)
    case 2:
      // Minimum
      return packet.subPackets.reduce((acc, packet) => {
        const r = eval(packet)
        return acc < r ? acc : r
      }, Infinity)
    case 3:
      // Maximum
      return packet.subPackets.reduce((acc, packet) => {
        const r = eval(packet)
        return acc > r ? acc : r
      }, -Infinity)
    case 4:
      // Literal
      return packet.value
    case 5:
      // Greater than
      return eval(packet.subPackets[0]) > eval(packet.subPackets[1]) ? 1 : 0
    case 6:
      // Less than
      return eval(packet.subPackets[0]) < eval(packet.subPackets[1]) ? 1 : 0
    case 7:
      // Equal to
      return eval(packet.subPackets[0]) === eval(packet.subPackets[1]) ? 1 : 0
  }
  throw new Error(`TypeId ${packet.typeId} not implemented.`)
}

console.log("Part 1")
Array(8).fill().forEach((_, i) => {
  console.log("Transmission", i+1)
  const packet = parseBITS(require(`./input${i}.json`))
  const versionNumberSum = sumVersionNumbers(packet)
  console.log({versionNumberSum})

  console.log()
})


console.log("Part 2")
Array(9).fill().forEach((_, i) => {
  console.log("Transmission", i+1)
  const packet = parseBITS(require(`./input_p2_${i}.json`))
  const result = eval(packet)
  console.log({result})

  console.log()
})
