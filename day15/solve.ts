import { getData, timer, XY } from './xmas'

type Grid = string[][]
type Moves = string[]

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function part1 (lines: string[]) {

  const DIRMAP: Record<string, XY> = {
    '>': { x: 1, y: 0 },
    '<': { x: -1, y: 0 },
    '^': { x: 0, y: -1 },
    'v': { x: 0, y: 1 },
  }

  const p = parse(lines)
  const grid = p.grid
  const moves = p.moves
  const roboPos = p.start

  moves.forEach(moveCode => {
    /*
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        if (row === roboPos.y && col === roboPos.x) {
          process.stdout.write('@')
          //process.stdout.write(grid[row][col])

        } else {
          process.stdout.write(grid[row][col])
        }
      }
      process.stdout.write('\n')
    }

     */
    const move = DIRMAP[moveCode]
    //console.log({ roboPos, moveCode, move })
    const target = grid[roboPos.y + move.y][roboPos.x + move.x]
    // wall, no move
    if (target === '#') {
      // null
      return
    }
    // space: move
    if (target === '.') {
      roboPos.x += move.x
      roboPos.y += move.y
      return
    }

    if (target === 'O') {
      // box!
      // work out last box
      let boxEnd = 2
      while (grid[roboPos.y + move.y * boxEnd][roboPos.x + move.x * boxEnd] === 'O') { boxEnd++ }
      if (grid[roboPos.y + move.y * boxEnd][roboPos.x + move.x * boxEnd] === '.') {
        //console.log( 'push!', boxEnd)
        // it's a push!
        grid[roboPos.y + move.y * boxEnd][roboPos.x + move.x * boxEnd] = 'O'
        grid[roboPos.y + move.y][roboPos.x + move.x] = '.'
        roboPos.x += move.x
        roboPos.y += move.y
      }
      return
    }
    // otherwise nothing
  })
  //console.log(p)
  let result = 0
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === 'O') {
        result += 100 * row + col
      }
    }
  }
  return result
}

function drawGrid (grid: string[][], roboPos: XY) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {

      if (row === roboPos.y && col === roboPos.x) {
        process.stdout.write('' + '@')
        //process.stdout.write(grid[row][col])
      } else {
        process.stdout.write('' + grid[row][col])
      }
    }
    process.stdout.write('\n')
  }
}

function part2 (lines: string[]) {

  const DIRMAP: Record<string, XY> = {
    '>': { x: 1, y: 0 },
    '<': { x: -1, y: 0 },
    '^': { x: 0, y: -1 },
    'v': { x: 0, y: 1 },
  }

  const p = parse(lines)
  const grid = p.grid.map(rawRow => {
    const row: string[] = []
    rawRow.forEach(c => {
      if (c === '#') { row.push('#', '#')}
      if (c === '.') { row.push('.', '.')}
      if (c === 'O') { row.push('[', ']')}
    })
    return row
  })
  const moves = p.moves
  const roboPos = p.start
  roboPos.x *= 2

  moves.forEach(moveCode => {
   // drawGrid(grid, roboPos)

    const move = DIRMAP[moveCode]
    //console.log({ roboPos, moveCode, move })
    //console.log( {move})
    if (playerCanMove(grid, roboPos, move)) {
      //console.log('do it')
      doMove(grid, roboPos, move)
    }

    // otherwise nothing
  })
  //drawGrid(grid,roboPos)
  //console.log(p)
  let result = 0
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === '[') {
        result += 100 * row + col
      }
    }
  }
  return result
}

function doMove (grid: Grid, pos: XY, move: XY) {
  //console.log('move ',{pos,move})
  const target = grid[pos.y + move.y][pos.x + move.x]
  if (target === '[' || target === ']') {
    moveBox(grid,  boxPos(grid, {
      y: pos.y + move.y,
      x: pos.x + move.x
    }), move)
  }
  pos.x += move.x
  pos.y += move.y
}

// assume box can move
function moveBox (grid: Grid, pos: XY, move: XY) {

  // it's a box..
  // left and right
  if (move.y === 0) {
    //console.log( "mv box H")
    const targetPos = { x: move.x === 1 ? pos.x + 2 : pos.x + move.x, y: pos.y }
    const target = grid[targetPos.y][targetPos.x]
    if (target === '[' || target === ']') {
      moveBox(grid, boxPos(grid,targetPos), move)
    }
  } else {
    // moving up or down
    const targetPos1 = { x: pos.x, y: pos.y + move.y }
    const targetPos2 = { x: pos.x + 1, y: pos.y + move.y }
    const target1 = grid[targetPos1.y][targetPos1.x]
    const target2 = grid[targetPos2.y][targetPos2.x]
    //console.log( "mv box V",{pos,target1,target2})

    if (target1 === '[' || target1 === ']') {
      //console.log('move left')
      moveBox(grid, boxPos(grid,targetPos1), move)
    }
    if (target2 === '[' ) { // left side of a box
      //console.log('move right')
      moveBox(grid, boxPos(grid,targetPos2), move)
    }
  }

  grid[pos.y][pos.x] = '.'
  grid[pos.y][pos.x + 1] = '.'
  grid[pos.y + move.y][pos.x + move.x] = '['
  grid[pos.y + move.y][pos.x + move.x + 1] = ']'
}

function playerCanMove (grid: Grid, pos: XY, move: XY) {
  const target = grid[pos.y + move.y][pos.x + move.x]
  if (target === '.') { return true }
  if (target === '[' || target === ']') {
    return boxCanMove(grid, boxPos(grid, {
      y: pos.y + move.y,
      x: pos.x + move.x
    }), move)
  }
  return false
}

function boxPos (grid: Grid, pos: XY): XY {
  if (grid[pos.y][pos.x] === '[') {return pos}
  if (grid[pos.y][pos.x] === ']') {return { x: pos.x - 1, y: pos.y }}
  throw new Error('argh!')
}

// pos is always the left bit of box
function boxCanMove (grid: Grid, pos: XY, move: XY) {

  // it's a box..
  // left and right
  if (move.y === 0) {
    const targetPos = { x: move.x === 1 ? pos.x + 2 : pos.x + move.x, y: pos.y }
    const target = grid[targetPos.y][targetPos.x]
    if (target === '.') { return true}
    if (target === '#') {return false}
    // another box horizontally
    return boxCanMove(grid, boxPos(grid, targetPos), move)
  }

  // moving up or down
  const targetPos1 = { x: pos.x, y: pos.y + move.y }
  const targetPos2 = { x: pos.x + 1, y: pos.y + move.y }
  const target1 = grid[targetPos1.y][targetPos1.x]
  const target2 = grid[targetPos2.y][targetPos2.x]

  if (target1 === '.' && target2 === '.') { return true}
  if (target1 === '#' || target2 === '#') { return false}

  if (target1 === '[' || target1 === ']') {
    if (!boxCanMove(grid, boxPos(grid, targetPos1), move)) {
      return false
    }
  }
  if (target2 === '[' || target2 === ']') {
    if (!boxCanMove(grid, boxPos(grid, targetPos2),move)) {
      return false
    }
  }
  return true
}

// default parse assumes a list of ints per row
function parse (lines: string[]): { grid: Grid, moves: Moves, start: XY } {
  const input: number[][] = []
  let i = 0
  const start: XY = { x: -1, y: -1 }
  const grid: Grid = []
  let moves: Moves = []
  while (lines[i] !== '') {
    const row: string[] = []
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] == '@') {
        row.push('.')
        start.x = j
        start.y = i
      } else {
        row.push(lines[i][j])
      }
    }

    grid.push(row)
    i++
  }
  i++
  while (i < lines.length) {
    moves = moves.concat(lines[i].split(''))
    i++
  }
  return { moves, grid, start }
}
