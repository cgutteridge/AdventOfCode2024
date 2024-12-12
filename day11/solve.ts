import { getData, timer } from './xmas'

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

type StoneList = {
  value: number
  next: StoneList | undefined
}

function part1 (lines: string[]) {
  const data: number[] = parse(lines)
  let list: StoneList = makeList(data)
  for (let blinkNumber = 1; blinkNumber <= 25; blinkNumber++) {
    blink(list)
  }
  let result = listLength(list)
  return result
}

function listLength (list: StoneList) {
  let stone: StoneList | undefined = list
  let count = 0
  while (stone !== undefined) {
    stone = stone.next
    count++
  }
  return count
}

// alters the list
function blink (list: StoneList) {
  let stone: StoneList | undefined = list
  while (stone !== undefined) {
    // process stone
    if (stone.value === 0) {
      stone.value = 1
    } else {
      const str = `${stone.value}`
      if (str.length % 2 == 0) {
        const s1 = parseInt(str.substring(0, str.length / 2))
        const s2 = parseInt(str.substring(str.length / 2))
        stone.value = s1
        const after: StoneList | undefined = stone.next
        stone.next = { value: s2, next: after }
        stone = stone.next
      } else {
        stone.value *= 2024
      }
    }
    stone = stone.next
  }
}

function outputList (list: StoneList) {
  let cursor: StoneList | undefined = list
  while (cursor !== undefined) {
    process.stdout.write(`${cursor.value} `)
    cursor = cursor.next
  }
  process.stdout.write('\n')
}

function makeList (data: number[]): StoneList {
  const head: StoneList = { value: data[0], next: undefined }
  let cursor = head
  for (let i = 1; i < data.length; ++i) {
    cursor.next = { value: data[i], next: undefined }
    cursor = cursor.next
  }
  return head
}

type Cache = Record<number, Record<number, number>>

function finalLength (cache: Cache, value: number, remainingBlinks: number): number {
  if (remainingBlinks === 0) {
    return 1
  }
  if (cache[remainingBlinks] !== undefined && cache[remainingBlinks][value] !== undefined) {
    return cache[remainingBlinks][value]
  }
  const list: number[] = []
  if (value === 0) {
    list.push(1)
  } else {
    const str = `${value}`
    if (str.length % 2 == 0) {
      list.push(parseInt(str.substring(0, str.length / 2)))
      list.push(parseInt(str.substring(str.length / 2)))
    } else {
      list.push(value * 2024)
    }
  }
  let result = 0
  list.forEach(listItem => result += finalLength(cache, listItem, remainingBlinks - 1))
  if (cache[remainingBlinks] === undefined) {
    cache[remainingBlinks] = {}
  }
  cache[remainingBlinks][value] = result
  return result
}

// cache maps a number and a remaining number of blinks to a final length
function part2 (lines: string[]) {
  const data: number[] = parse(lines)
  const cache: Cache = {}
  let result = 0
  for (let i = 0; i < data.length; i++) {
    result += finalLength(cache, data[i], 75)
  }
  return result
}

// default parse assumes a list of ints per row
function parse (lines: string[]): number[] {
  return lines[0].split(/ +/).map(cell => parseInt(cell))
}
