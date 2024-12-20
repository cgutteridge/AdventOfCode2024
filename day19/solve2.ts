import { getData, timer } from './xmas'

const lines = getData()

timer('Part 2', () => part2(lines))

type Data = {
  des: string[] // towel designs
  pat: string[] // patterns needed
}

function part2 (lines: string[]) {
  const data: Data = parse(lines)

  let result = 0
  data.pat.forEach(target => {
    console.log(target)
    const possiblePrefixes = ['']
    let possible = false
    const routes: Record<string, { prefix: string, towel: string }[]> = {}
    while (possiblePrefixes.length) {
      const prefix = possiblePrefixes.shift() as string
      // try each towel on the prefix
      for (let i = 0; i < data.des.length; i++) {
        const consider = prefix + data.des[i]
        if (routes[consider] !== undefined) {
          routes[consider].push({ prefix, towel: data.des[i] })
          continue
        }
        routes[consider] = [{ prefix, towel: data.des[i] }]
        if (consider === target) {
          possible = true
        }
        if (consider === target.substring(0, consider.length)) {
          possiblePrefixes.push(consider)
        }
      }
    }
    //console.log(routes)
    //console.log({ possible })
    if( ! possible ) { return }
    // score routes
    const scores: Record<string, number> = { '': 1 }
    const todo = Object.keys(routes)
    while (scores[target] === undefined) {
      const consider = todo.shift() as string
      //console.log({ consider })
      let allPrefixesScored = true
      let score = 0
      routes[consider].forEach(route => {
        if (scores[route.prefix] === undefined) {
          allPrefixesScored = false
        } else {
          score += scores[route.prefix]
        }
      })
      if (allPrefixesScored) {
        scores[consider] = score
      } else {
        // try again later
        todo.push(consider)
      }
    }
    console.log({ways:scores[target],target})
    result+=scores[target]
  })
  return result
}

// default parse assumes a list of ints per row
function parse (lines: string[]): Data {
  const des = lines[0].split(/, /)
  lines.shift()
  lines.shift()
  return { des, pat: lines }
}
