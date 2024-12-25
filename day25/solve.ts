import { getData, timer } from './xmas'

const lines = getData()
type Data = {
  keys: number[][]
  locks: number[][]
}

timer('Part 1', () => part1(lines))

//timer('Part 2', () => part2(lines))

function part1 (lines: string[]) {
  const data: Data = parse(lines)
  // console.log(data)
  let result = 0
  data.keys.forEach(key => {
    data.locks.forEach(lock => {
      let fit = true
      for (let t = 0; t < 5; t++) {
        if (lock[t] + key[t] > 5) { fit = false}
      }
      if (fit) { result++}
    })
  })
  return result
}

function part2 (lines: string[]) {
  const data: Data = parse(lines)

  let result = 0
  return result
}

// default parse assumes a list of ints per row
function parse (lines: string[]): Data {
  const locks: number [][] = []
  const keys: number[][] = []
  for (let i = 0; i < lines.length; i += 8) {
    let base = i + 1
    let dir = 1
    if (lines[i] === '#####') {
      //console.log('key')
    } else {
      dir = -1
      base = i + 5
      //console.log('lock')
    }
    const thing: number[] = []
    for (let tumbler = 0; tumbler < 5; tumbler++) {
      let h = 0
      //console.log(lines[base+dir*h][tumbler] )
      while (lines[base + dir * h][tumbler] === '#') {
        // console.log({ i, tumbler, base, dir, h, Y: base + dir * h, C: lines[base + dir * h][tumbler] })
        h++
      }
      thing.push(h)
    }
    if (lines[i] === '#####') {
      keys.push(thing)
    } else {
      locks.push(thing)
    }
  }
  return { locks, keys }
}
