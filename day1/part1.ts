import { getData } from './xmas'

const lines = getData()

type Pair = {
  a: number
  b: number
}

part1(lines)
part2(lines)

function part2 (lines: string[]) {
  const pairs: Pair[] = parse(lines)
  const list1 = pairs.map(p => p.a)
  const list2 = pairs.map(p => p.b)
  const scores: number[] = []
  list2.forEach(n => {
    if (scores[n] === undefined) { scores[n] = 0 }
    scores[n]++
  })
  let part2 = 0
  list1.forEach(n => {
    if (scores[n] !== undefined) {
      part2 += n * scores[n]
    }
  })
  console.log({part2})
}

function part1 (lines: string[]) {
  const pairs: Pair[] = parse(lines)
  let part1 = 0
  const list1 = pairs.map(p => p.a).sort()
  const list2 = pairs.map(p => p.b).sort()
  for (var i = 0; i < list1.length; i++) {
    part1 += Math.abs(list1[i] - list2[i])
  }
  console.log({ part1 })
}

function parse (lines: string[]): Pair[] {
  const input: Pair[] = []
  lines.forEach((line) => {
    const cells = line.split(/ +/)
    const p: Pair = { a: parseInt(cells[0]), b: parseInt(cells[1]) }
    input.push(p)
  })
  return input
}
