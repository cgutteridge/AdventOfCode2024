import { getData, timer } from './xmas'

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function part1 (lines: string[]) {
  const data = parse(lines)
  let result = 0
  const rules: Record<string, true> = {}
  data.pairs.forEach(pair => rules[pair[0] + ':' + pair[1]] = true)
  data.lists.forEach(list => {
    // review each pair
    for (let i = 0; i < list.length - 1; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const rule = list[j] + ':' + list[i]
        if (rules[rule]) { return }
      }
    }
    const mid = list[list.length / 2 - 0.5]
    result += mid
  })
  return result
}

function part2 (lines: string[]) {
  const data = parse(lines)
  const rules: Record<string, number> = {}
  data.pairs.forEach(pair => rules[pair[0] + ':' + pair[1]] = -1)
  data.pairs.forEach(pair => rules[pair[1] + ':' + pair[0]] = 1)
  let result = 0
  data.lists.forEach(list => {
    // review each pair
    let correct = true
    for (let i = 0; i < list.length - 1; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const rule = list[j] + ':' + list[i]
        if (rules[rule] === -1) { correct = false }
      }
    }
    if (correct) { return}
    list.sort( (a,b) => rules[a+':'+b])
    const mid = list[list.length / 2 - 0.5]
    result += mid
  })
  return result
}

// default parse assumes a list of ints per row
  function parse (lines: string[]) {
    const pairs: number[][] = []
    const lists: number[][] = []
    let i = 0
    while (lines[i] != '') {
      pairs.push(lines[i].split(/\|/).map(cell => parseInt(cell)))
      i++
    }
    i++
    while (i < lines.length) {
      lists.push(lines[i].split(/,/).map(cell => parseInt(cell)))
      i++
    }

    return { pairs, lists }
  }
