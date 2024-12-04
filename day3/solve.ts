import { getData, timer } from './xmas'

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function part1 (lines: string[]) {
  const matches = [...lines.join('\n').matchAll(/mul\((\d+),(\d+)\)/g)]
  let part1 = 0
  matches.forEach(match => {
    const i = parseInt(match[1]) * parseInt(match[2])
    part1 += i
  })
  return part1
}

function part2 (lines: string[]) {
  const matches = [...lines.join('\n').matchAll(/(do\(\)|don't\(\)|mul\((\d+),(\d+)\))/g)]
  let result = 0
  let enabled = true
  matches.forEach(match => {
    if (match[0] === 'do()') {
      enabled = true
      return
    }
    if (match[0] === 'don\'t()') {
      enabled = false
      return
    }
    if (enabled) {
      const i = parseInt(match[2]) * parseInt(match[3])
      result += i
    }
  })
  return result
}
