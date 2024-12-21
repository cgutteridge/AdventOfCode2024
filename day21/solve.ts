import { ARROW_MOVES, ArrowHeading, codePos, getData, timer, XY } from './xmas'

type ControlPad = Record<string, XY>
type InversePad = Record<string, string>
const numPad: ControlPad = {
  'X': new XY(0, 3),
  '0': new XY(1, 3),
  'A': new XY(2, 3),
  '1': new XY(0, 2),
  '2': new XY(1, 2),
  '3': new XY(2, 2),
  '4': new XY(0, 1),
  '5': new XY(1, 1),
  '6': new XY(2, 1),
  '7': new XY(0, 0),
  '8': new XY(1, 0),
  '9': new XY(2, 0),

}
const arrowPad: ControlPad = {
  '<': new XY(0, 1),
  'v': new XY(1, 1),
  '>': new XY(2, 1),
  'X': new XY(0, 0),
  '^': new XY(1, 0),
  'A': new XY(2, 0),
}
const numPadR: InversePad = invertPad(numPad)
const arrowPadR: InversePad = invertPad(arrowPad)

type RouteMap = Record<string, Record<string, string[]>>
const routes = makeRoutes({ '<': 0, '>': 2, 'v': 2, '^': 0 }, numPadR, new XY(0, 3))
const numRoutes: RouteMap = calcRoutes(numPad, numPadR)
const arrowRoutes: RouteMap = calcRoutes(arrowPad, arrowPadR)

const arrowFastestRoutes: RouteMap = fastestRoutes(arrowRoutes, arrowPad)
process.exit(0)
/** MAIN */

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

/** FUNCTIONS */

function fastestRoutes (routeMap: RouteMap, arrowPad: ControlPad): RouteMap {
  const fastest: RouteMap = {}
  for (const [from, toMap] of Object.entries(routeMap)) {
    fastest[from] = {}
    for (const [to, routes] of Object.entries(toMap)) {
      if (from === 'X' || to === 'X') { continue}
      if (routes.length === 1) {
        fastest[from][to] = routes
      } else {

        const rmap = routes.map(route => metaKeypad(routes))
        console.log({ from, to, routes, rmap })
      }
    }
  }
  return fastest
}

function invertPad (pad: ControlPad) {
  const inverted: InversePad = {}
  for (const [button, pos] of Object.entries(pad)) {
    inverted[codePos(pos)] = button
  }
  return inverted
}

/*
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+
    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
 */

function calcRoutes (pad: ControlPad, inverted: InversePad): RouteMap {
  const map: RouteMap = {}
  Object.keys(pad).forEach(startKey => {
    map[startKey] = {}
    Object.keys(pad).forEach(endKey => {
      const routes = findRoutesBetweenKeys(pad, startKey, endKey, inverted)
      map[startKey][endKey] = routes
    })
  })
  //console.log(map)
  return map
}

function findRoutesBetweenKeys (pad: ControlPad, startKey: string, endKey: string, inverted: InversePad) {
  const startPos: XY = pad[startKey]
  const endPos: XY = pad[endKey]
  const move = endPos.subtract(startPos)
  const moves: Record<ArrowHeading, number> = { '<': 0, '>': 0, 'v': 0, '^': 0 }

  if (move.x < 0) { moves['<'] = Math.abs(move.x) }
  if (move.x > 0) { moves['>'] = Math.abs(move.x) }
  if (move.y < 0) { moves['^'] = Math.abs(move.y) }
  if (move.y > 0) { moves['v'] = Math.abs(move.y) }
  const routes = makeRoutes(moves, inverted, startPos)
  //console.log({ startKey, endKey, startPos, endPos, move, moves, routes })
  return routes
}

function makeRoutes (moves: Record<ArrowHeading, number>, lookup: InversePad, pos: XY) {
  //console.log({moves,pos,lookup})
  const routes: string[] = []
  let noMoreMoves = true
  for (const [move, count] of Object.entries(moves)) {
    if (count > 0) {
      noMoreMoves = false
      const newPos = pos.add(ARROW_MOVES[move as ArrowHeading].move)
      //console.log(lookup[codePos(pos)])
      if (lookup[codePos(pos)] !== 'X') {
        const newMoves = { ...moves }
        newMoves[move as ArrowHeading]--
        const subRoutes = makeRoutes(newMoves, lookup, newPos)
        subRoutes.forEach(subRoute => {
          routes.push(move + subRoute)
        })
      }
    }
  }
  if (noMoreMoves) {return ['']}
  //console.log({moves,pos,routes})

  return routes
}

function findRoutes (padRoutes: RouteMap, task: string): string[] {
  let routes: string[] = ['']
  let fingerPos = 'A'
  for (let i = 0; i < task.length; i++) {
    const targetPos = task[i]
    const taskRoutes = padRoutes[fingerPos][targetPos]
    //console.log({ fingerPos, targetPos, taskRoutes })
    const newRoutes: string[] = []
    routes.forEach(prefixRoute => {
      taskRoutes.forEach(taskRoute => {
        newRoutes.push(prefixRoute + taskRoute + 'A')
      })
    })
    routes = newRoutes
    fingerPos = targetPos
  }
  return routes
}

function onlyShortest (list: string[]): string[] {
  let shortest: number | undefined
  list.forEach(item => {
    if (shortest === undefined || shortest > item.length) { shortest = item.length}
  })
  return list.filter(item => item.length === shortest)
}

function metaKeypad (routes: string[]) {
  const r2all: Record<string, true> = {}
  routes.forEach(r => {
    const r2 = findRoutes(arrowRoutes, r)
    r2.forEach(r2i => {
      r2all[r2i] = true
    })
  })
  const routes2 = onlyShortest(Object.keys(r2all))
  return routes2
}

function part1 (lines: string[]) {
  let result = 0
  const ROBOT_COUNT = 2
  lines.forEach(line => {

    console.log('\n', { line })
    let routes = onlyShortest(findRoutes(numRoutes, line))

    //console.log({routes})
    for (let i = 0; i < ROBOT_COUNT; i++) {
      routes = metaKeypad(routes)
    }

    const num = parseInt(line)
    console.log(routes[0].length, num)
    result += num * routes[0].length
  })
  return result
}

function part2 (lines: string[]) {
  let result = 0
  return result
}
