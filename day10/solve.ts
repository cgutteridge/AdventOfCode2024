import { getData, timer } from './xmas'

const lines = getData()
type GridPos = { col: number, row: number }
type Grid = number[][]

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function p2ScoreTrailhead (data: number[][], trailHead: GridPos) {
  let level = 0
  let levelPoints: { pos: GridPos, count: number }[] = [{ pos: trailHead, count: 1 }]
  while (level < 9) {
    level++
    levelPoints = findRouteCount(data, levelPoints, level)
  }
  return Object.values(levelPoints).reduce( (acc,p)=>acc+p.count,0)
}

type PosScore = { pos: GridPos, count: number }

function findRouteCount (data: Grid, points: PosScore[], target: number) {
  const pointMap: Record<string, PosScore> = {}
  points.forEach(pointScore => {
    const point = pointScore.pos
    if (point.col > 0 && data[point.row][point.col - 1] === target) {
      recordPoint2(pointMap, { col: point.col - 1, row: point.row }, pointScore.count)
    }
    if (point.row > 0 && data[point.row - 1][point.col] === target) {
      recordPoint2(pointMap, { col: point.col, row: point.row - 1 }, pointScore.count)
    }
    if (point.col < data[0].length - 1 && data[point.row][point.col + 1] === target) {
      recordPoint2(pointMap, { col: point.col + 1, row: point.row }, pointScore.count)
    }
    if (point.row < data.length - 1 && data[point.row + 1][point.col] === target) {
      recordPoint2(pointMap, { col: point.col, row: point.row + 1 }, pointScore.count)
    }
  })
  return Object.values(pointMap)
}

function recordPoint2 (pointMap: Record<string, PosScore>, point: GridPos, score: number) {
  const code = `${point.col},${point.row}`
  if (pointMap[code] === undefined) {
    pointMap[code] = { pos: point, count: 0 }
  }
  pointMap[code].count += score
}

function p1ScoreTrailhead (data: number[][], trailHead: GridPos) {
  let level = 0
  let levelPoints: GridPos[] = [trailHead]
  while (level < 9) {
    level++
    levelPoints = findNeighbours(data, levelPoints, level)
  }
  return Object.keys(levelPoints).length
}

function findNeighbours (data: Grid, points: GridPos[], target: number) {
  const pointMap: Record<string, GridPos> = {}
  points.forEach(point => {
    if (point.col > 0 && data[point.row][point.col - 1] === target) {
      recordPoint(pointMap, { col: point.col - 1, row: point.row })
    }
    if (point.row > 0 && data[point.row - 1][point.col] === target) {
      recordPoint(pointMap, { col: point.col, row: point.row - 1 })
    }
    if (point.col < data[0].length - 1 && data[point.row][point.col + 1] === target) {
      recordPoint(pointMap, { col: point.col + 1, row: point.row })
    }
    if (point.row < data.length - 1 && data[point.row + 1][point.col] === target) {
      recordPoint(pointMap, { col: point.col, row: point.row + 1 })
    }
  })
  return Object.values(pointMap)
}

function recordPoint (pointMap: Record<string, GridPos>, point: GridPos) {
  pointMap[`${point.col},${point.row}`] = point
}

function part1 (lines: string[]) {
  const data: Grid = parse(lines)
  const width = data[0].length
  const height = data.length
  let result = 0
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (data[row][col] === 0) {
        const score = p1ScoreTrailhead(data, { col, row })
        result += score
      }
    }
  }
  return result
}

function part2 (lines: string[]) {
  const data: Grid = parse(lines)
  const width = data[0].length
  const height = data.length
  let result = 0
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (data[row][col] === 0) {
        const score = p2ScoreTrailhead(data, { col, row })
        result += score
      }
    }
  }
  return result
}

// default parse assumes a list of ints per row
function parse (lines: string[]): number[][] {
  const input: number[][] = []
  lines.forEach((line) => {
    input.push(line.split('').map(cell => parseInt(cell)))
  })
  return input
}
