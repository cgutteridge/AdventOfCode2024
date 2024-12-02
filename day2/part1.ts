import { getData } from './xmas'

const lines = getData()

part1(lines)

part2(lines)

function part2 (lines: string[]) {
  const data: number[][] = parse(lines)
  const part2 = data.reduce((score: number, rawRow: number[]) => {
    const cookedRows=[rawRow]
    for(let i=0;i<rawRow.length;i++) {
      const cookedRow = [...rawRow]
      cookedRow.splice(i,1)
      cookedRows.push(cookedRow)
    }
    for(let i=0;i<cookedRows.length;i++ ) {
      if( rowPass(cookedRows[i])) {
        return score+1
      }
    }
    return score
  }, 0)
  console.log({part2})

}

function rowPass(row:number[]) {
  const d = dir(row[0], row[1])
  for (let i = 0; i < row.length - 1; i++) {
    const change = diff(row[i], row[i + 1])
    const direction = dir(row[i], row[i + 1])
    if (change == 0) {return false}
    if( change > 3) { return false}
    if( d!==direction) { return false}
  }
  return true
}

function dir (a: number, b: number): number {
  return (b - a) / Math.abs(b - a)
}

function diff (a: number, b: number): number {
  return Math.abs(b - a)
}

function part1 (lines: string[]) {
  const data: number[][] = parse(lines)
  const part1 = data.reduce((score: number, row: number[]) => {
    // safe or unsafe
    // work out direction
    const d = dir(row[0], row[1])
    for (let i = 0; i < row.length - 1; i++) {
      const change = diff(row[i], row[i + 1])
      const direction = dir(row[i], row[i + 1])
      if (change == 0) {return score}
      if( change > 3) { return score}
      if( d!==direction) { return score}
    }
    return score+1
  }, 0)
  console.log({part1})
}

function parse (lines: string[]): number[][] {
  const input: number[][] = []
  lines.forEach((line) => {
    input.push(line.split(/ +/).map(cell => parseInt(cell)))
  })
  return input
}
