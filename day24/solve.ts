import { getData, timer } from './xmas'

type Gate = {
  a: string
  b: string
  op: string
}
type Data = {
  init: Record<string, number>
  gates: Record<string, Gate>
}

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function part1 (lines: string[]) {
  const data: Data = parse(lines)
  const z: Record<string, number> = {}
  const todo = Object.keys(data.gates).filter(id => id[0] === 'z').sort()
  let result = 0
  let i = 0
  let bin = ''
  todo.forEach(id => {
//    console.log(describeValue(id, data))
    z[id] = getValue(id, data)
    result += z[id] << i
    bin = z[id] + bin
    i++
  })
  return result
}

function getValue (id: string, data: Data): number {
  if (data.init[id] !== undefined) {
    return data.init[id]
  }
  const gate = data.gates[id]
  const a = getValue(gate.a, data)
  const b = getValue(gate.b, data)
  let v = 0
  if (gate.op === 'AND') {
    v = (a === 1 && b === 1) ? 1 : 0
  } else if (gate.op === 'OR') {
    v = (a === 1 || b === 1) ? 1 : 0
  } else if (gate.op === 'XOR') {
    v = (a + b === 1) ? 1 : 0
  } else {
    throw new Error('bad op')
  }
  data.init[id] = v
  return v
}

function describeValue (id: string, data: Data, nicks: Record<string, string>): string {
  if (data.init[id] !== undefined) {
    return id
  }
  if (nicks[id] !== undefined) { return nicks[id] }
  const gate = data.gates[id]
  const va = describeValue(gate.a, data, nicks)
  const vb = describeValue(gate.b, data, nicks)

  return `${gate.op}[${id}](${va} , ${vb})`
}

function treeSize (id: string, data: Data): number {
  if (data.init[id] !== undefined) {
    return 1
  }
  const gate = data.gates[id]
  return treeSize(gate.a, data) + treeSize(gate.b, data) + 1
}

function part2 (lines: string[]) {
  const data: Data = parse(lines)
  const outputs = Object.keys(data.gates).filter(id => id[0] === 'z').sort()

  /*
    gate z15 not xor!
    gate z20 not xor!
    gate z27 A not xor on the registers!
    gate z37 not xor!
    gate z45 not xor!
    should be gates that XOR where nick(a) is XOR_N
   */

  const swaps = [
    ['vkg', 'z37'],
    ['cqr', 'z20'],
    ['qnw', 'z15'],
    ['nfj','ncd'],
  ]
  /*
    cqr,ncd,nfj,qnw,vkg,z15,z20,z37
    z15
    z20
      z37
   */
  swaps.forEach(pair => {
    const tmp = data.gates[pair[0]]
    data.gates[pair[0]] = data.gates[pair[1]]
    data.gates[pair[1]] = tmp
  })

  let result = 0
  let i = 0
  let bin = ''
  // sort for clarity
  Object.keys(data.gates).forEach(id => {
    // make the larger tree b
    const gate = data.gates[id]
    const sa = treeSize(gate.a, data)
    const sb = treeSize(gate.b, data)
    if (sa > sb) {
      const tmp = gate.b
      gate.b = gate.a
      gate.a = tmp
    }
  })

  const nicks: Record<string, string> = {}
  Object.keys(data.gates).forEach(id => {
      const gate = data.gates[id]
      if (gate.op === 'XOR' && gate.a.match(/^[xy]/) && gate.b.match(/^[xy]/) && gate.a.substring(1) === gate.b.substring(1)) {
        nicks[id] = 'XOR_' + gate.a.substring(1)
      }
      if (gate.op === 'AND' && gate.a.match(/^[xy]/) && gate.b.match(/^[xy]/) && gate.a.substring(1) === gate.b.substring(1)) {
        nicks[id] = 'AND_' + gate.a.substring(1)
      }
    }
  )

  // real zs
  Object.keys(data.gates).forEach(id => {
    const gate = data.gates[id]
    if (gate.op !== 'XOR') {return}
    if (id[0] === 'z') {return}
    if (nicks[gate.a] === undefined) {return}
    if (!nicks[gate.a].match(/^XOR_/)) { return }
    console.log('realZ', id, nicks[gate.a].substring(4))
  })

  // each output N should be XOR_N XOR something (and that something we'll nickname OVERFLOW_N  (or N-1???)
  outputs.forEach(id => {
      const gate = data.gates[id]
      const num = id.substring(1)
      if (gate.op !== 'XOR') {
        console.log('gate ' + id + ' not xor!')
        return
      }
      if (nicks[gate.a] !== 'XOR_' + num) {
        console.log('gate ' + id + ' A not xor on the registers!')
        return
      }
      // now let's nickname the otherside as overflow
      nicks[gate.b] = 'OVERFLOW_' + num
    }
  )

  Object.keys(data.gates).forEach(id => {
    const gate = data.gates[id]
    console.log(id, gate, nicks[id])
  })

  outputs.forEach(id => {
    console.log()
    console.log({ id })
    console.log(describeValue(id, data, nicks))
    const n2 = { ...nicks }
    delete n2[data.gates[id].b]
    console.log('B: ', describeValue(data.gates[id].b, data, n2))
  })

  return 0
}

// default parse assumes a list of ints per row
function parse (lines: string[]): Data {

  const init: Record<string, number> = {}
  const gates: Record<string, Gate> = {}
  let i = 0
  while (lines[i] !== '') {
    const [id, value] = lines[i].split(/: /) as [string, string]
    init[id] = parseInt(value)
    i++
  }
  i++
  while (i < lines.length) {
    // x00 AND y00 -> z00
    const r = lines[i].split(/ /)
    gates[r[4]] = { a: r[0], b: r[2], op: r[1] }
    i++
  }
  return { init, gates }
}
