import { codePos, codeToPos, COMPASS, COMPASS_MOVES, getData, Grid, gridAt, timer, XY } from './xmas'

const lines = getData()

type Data = { map: Grid, start: XY, end: XY }

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function scorePositions (data: Data) {
  const racePos: Record<string, number> = {}
  let pos = data.start
  let routePos = 0
  racePos[codePos(pos)] = routePos
  while (!pos.equals(data.end)) {
    // assume only one legal move
    for (let i = 0; i < COMPASS.length; i++) {
      const candidate = pos.add(COMPASS_MOVES[COMPASS[i]].move)
      if (racePos[codePos(candidate)] === undefined && gridAt(data.map, candidate) === '.') {
        pos = candidate
        routePos++
        racePos[codePos(candidate)] = routePos
        break
      }
    }
  }
  return racePos
}

function part1 (lines: string[]) {
  let result = 0

  const data: Data = parse(lines)
  const racePos = scorePositions(data)
  const cheats: Record<number, number> = {}
  // look at cheats from each position
  Object.keys(racePos).forEach(posCode => {
    const startScore = racePos[posCode]
    const pos = codeToPos(posCode)
    COMPASS.forEach(heading1 => {
      COMPASS.forEach(heading2 => {
        const pos1 = pos.add(COMPASS_MOVES[heading1].move)
        const pos2 = pos1.add(COMPASS_MOVES[heading2].move)
        // ignore moving back to the place we started
        if (pos2.equals(pos)) {
          return
        }
        if (gridAt(data.map, pos1) === '#' && gridAt(data.map, pos2) === '.') {
          // find the change
          const endScore = racePos[codePos(pos2)]
          const diff = endScore - startScore - 2
          if (diff > 0) {
            if (cheats[diff] === undefined) {
              cheats[diff] = 0
            }
            cheats[diff]++
            if (diff >= 100) {
              result++
            }
          }
        }
      })
    })
  })
  return result
}

function part2 (lines: string[]) {
  const data: Data = parse(lines)

  const racePos = scorePositions(data)
  const cheats: Record<number, number> = {}
  const steps = 20
  let result = 0

  // look at cheats from each position
  Object.keys(racePos).forEach(posCode => {
    const startScore = racePos[posCode]
    const pos = codeToPos(posCode)

    for (let y = -steps; y <= steps; y++) {
      const xSize = steps - Math.abs(y)
      for (let x = -xSize; x <= xSize; x++) {
        const cheatLen = Math.abs(x) + Math.abs(y)
        const endPos = pos.add(new XY(x, y))
        if (pos.equals(endPos)) {
          // no move!
          continue
        }
        const endScore = racePos[codePos(endPos)]
        if (endScore === undefined) {
          continue
        }
        const diff = endScore - startScore - cheatLen
        //console.log({endScore,startScore,cheatLen,diff,pos,endPos})
        if (diff >= 100) {
          result++
        }
      }
    }
  })
  return result
}

// default parse assumes a list of ints per row
function parse (lines: string[]): Data {
  const map: string[][] = []
  let start: XY = new XY(NaN, NaN)
  let end: XY = new XY(NaN, NaN)
  for (let row = 0; row < lines.length; row++) {
    map[row] = []
    for (let col = 0; col < lines[0].length; col++) {
      const c = lines[row][col]
      if (c === '#') {
        map[row][col] = '#'
      } else {
        if (c === 'S') {
          start = new XY(col, row)
        }
        if (c === 'E') {
          end = new XY(col, row)
        }
        map[row][col] = '.'
      }
    }
  }
  return { start, end, map }
}
