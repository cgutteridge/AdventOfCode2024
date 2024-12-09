import { getData, timer } from './xmas'

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function part1 (lines: string[]) {
  const data: number[] = parse(lines)

  // ok let's just do this the naive way instead
  const disk: number[] = []
  let index = 0
  let file = 0
  let gaps = 0
  while (index < data.length) {
    // add file
    for (let i = 0; i < data[index]; i++) {
      disk.push(file)
    }
    index++
    if (index >= data.length) {break}
    // gap
    for (let i = 0; i < data[index]; i++) {
      disk.push(-1)
      gaps++
    }
    index++
    file++
  }

  let filling = 0
  while (gaps > 0) {
    // find the next gap
    while (disk[filling] !== -1) {
      filling++
    }
    // get the first non -1 from the end
    while (disk[disk.length - 1] === -1) {
      disk.pop()
      gaps--
    }
    if (gaps === 0) { break }

    // take the item from the end and put it in the gap
    const chunk: number = disk.pop() as number
    disk[filling] = chunk
    gaps--
    filling++
  }

  let result = 0
  for (let i = 0; i < disk.length; i++) {
    result += i * disk[i]
  }
  return result
}

function part2 (lines: string[]) {
  const data: number[] = parse(lines)

  // ok let's just do this the naive way instead
  const disk: number[] = []
  let index = 0 // index in data
  let file = 0
  let gaps: { pos: number, size: number }[] = [] // pair of gap position and size
  let files: { pos: number, size: number, id: number }[] = []
  while (index < data.length) {
    // add file
    files.push({ pos: disk.length, size: data[index], id: index / 2 })
    for (let i = 0; i < data[index]; i++) {
      disk.push(file)
    }
    index++
    if (index >= data.length) {break}
    // gap
    gaps.push({ pos: disk.length, size: data[index] })
    for (let i = 0; i < data[index]; i++) {
      disk.push(-1)
    }
    index++
    file++
  }
  //console.log(disk)

  // working backwards
  for (let fileIndex = files.length - 1; fileIndex >= 0; fileIndex--) {
    //console.log('=====')
    //console.log({ fileIndex, disk, gaps })

    // attempt to move file to first big enough gap
    for (let gapIndex = 0; gapIndex < gaps.length; gapIndex++) {
      //console.log({ tryindex: gapIndex, fileSize: files[fileIndex].size, gapSize: gaps[gapIndex].size })
      if (gaps[gapIndex].pos > files[fileIndex].pos) { break } // no move
      if (gaps[gapIndex].size >= files[fileIndex].size) {
        // it fits!
        //console.log({ a: 'moving', fileIndex, gapIndex })
        for (let i = 0; i < files[fileIndex].size; i++) {
          disk[gaps[gapIndex].pos + i] = files[fileIndex].id
          disk[files[fileIndex].pos + i] = -1
        }
        // reduce target gap
        gaps[gapIndex].size -= files[fileIndex].size
        gaps[gapIndex].pos += files[fileIndex].size
        // now heal from gaps
        // work out gaps in play...
        //X     MOVED(fileIndex=1)
        //f0 g0 f1     g1 f2
        const previousGap = fileIndex - 1
        gaps[previousGap].size += files[fileIndex].size
        // if there's a gap after this file
        if (gaps[fileIndex] !== undefined) {
          gaps[previousGap].size += gaps[fileIndex].size
          gaps[fileIndex].size = 0
        }
        break
      }
    }
  }

  //console.log(disk.join(''))
  let result = 0
  for (let i = 0; i < disk.length; i++) {
    if(disk[i]!==-1) {
      result += i * disk[i]
    }
  }
  //console.log({ disk })
  return result
}

// default parse assumes a list of ints per row
function parse (lines: string[]): number[] {
  const input: number[] = lines[0].split('').map(cell => parseInt(cell))
  return input
}
