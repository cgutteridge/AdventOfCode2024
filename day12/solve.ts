import { getData, timer } from './xmas'

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

type GridPos = { row: number, col: number }

function findRegions (lines: string[]) {
  const regions: { row: number, col: number }[][] = []
  const map: Record<string, number> = {}
  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[0].length; col++) {
      const code = `${col},${row}`
      if (map[code] !== undefined) {
        continue
      }
      // cell is not in a current region
      regions.push([])
      // find all connected cells
      const regionChar = lines[row][col]
      const found: GridPos[] = []
      const toScan = [{ row, col }]
      while (toScan.length > 0) {
        const candidate: GridPos | undefined = toScan.pop()
        if (candidate === undefined) { break }
        //console.log( {regionChar,candidate})
        // if it's out of the grid, skip
        if (candidate.row < 0 || candidate.row >= lines.length || candidate.col < 0 || candidate.col >= lines[0].length) {
          //console.log( "NOPE: out of range")
          continue
        }
        // if it's already done, skip
        if (map[`${candidate.col},${candidate.row}`] !== undefined) {
          //console.log( 'NOPE: already mapped')
          continue
        }
        if (lines[candidate.row][candidate.col] === regionChar) {
          const regionIndex = regions.length - 1
          map[`${candidate.col},${candidate.row}`] = regionIndex
          regions[regionIndex].push(candidate)
          toScan.push({ row: candidate.row, col: candidate.col - 1 })
          toScan.push({ row: candidate.row, col: candidate.col + 1 })
          toScan.push({ row: candidate.row - 1, col: candidate.col })
          toScan.push({ row: candidate.row + 1, col: candidate.col })
        } else {
          //console.log( "NOPE: different region")
        }
      }
    }
  }
  return regions
}

function part1 (lines: string[]) {
  // find all regions. A region is a list of c,r coordinates
  const regions = findRegions(lines)

  //console.log({ map, regions })
  let result = 0
  regions.forEach(region => {
    const regionChar = lines[region[0].row][region[0].col]
    let edges = region.length * 4
    region.forEach(cell => {
      const neighbours: GridPos[] = []
      if (cell.col > 0) { neighbours.push({ row: cell.row, col: cell.col - 1 })}
      if (cell.col < lines[0].length - 1) { neighbours.push({ row: cell.row, col: cell.col + 1 })}
      if (cell.row > 0) { neighbours.push({ row: cell.row - 1, col: cell.col })}
      if (cell.row < lines.length - 1) { neighbours.push({ row: cell.row + 1, col: cell.col })}
      neighbours.forEach(neighbour => {
        if (lines[neighbour.row][neighbour.col] === regionChar) {
          edges -= 1
        }
      })
    })
    //console.log({ edges, l: region.length })
    result += edges * region.length
  })
  return result
}

function part2 (lines: string[]) {
  // find all regions. A region is a list of c,r coordinates
  const regions = findRegions(lines)

  //console.log({ map, regions })
  // edges are h/v above or to the left of the node they are numbered after
  let result = 0
  regions.forEach(region => {
    let edgeMap: Record<string, true> = {}
    const regionChar = lines[region[0].row][region[0].col]
    region.forEach(cell => {
      const neighbours: GridPos[] = []
      if (cell.col === 0 || cell.col > 0 && lines[cell.row][cell.col - 1] !== regionChar) {
        // line to the left
        edgeMap[`${cell.col},${cell.row},L`] = true
      }

      if (cell.col === lines[0].length - 1 || cell.col < lines[0].length - 1 && lines[cell.row][cell.col + 1] !== regionChar) {
        // line to the right
        edgeMap[`${cell.col + 1},${cell.row},R`] = true
      }

      if (cell.row === 0 || cell.row > 0 && lines[cell.row - 1][cell.col] !== regionChar) {
        // line to the top
        edgeMap[`${cell.col},${cell.row},T`] = true
      }

      if (cell.row === lines.length - 1 || cell.row < lines.length - 1 && lines[cell.row + 1][cell.col] !== regionChar) {
        // line to the bottom
        edgeMap[`${cell.col},${cell.row + 1},B`] = true
      }
    })
    // remove connected lines. nb. go one to the right of the grid size for final lines
    for (let row = 0; row <= lines.length; row++) {
      for (let col = 0; col <= lines[0].length; col++) {
        if (edgeMap[`${col},${row},T`]) {
          let i = 1
          while (edgeMap[`${col + i},${row},T`]) {
            delete edgeMap[`${col + i},${row},T`]
            i++
          }
        }
        if (edgeMap[`${col},${row},L`]) {
          let i = 1
          while (edgeMap[`${col},${row + i},L`]) {
            delete edgeMap[`${col},${row + i},L`]
            i++
          }
        }
        if (edgeMap[`${col},${row},B`]) {
          let i = 1
          while (edgeMap[`${col + i},${row},B`]) {
            delete edgeMap[`${col + i},${row},B`]
            i++
          }
        }
        if (edgeMap[`${col},${row},R`]) {
          let i = 1
          while (edgeMap[`${col},${row + i},R`]) {
            delete edgeMap[`${col},${row + i},R`]
            i++
          }
        }
      }

    }
    result += Object.keys(edgeMap).length * region.length
  })
  return result
}

// default parse assumes a list of ints per row
function parse (lines: string[]): number[][] {
  const input: number[][] = []
  lines.forEach((line) => {
    input.push(line.split(/ +/).map(cell => parseInt(cell)))
  })
  return input
}
