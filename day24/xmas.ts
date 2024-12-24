import fs from 'fs'

export type Grid = string[][]

export class XY {
  x: number
  y: number

  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }

  equals (that: XY): boolean {
    return this.x === that.x && this.y === that.y
  }

  add (that: XY): XY {
    return new XY(this.x + that.x, this.y + that.y)
  }

  subtract (that: XY): XY {
    return new XY(this.x - that.x, this.y - that.y)
  }
}

export function codePos (xy: XY) { return `${xy.x},${xy.y}`}

export function codeToPos (code: string): XY {
  const parts = code.split(/,/).map(s => parseInt(s))
  return new XY(parts[0], parts[1])
}

export type CompassHeading = 'N' | 'E' | 'S' | 'W'
export const COMPASS: CompassHeading[] = ['N', 'E', 'S', 'W']
export const COMPASS_MOVES: Record<CompassHeading, { move: XY }> = {
  'N': { move: new XY(0, -1) },
  'E': { move: new XY(1, 0) },
  'S': { move: new XY(0, 1) },
  'W': { move: new XY(-1, 0) }
}
export type ArrowHeading = '^' | '>' | 'v' | '<'
export const ARROWS: ArrowHeading[] = ['^', '>', 'v', '<']
export const ARROW_MOVES: Record<ArrowHeading, { move: XY }> = {
  '^': { move: new XY(0, -1) },
  '>': { move: new XY(1, 0) },
  'v': { move: new XY(0, 1) },
  '<': { move: new XY(-1, 0) }
}

export const ORIGIN = new XY(0, 0)

export function gridAt (grid: string[][], pos: XY) {
  if (grid[pos.y] === undefined) { return '' }
  if (grid[pos.y][pos.x] === undefined) { return '' }
  return grid[pos.y][pos.x]
}

export function allMovesWithinNSteps (steps: number): XY[] {
  const moves: XY[] = []
  for (let y = -steps; y <= steps; y++) {
    const xSize = steps - Math.abs(y)
    for (let x = -xSize; x <= xSize; x++) {
      moves.push(new XY(x, y))
    }
  }
  return moves
}

export function getData () {
  let srcFile: string = 'data'
  if (process.argv.length > 2) {
    srcFile = process.argv[2]
  }

  const data: string = fs.readFileSync(srcFile).toString()
  const lines: string[] = data.split(/\n/)
  const lastBit = lines.pop()
  if (lastBit !== '') {
    console.error(`Last bit wasn't empty: '${lastBit}'`)
    process.exit(1)
  }
  return lines
}

export function timer (title: string, task: () => void) {
  const start = new Date()
  const result = task()
  const end = new Date()
  const seconds = (end.getTime() - start.getTime()) / 1000
  console.log(`${title}: ${result}    (${seconds}s)`)
}

export function mod (v: number, n: number) {
  return ((v % n) + n) % n
}