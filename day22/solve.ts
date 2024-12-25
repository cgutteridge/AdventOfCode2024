import { getData, mod, timer } from './xmas'

const lines = getData()

type Data = number[]

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function step (v: number) {
  const v2 = mod(v ^ (v << 6), 16777216)
  const v3 = mod(v2 ^ (v2 >> 5), 16777216)
  const v4 = mod(v3 ^ (v3 << 11), 16777216)
  return v4
}

function part1 (lines: string[]) {
  const data: Data = parse(lines)
  let result = 0
  data.forEach(n => {
    for (let i = 1; i <= 2000; i++) {
      n = step(n)
    }
    result += n
  })
  return result
}

function part2 (lines: string[]) {
  const data: Data = parse(lines)
  const allSeq: Record<string, true> = {}
  const scoreForSeqs: Record<string, number>[] = []
  data.forEach(n => {
    const scoreForSeq: Record<string, number> = {}
    let lastPrice: number = mod(n, 10)
    let seq: number[] = []
    for (let i = 1; i <= 2000; i++) {
      n = step(n)
      const price = mod(n, 10)
      if (lastPrice !== undefined) {
        const change = price - lastPrice
        seq.push(change)
        if (seq.length === 5) { seq.shift() }
        if (seq.length === 4) {
          const code = seq.join(',')
          if (scoreForSeq[code] === undefined) {
            scoreForSeq[code] = price
            allSeq[code] = true
          }
        }
      }
      lastPrice = price
    }
    scoreForSeqs.push(scoreForSeq)
  })

  // find best sequence score
  let bestScore = 0
  Object.keys(allSeq).forEach(seq => {
    let score = 0
    scoreForSeqs.forEach(scoreForSeq => {
      if (scoreForSeq[seq] !== undefined) { score += scoreForSeq[seq]}
    })
    if (score > bestScore) {
      bestScore = score
    }
  })

  return bestScore
}

// default parse assumes a list of ints per row
function parse (lines: string[]): Data {
  return lines.map(cell => parseInt(cell))
}
