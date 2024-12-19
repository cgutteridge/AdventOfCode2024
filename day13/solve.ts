import { getData, timer } from './xmas'

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function part1 (lines: string[]) {
  const machines: Machine[] = parse(lines)
  let result = 0

  machines.forEach(m => {
    const a = (m.b.x * m.prize.y - m.b.y * m.prize.x) / (m.b.x * m.a.y - m.b.y * m.a.x)
    const b = (m.prize.y - a * m.a.y) / m.b.y

    if (a === Math.floor(a) && b === Math.floor(b)) {
      result += a * 3 + b
    }
  })

  return result
}

function part2 (lines: string[]) {
  const machines: Machine[] = parse(lines)
  let result = 0
  machines.forEach( m=>{
    m.prize.x+=10000000000000
    m.prize.y+=10000000000000
  })

  machines.forEach(m => {
    const a = (m.b.x * m.prize.y - m.b.y * m.prize.x) / (m.b.x * m.a.y - m.b.y * m.a.x)
    const b = (m.prize.y - a * m.a.y) / m.b.y

    if (a === Math.floor(a) && b === Math.floor(b)) {
      result += a * 3 + b
    }
  })

  return result
}

/*
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400
 */
type Coord = { x: number, y: number }
type Machine = { a: Coord, b: Coord, prize: Coord }

// default parse assumes a list of ints per row
function parse (lines: string[]): Machine[] {
  const machines: Machine[] = []
  for (let i = 0; i < lines.length; i += 4) {
    const aBits = lines[i].split(/[\+,]/)
    const a = { x: parseInt(aBits[1]), y: parseInt(aBits[3]) }
    const bBits = lines[i + 1].split(/[\+,]/)
    const b = { x: parseInt(bBits[1]), y: parseInt(bBits[3]) }
    const prizeBits = lines[i + 2].split(/[=,]/)
    const prize = { x: parseInt(prizeBits[1]), y: parseInt(prizeBits[3]) }
    machines.push({ a, b, prize })
  }

  return machines
}