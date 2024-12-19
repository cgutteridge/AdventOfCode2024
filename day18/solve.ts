import { getData, timer, XY } from './xmas'

const DIRMAP: Record<string, XY> = {
  '>': { x: 1, y: 0 },
  '<': { x: -1, y: 0 },
  '^': { x: 0, y: -1 },
  'v': { x: 0, y: 1 },
}

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function runMaze (data: XY[], n: number): number | undefined {
  let head: XY[] = data.slice(0, n)
  let width = 71
  let height = 71
  if (data.length < 1000) {
    width = 7
    height = 7
  }

  const target = `${width - 1},${height - 1}`

  function code (xy: XY): string {
    return `${xy.x},${xy.y}`
  }

  const walls: Record<string, true> = {}
  head.forEach(wall => walls[code(wall)] = true)

  const scores: Record<string, number> = { '0,0': 0 }
  const todo: XY[] = [{ x: 0, y: 0 }]
  while (todo.length) {
    const pos = todo.shift() as XY
    const score = scores[code(pos)]
    Object.values(DIRMAP).forEach(move => {
      const newPos = { x: pos.x + move.x, y: pos.y + move.y }
      if (newPos.x < 0 || newPos.x > width - 1 || newPos.y < 0 || newPos.y > height - 1) { return }
      const newCode = code(newPos)
      if (walls[newCode]) { return }
      if (scores[newCode] === undefined || scores[newCode] > score + 1) {
        scores[newCode] = score + 1
        todo.push(newPos)
      }
    })
  }

  let result: number | undefined = scores[target]
  return result
}

function part1 (lines: string[]) {
  const data: XY[] = parse(lines)
  const n = (data.length < 1000) ? 12 : 1024
  let result = runMaze(data, n)
  return result
}

function part2 (lines: string[]) {
  const data: XY[] = parse(lines)

  let i = 0
  while (i<data.length) {
    const result = runMaze(data,i)
    console.log( {i,result,pos:data[i-1]})
    if( result === undefined ) { return `${data[i-1].x},${data[i-1].y}` }
    i++
  }

}

// default parse assumes a list of ints per row
function parse (lines: string[]): XY[] {
  const input: XY[] = []
  lines.forEach((line) => {
    const foo = line.split(/,/).map(cell => parseInt(cell))
    input.push({ x: foo[0], y: foo[1] })
  })
  return input
}
