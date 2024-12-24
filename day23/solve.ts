import { getData, timer } from './xmas'

const lines = getData()

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function process (data: string[][]) {
  // find groups of 3?!
  // from => to
  const links: Record<string, Record<string, true>> = {}
  const computerSet: Record<string, boolean> = {}
  data.forEach(link => {
    if (links[link[0]] === undefined) { links[link[0]] = {}}
    links[link[0]][link[1]] = true
    if (links[link[1]] === undefined) { links[link[1]] = {}}
    links[link[1]][link[0]] = true
    computerSet[link[0]] = true
    computerSet[link[1]] = true
  })
  const nodes = Object.keys(computerSet)
  return { links, nodes }
}

function part1 (lines: string[]) {
  const data: string[][] = parse(lines)
  const { links, nodes } = process(data)
  const combos: Record<string, true> = {}

  data.forEach(link => {
    nodes.forEach(node => {
      if (node === link[0] || node === link[1]) {return}
      if (links[link[0]][node] && links[link[1]][node]) {
        if (startsWith(node, 't') || startsWith(link[0], 't') || startsWith(link[1], 't')) {
          const code = [link[0], link[1], node].sort().join(',')
          combos[code] = true
        }
      }
    })
  })
  let result = Object.keys(combos).length
  return result
}

function startsWith (str: string, start: string): boolean {
  return str.substring(0, start.length) === start
}

function uniqueSets (sets: string[][]): string[][] {
  const o: Record<string, string[]> = {}
  sets.forEach(set => o[set.sort().join(',')] = set)
  return Object.values(o)
}

function merge(set1:string[], set2:string[]) {
  const o: Record<string, true> = {}
  set1.forEach(item => o[item]=true)
  set2.forEach(item => o[item]=true)
  return Object.keys(o).sort()
}

function part2 (lines: string[]) {
  // revised plan, merge sets until no more mergers are possible
  const data: string[][] = parse(lines)
  const { links, nodes } = process(data)

  nodes.forEach( node=>{
    const l = Object.keys(links[node]).length
    console.log({l,node})
  })
  console.log(nodes.length)
  let sets: string[][] = []
  Object.keys(links).forEach(from => {
    Object.keys(links[from]).forEach(to => {
      sets.push([to, from].sort())
    })
  })
  sets = uniqueSets(sets)
  let merged = true
  let notMerged: string[][] = []
  while (merged) {
    const newSets : string[][] = []
    //try and merge every set into every other. Any that merge into none goes into the notMerged list
    sets.forEach(set1 => {
      let joined=false
      sets.forEach(set2 => {
        if (setSame(set1, set2)) { return }
        // see if we can join any of these sets
        // does every item in set1 link to every item in set2?
        const canMerge = canMergeSets( set1,set2,links)
        //console.log( {canMerge,set1,set2})
        newSets.push( merge(set1,set2))
        merged=true
        joined = true
      })
      if( !joined ) {
        notMerged.push(set1)
      }
    })
    sets=uniqueSets(newSets)
    console.log( sets.length)
  }

  console.log(sets)
  let result = 0
  return result
}



function canMergeSets(set1:string[],set2:string[],links:Record<string,Record<string,true>>):boolean {
  for (let i = 0; i < set1.length; i++) {
    for (let j = 0; j < set2.length; j++) {
      if (set1[i] !== set2[j] && links[set1[i]][set2[j]] === undefined) {
        return false
      }
    }
  }
  return true;
}

function setSame (set1: string[], set2: string[]): boolean {
  return set1.sort().join(',') === set2.sort().join(',')
}

// default parse assumes a list of ints per row
function parse (lines: string[]): string[][] {
  const input: string[][] = []
  lines.forEach((line) => {
    input.push(line.split(/-/))
  })
  return input
}
