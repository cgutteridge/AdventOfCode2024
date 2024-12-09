import { getData, timer } from './xmas'

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function part1 (lines: string[]) {
  const data: number[] = parse(lines)
  const fileCount = (data.length + 1) / 2
  let endIndex = data.length - 1
  let endCount = data[endIndex]
  let startIndex = 0
  let startSpace = data[startIndex]

  let i = 0
  let result = 0
  while (startIndex < endIndex) {
    console.log('-file-')

    // consume the normal file
    for (let filePos = 0; filePos < data[startIndex]; filePos++) {
      const fileNumber = startIndex / 2
      result += i * fileNumber
      console.log({ i, fileNumber })
      i++
    }
    console.log('-gap-')
    startIndex++
    // fill the gap, if we run out file to fill, get a new on from the end
    for (let gapPos = 0; gapPos < data[startIndex]; gapPos++) {
      while (endCount == 0) {
        console.log('prev file')
        console.log({ startIndex, endIndex })
        // skip to the previous file
        endIndex -= 2
        endCount = data[endIndex]
        if (endIndex <= startIndex) { break }
      }
      if (endIndex <= startIndex) { break }
      const fileNumber = endIndex / 2
      result += i * fileNumber
      console.log({ i, fileNumber })
      endCount--
      i++
    }

    startIndex++
  }
  // if there's anything left in the endCount, consume that

  console.log('--tail--')
  const fileNumber = endIndex / 2
  while (endCount > 0) {
    result += i * fileNumber
    console.log({ i, fileNumber })
    i++
    endCount--
  }
  console.log(fileCount)
  console.log(data)
  return result
}

function part2 (lines: string[]) {
  const data: number[] = parse(lines)

  let result = 0
  return result
}

// default parse assumes a list of ints per row
function parse (lines: string[]): number[] {
  const input: number[] = lines[0].split('').map(cell => parseInt(cell))
  return input
}
