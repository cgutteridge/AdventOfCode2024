import fs from 'fs'

export type XY = { x: number, y: number }

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

export function modn (v: bigint, n: bigint) {
  return ((v % n) + n) % n
}