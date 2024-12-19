import { getData, timer } from './xmas'

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function mod (v: number, n: number) {
  return ((v % n) + n) % n
}

function part1 (lines: string[]) {
//  const WIDTH = 11
  // const HEIGHT = 7
  const WIDTH = 101
  const HEIGHT = 103
  const bots = parse(lines)
  console.log(bots)
  const t = 100
  let finalPos: Pos[] = bots.map(bot => {
    return { x: mod(bot.p.x + bot.v.x * t, WIDTH), y: mod(bot.p.y + bot.v.y * t, HEIGHT) }
  })
  const g: number[][] = []
  for (let y = 0; y < HEIGHT; y++) {
    g[y] = []
    for (let x = 0; x < WIDTH; x++) {
      g[y][x] = 0
    }
  }
  finalPos.forEach(p => {
    g[p.y][p.x]++
  })
  for (let y = 0; y < HEIGHT; y++) {
    console.log(g[y].join(''))
  }

  const quads = [0, 0, 0, 0]
  const midX = (WIDTH - 1) / 2
  const midY = (HEIGHT - 1) / 2
  finalPos.map(p => {
    if (p.x < midX && p.y < midY) {quads[0]++}
    if (p.x > midX && p.y < midY) {quads[1]++}
    if (p.x < midX && p.y > midY) {quads[2]++}
    if (p.x > midX && p.y > midY) {quads[3]++}
  })
  console.log(quads)
  let result = quads[0] * quads[1] * quads[2] * quads[3]
  return result
}

function part2 (lines: string[]) {
//  const WIDTH = 11
  // const HEIGHT = 7
  const WIDTH = 101
  const HEIGHT = 103
  const bots = parse(lines)
  console.log(bots)
  for (let t = 0; t < 10000000; t++) {

    let finalPos: Pos[] = bots.map(bot => {
      return { x: mod(bot.p.x + bot.v.x * t, WIDTH), y: mod(bot.p.y + bot.v.y * t, HEIGHT) }
    })
    const g: number[][] = []
    for (let y = 0; y < HEIGHT; y++) {
      g[y] = []
      for (let x = 0; x < WIDTH; x++) {
        g[y][x] = 0
      }
    }
    finalPos.forEach(p => {
      g[p.y][p.x]++
    })

    const midX = (WIDTH - 1) / 2
    const midY = (HEIGHT - 1) / 2
    let score = 0
    finalPos.map(p => {
      if (p.y<HEIGHT - 4 && g[p.y + 1][p.x] && g[p.y + 2][p.x] && g[p.y + 3][p.x]) { score++}
    })
    //console.log(quads)
    if (score > 10) {
      console.log({ t, score })
      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
          process.stdout.write(g[y][x] === 0 ? ' ' : `${g[y][x]}`)
        }
        process.stdout.write('\n')
      }
      return t
    }
  }
}

type Pos = { x: number, y: number }
type Bot = { p: Pos, v: Pos }

// default parse assumes a list of ints per row
function parse (lines: string[]): Bot[] {
  //p=9,5 v=-3,-3
  const bots: Bot[] = []
  lines.forEach((line) => {
    const bits = line.split(/[ =]/)
    const pBits = bits[1].split(/,/).map(cell => parseInt(cell))
    const vBits = bits[3].split(/,/).map(cell => parseInt(cell))
    bots.push({ p: { x: pBits[0], y: pBits[1] }, v: { x: vBits[0], y: vBits[1] } })
  })
  return bots
}
