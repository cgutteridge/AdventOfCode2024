import { getData, timer } from './xmas'

const lines = getData()

timer( "Part 1", ()=>part1(lines))
timer( "Part 2", ()=>part2(lines))

function part1 (lines: string[]) {
  const data: number[][] = parse(lines)
  return 17
}

function part2 (lines: string[]) {
  const data: number[][] = parse(lines)
  return 23
}

// default parse assumes a list of ints per row
function parse (lines: string[]): number[][] {
  const input: number[][] = []
  lines.forEach((line) => {
    input.push(line.split(/ +/).map(cell => parseInt(cell)))
  })
  return input
}
