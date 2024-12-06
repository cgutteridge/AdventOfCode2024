import { getData, timer } from './xmas'

let dirs = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 }
]

const lines = getData()

function findStart (lines: string[]) {
  for (let yi = 0; yi < lines.length; yi++) {
    for (let xi = 0; xi < lines[0].length; xi++) {
      if (lines[yi][xi] === '^') {
        return { x: xi, y: yi }
      }
    }
  }
  return { x: NaN, y: NaN }
}

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function findRoute (lines: string[]) {
  let { x, y } = findStart(lines)
  let dir = 0

  const visited: Record<string, { x: number, y: number }> = {}
  while (true) {
    const xp = x + dirs[dir].x
    const yp = y + dirs[dir].y
    if (xp == -1 || xp == lines[0].length || yp == -1 || yp == lines.length) { break }
    const c = lines[yp][xp]
    if (c === '#') {
      dir = (dir + 1) % 4
    } else {
      x = xp
      y = yp
      visited[`${x},${y}`] = { x, y }
    }
  }
  return visited
}

function part1 (lines: string[]) {
  // find the start location and direction
  const visited = findRoute(lines)
  let result = Object.keys(visited).length
  return result
}

function part2 (lines: string[]) {
  let { x: sx, y: sy } = findStart(lines)
  let dir = 0
  let result = 0
  const visited = findRoute(lines)
  Object.values(visited).forEach(visit => {
    if (visit.x == sx && visit.y == sy) { return }
    const vary = [...lines]
    vary[visit.y] = vary[visit.y].slice(0, visit.x) + '#' + vary[visit.y].slice(visit.x + 1)
    const visited: Record<string, true> = {}
    dir = 0
    let x = sx
    let y = sy
    while (true) {
      const xp = x + dirs[dir].x
      const yp = y + dirs[dir].y
      if (xp == -1 || xp == vary[0].length || yp == -1 || yp == vary.length) {
        break
      }
      const c = vary[yp][xp]
      if (c === '#') {
        dir = (dir + 1) % 4
      } else {
        x = xp
        y = yp
        const code = `${x},${y},${dir}`
        if (visited[code]) {
          result++
          break
        }
        visited[code] = true
      }
    }
  })
  return result
}
