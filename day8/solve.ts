import { getData, timer } from './xmas'

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function nodsByFrequency (lines: string[]) {
  const nodesByFrequency: Record<string, { row: number, col: number }[]> = {}
  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      const c = lines[row][col]
      if (c !== '.') {
        if (nodesByFrequency[c] === undefined) {
          nodesByFrequency[c] = []
        }
        nodesByFrequency[c].push({ row, col })
      }
    }
  }
  return nodesByFrequency
}

function part1 (lines: string[]) {
  const width = lines[0].length
  const height = lines.length
  const nodesByFrequency = nodsByFrequency(lines)
  // find antinodes
  const antinodes: Record<string, true> = {}
  Object.keys(nodesByFrequency).forEach(frequency => {

    for (let a = 0; a < nodesByFrequency[frequency].length - 1; a++) {
      for (let b = a + 1; b < nodesByFrequency[frequency].length; b++) {
        const nodeA = nodesByFrequency[frequency][a]
        const nodeB = nodesByFrequency[frequency][b]
        const rDiff = nodeB.row - nodeA.row
        const cDiff = nodeB.col - nodeA.col
        const thisAntinodes =
          [
            { col: nodeA.col - cDiff, row: nodeA.row - rDiff },
            { col: nodeB.col + cDiff, row: nodeB.row + rDiff }
          ]
        thisAntinodes.forEach(node => {
          if (node.col >= 0 && node.col < width && node.row >= 0 && node.row < height) {
            antinodes[`${node.row},${node.col}`] = true
          }
        })
      }
    }
  })
  let result = Object.keys(antinodes).length
  return result
}

function part2 (lines: string[]) {
  const width = lines[0].length
  const height = lines.length
  const nodesByFrequency = nodsByFrequency(lines)
  // find antinodes
  const antinodes: Record<string, true> = {}
  Object.keys(nodesByFrequency).forEach(frequency => {

    for (let a = 0; a < nodesByFrequency[frequency].length - 1; a++) {
      for (let b = a + 1; b < nodesByFrequency[frequency].length; b++) {
        const nodeA = nodesByFrequency[frequency][a]
        const nodeB = nodesByFrequency[frequency][b]
        const rDiff = nodeB.row - nodeA.row
        const cDiff = nodeB.col - nodeA.col
        let node = nodeA
        while (true) {
          if (node.col < 0 || node.col >= width || node.row < 0 || node.row >= height) {
            break
          }
          antinodes[`${node.row},${node.col}`] = true
          node = { row: node.row - rDiff, col: node.col - cDiff }
        }
        node = nodeB
        while (true) {
          if (node.col < 0 || node.col >= width || node.row < 0 || node.row >= height) {
            break
          }
          antinodes[`${node.row},${node.col}`] = true
          node = { row: node.row + rDiff, col: node.col + cDiff }
        }
      }
    }
  })
  let result = Object.keys(antinodes).length
  return result
}
