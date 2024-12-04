import { getData, timer } from './xmas'

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function char (grid: string[], x: number, y: number): string {
  if (y < 0) { return '' }
  if (y >= grid.length) { return ''}
  if (x < 0) { return ''}
  if (x >= grid[y].length) { return ''}
  return grid[y][x]
}

function part1 (lines: string[]) {
  // find each X and count each XMAS based in that location
  const dirs = [
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
  ]
  let result = 0
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (lines[y][x] != 'X') {continue}
      for (let d = 0; d < dirs.length; d++) {
        const M = char(lines, x + dirs[d].x * 1, y + dirs[d].y * 1)
        const A = char(lines, x + dirs[d].x * 2, y + dirs[d].y * 2)
        const S = char(lines, x + dirs[d].x * 3, y + dirs[d].y * 3)
        if (M !== 'M') { continue }
        if (A !== 'A') { continue }
        if (S !== 'S') { continue }
        result++
      }
    }
  }
  return result
}

function part2 (lines: string[]) {
  /*
  P1  P2
    P0
  P4  P3
   */
  let result = 0
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (lines[y][x] != 'A') {continue}
      const P1 = char(lines, x - 1, y - 1)
      const P2 = char(lines, x + 1, y - 1)
      const P3 = char(lines, x + 1, y + 1)
      const P4 = char(lines, x - 1, y + 1)
      const code = P1 + P2 + P3 + P4
      if (code === 'MMSS' || code === 'SMMS' || code === 'SSMM' || code === 'MSSM') {
        result++
      }
    }
  }
  return result
}

