import { getData, timer, XY } from './xmas'

type Map = string[][]
type Facing = 'N' | 'E' | 'S' | 'W'

const DIRMAP: Record<Facing, { move: XY, left: Facing, right: Facing }> = {
  'N': { 'move': { x: 0, y: -1 }, 'left': 'W', 'right': 'E' },
  'E': { 'move': { x: 1, y: 0 }, 'left': 'N', 'right': 'S' },
  'S': { 'move': { x: 0, y: 1 }, 'left': 'E', 'right': 'W' },
  'W': { 'move': { x: -1, y: 0 }, 'left': 'S', 'right': 'N' },
}

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function calcBestScores (start: XY, map: string[][]) {
  const bestScores: Record<string, number> = {}
  const todo: { pos: XY, facing: Facing, score: number }[] = [
    { pos: start, facing: 'E', score: 0 }
  ]
  while (todo.length > 0) {
    //console.log( todo)
    const task = todo.shift()
    if (task === undefined) { continue }
    //console.log( {pos})
    if (map[task.pos.y][task.pos.x] === '#') {
      //   console.log('nope #')
      continue
    }
    const code = `${task.pos.x},${task.pos.y},${task.facing}`
    //console.log(code)
    if (bestScores[code] === undefined || bestScores[code] > task.score) {
      //console.log('yup')
      bestScores[code] = task.score
      todo.push({ pos: task.pos, facing: DIRMAP[task.facing].left, score: task.score + 1000 })
      todo.push({ pos: task.pos, facing: DIRMAP[task.facing].right, score: task.score + 1000 })
      todo.push({
        pos: {
          x: task.pos.x + DIRMAP[task.facing].move.x,
          y: task.pos.y + DIRMAP[task.facing].move.y
        }, facing: task.facing, score: task.score + 1
      })

    } else {
      //console.log( 'nope score')
    }
  }
  return bestScores
}

function part1 (lines: string[]) {
  const { start, end, map } = parse(lines)
  const bestScores = calcBestScores(start, map)

  //console.log(bestScores)
  const endCode = `${end.x},${end.y}`
  let result = Math.min(
    bestScores[endCode + ',N'],
    bestScores[endCode + ',E'],
    bestScores[endCode + ',S'],
    bestScores[endCode + ',W'],
  )
  return result
}

function part2 (lines: string[]) {
  const { start, end, map } = parse(lines)
  const bestScores = calcBestScores(start, map)
  // work backwards from best
  const goodPath: Record<string, true> = {}
  const done: Record<string, true> = {}
  const endCode = `${end.x},${end.y}`

  let pt1 = Math.min(
    bestScores[endCode + ',N'],
    bestScores[endCode + ',E'],
    bestScores[endCode + ',S'],
    bestScores[endCode + ',W'],
  )
  const endCodes = [endCode + ',N', endCode + ',E', endCode + ',S', endCode + ',W'].filter(code => bestScores[code] === pt1)
  const todo: string[] = endCodes
  while (todo.length) {
    console.log(todo)
    const state = todo.pop() as string
    const [xT, yT, fT] = state.split(/,/)
    const facing = fT as Facing
    const x = parseInt(xT)
    const y = parseInt(yT)
    if (done[state] === undefined) {
      goodPath[`${x},${y}`] = true
      const turnedLeft = `${x},${y},${DIRMAP[facing].right}`
      const turnedRight = `${x},${y},${DIRMAP[facing].left}`
      const wentForward = `${x - DIRMAP[facing].move.x},${y - DIRMAP[facing].move.y},${facing}`
      console.log( [state,bestScores[state]])
      console.log( ["L",turnedLeft,bestScores[turnedLeft]])
      console.log( ["R",turnedRight,bestScores[turnedRight]])
      console.log( ["F",wentForward,bestScores[wentForward]])
      if (bestScores[turnedLeft] === bestScores[state] - 1000) { todo.push(turnedLeft)}
      if (bestScores[turnedRight] === bestScores[state] - 1000) { todo.push(turnedRight)}
      if (bestScores[wentForward] === bestScores[state] - 1) { todo.push(wentForward)}
    }
  }
  console.log({k:Object.keys(goodPath).length})
  console.log(endCodes)

  let result = 0
  return result
}

// default parse assumes a list of ints per row
function parse (lines: string[]): { map: Map, start: XY, end: XY } {
  const map: string[][] = []
  const start: XY = { x: -1, y: -1 }
  const end: XY = { x: -1, y: -1 }
  for (let row = 0; row < lines.length; row++) {
    map[row] = []
    for (let col = 0; col < lines[0].length; col++) {
      const c = lines[row][col]
      if (c === '#') {
        map[row][col] = '#'
      } else {
        if (c === 'S') {
          start.x = col
          start.y = row
        }
        if (c === 'E') {
          end.x = col
          end.y = row
        }
        map[row][col] = '.'
      }
    }
  }
  return { start, end, map }
}
