import { getData, timer } from './xmas'

const lines = getData()

timer( "Part 1", ()=>part1(lines))
timer( "Part 2", ()=>part2(lines))

type Data = {
  des: string[] // towel designs
  pat: string[] // patterns needed
}

function part1 (lines: string[]) {
  const data: Data = parse(lines)

  let result = 0
  data.pat.forEach( target=>{
    console.log(target)
    const possiblePrefixes = ['']
    const done : Record<string,true>={}
    while( possiblePrefixes.length ) {
      const prefix = possiblePrefixes.shift()
      // try each towel on the prefix
      for( let i=0;i<data.des.length;i++) {
        const consider = prefix+data.des[i]
        if( done[consider] ) {
          continue
        }
        done[consider]=true
        if( consider === target ) {
          result++
          return true
        }
        if( consider === target.substring(0,consider.length)) {
          possiblePrefixes.push(consider)
        }
      }
    }
  })
  return result
}

function part2 (lines: string[]) {
  const data: Data = parse(lines)

  let result = 0
  return result
}

// default parse assumes a list of ints per row
function parse (lines: string[]): Data {
  const des = lines[0].split(/, /)
  lines.shift()
  lines.shift()
  return {des,pat:lines}
}
