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

type RouteMap = Record<string, Record<string, string>>
const numRoutes: RouteMap = calcRoutes(numPad, numPadR)
const arrowRoutes: RouteMap = calcRoutes(arrowPad, arrowPadR)

//console.log(arrowRoutes)
// what keys need to be push by the controller to push a given key on the controlled, when the controlled finger
// is on the startKey
type ButtonCostMap = Record<string, Record<string, number>>
//console.log(numRoutes)
//console.log('a', metaKeypad(['<^<']))
//console.log('b', metaKeypad(['<<^']))
/*                                                                            +---+---+
                                                                              | ^ | A |
                                                                          +---+---+---+
                                                                          | < | v | > |
                                                                          +---+---+---+*/

const arrowCostMap: ButtonCostMap = makeCostMap(arrowRoutes)
//console.log(arrowCostMap)

/** MAIN */

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

/** FUNCTIONS */

function getTransitions (route: string) {
  const r: string[] = []
  for (let i = 0; i < route.length - 1; i++) {
    r.push(route.substring(i, i + 2))
  }
  return r
}

function routeToCosts (route: string) {
  const tCounts: Record<string, number> = {}
  getTransitions('A' + route).forEach(t => {
    if (tCounts[t] === undefined) {tCounts[t] = 0}
    tCounts[t]++
  })
  return tCounts
}

// the move+clicks we need to do to click a button from a given starting point
function makeCostMap (map: RouteMap): ButtonCostMap {
  const pmap: ButtonCostMap = {}
  console.log(map)
  for (const [from, toMap] of Object.entries(map)) {
    for (const [target, route] of Object.entries(toMap)) {
      const costs = routeToCosts(route)
      pmap[from + target] = costs
    }
  }
  return pmap
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
    */

function calcRoutes (pad: ControlPad, inverted: InversePad): RouteMap {
  const map: RouteMap = {}
  Object.keys(pad).forEach(startKey => {
    map[startKey] = {}
    Object.keys(pad).forEach(endKey => {
      if (startKey !== 'X' && endKey !== 'X') {
        const route = findRouteBetweenKeys(pad, startKey, endKey, inverted)
        map[startKey][endKey] = route + 'A'
      }
    })
  })
  //console.log(map)
  return map
}

function findRouteBetweenKeys (pad: ControlPad, startKey: string, endKey: string, inverted: InversePad) {
  const startPos: XY = pad[startKey]
  const endPos: XY = pad[endKey]
  const move = endPos.subtract(startPos)

  let route = ''
  if (move.x < 0) { route += '<'.repeat(Math.abs(move.x)) }
  if (move.y > 0) { route += 'v'.repeat(Math.abs(move.y)) }
  if (move.y < 0) { route += '^'.repeat(Math.abs(move.y)) }
  if (move.x > 0) { route += '>'.repeat(Math.abs(move.x)) }

  if (!legalMove(pad, inverted, startPos, route)) {
    route = route.split('').reverse().join('')
  }
  return route
}

function legalMove (pad: ControlPad, inverted: InversePad, startPos: XY, route: string): boolean {
  let pos = startPos
  let ok = true
  route.split('').forEach((dir: string) => {
    const step = ARROW_MOVES[dir as ArrowHeading].move as XY
    pos = pos.add(step)
    const char = inverted[codePos(pos)]
    if (char === 'X') {
      ok = false
    }
  })
  return ok
}

function findButtonsToPush (padRoutes: RouteMap, task: string): string {
  let route: string = ''
  let fingerPos = 'A'
  for (let i = 0; i < task.length; i++) {
    const targetPos = task[i]
    const taskRoute = padRoutes[fingerPos][targetPos]
    route += taskRoute
    fingerPos = targetPos
  }
  return route
}

function runRobots (lines: string[], ROBOT_COUNT: number) {
  let result=0
  lines.forEach(line => {

    console.log('\n', { line })
    const buttons = findButtonsToPush(numRoutes, line) as string
    console.log(buttons)
    let costs = routeToCosts(buttons)
    for (let i = 0; i < ROBOT_COUNT; i++) {
      //console.log({i,costs})
      let costsOfController: Record<string, number> = {}
      for (const [action, actionCost] of Object.entries(costs)) {
        const actionsToDoAction = arrowCostMap[action]
        for (const [actionByController, parentActionCost] of Object.entries(actionsToDoAction)) {
          if (costsOfController[actionByController] === undefined) {
            costsOfController[actionByController] = 0
          }
          costsOfController[actionByController] += actionCost * parentActionCost
        }
      }
      costs = costsOfController
    }
    const size = Object.values(costs).reduce((acc, v) => acc + v, 0)
    const num = parseInt(line)
    console.log(size, num)
    result += num * size
  })
  return result
}

// 247296275931658 too high
// 228394212164582 too high
// 154517692795352 FML
function part1 (lines: string[]) {
  return runRobots(lines, 2)
}

function part2 (lines: string[]) {
  return runRobots(lines, 25)
}
