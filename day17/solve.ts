import { getData, modn, timer } from './xmas'

const lines = getData()
type Input = {
  a: bigint,
  b: bigint,
  c: bigint,
  program: number[]
}

timer('Part 1', () => part1(lines))
timer('Part 2', () => part2(lines))

function runProg (data: Input) {
  function combo (op: number) {
    if (op < 4) { return BigInt(op) }
    if (op === 4) {return data.a}
    if (op === 5) {return data.b}
    if (op === 6) {return data.c}
    throw new Error('unlucky 7')
  }

  const output: number[] = []
  let p = 0
  while (p < data.program.length) {
    const ins = data.program[p]
    const op = data.program[p + 1]
    if (ins === 3) {
      if (data.a === 0n) {
        p += 2
        continue
      }
      p = op
      continue
    }
    // all others advance normally
    if (ins === 0) {// adv
      data.a = data.a >> combo(op)
    }
    if (ins === 1) {// bxl
      data.b = data.b ^ BigInt(op)
    }
    if (ins === 2) {// bst
      data.b = modn(combo(op), 8n)
    }
    if (ins === 4) {//bxc
      data.b = data.b ^ data.c
    }
    if (ins === 5) {//out
      output.push(Number(modn(combo(op), 8n)))
    }
    if (ins === 6) {// bdv
      data.b = data.a >> combo(op)
    }
    if (ins === 7) {// cdv
      data.c = data.a >> combo(op)
    }
    p += 2
    continue
  }
  return output
}

function part1 (lines: string[]): string {
  const data: Input = parse(lines)
  const output = runProg(data)
  return output.join(',')
}

function part2 (lines: string[]) {
  const data: Input = parse(lines)
  let got = 0
  let possible = [0n]
  let attempts = 0
  while (got < data.program.length) {
    console.log()
    console.log('GOT=', got, possible)
    const newPossible: bigint[] = []
    possible.forEach(maybe => {
      for (let i = 0n; i < 8n; i++) {
        attempts++
        // set next 3 bits from i
        const v = maybe * 8n + i
        data.a = v
        data.b = 0n
        data.c = 0n
        const output = runProg(data)
        // test got+1
        let ok = true
        for (let j = 0; j <= got; j++) {
          if (output[output.length - 1 - j] !== data.program[data.program.length - 1 - j]) { ok = false}
        }
        console.log('TRY  maybe=', maybe, ' i=', i, '  v=', r(v), output.join(','))

        if (ok) {
          console.log(r(v), '=>DING=>', output.join(','))
          newPossible.push(v)
        }
      }
    })
    possible = newPossible
    got++
  }
  console.log(possible.sort(),attempts)
  let result = possible[0]
  return result
}

function r (n: bigint) {
  let x = '' + (n) + '~'
  let out: bigint[] = []
  while (n > 0) {
    out.push(modn(n, 8n))
    n = n >> 3n
  }
  x += out.reverse().join(':')
  return x
}

// default parse assumes a list of ints per row
function parse (lines: string[]): Input {
  const a = BigInt(lines[0].replace(/.*: /, ''))
  const b = BigInt(lines[1].replace(/.*: /, ''))
  const c = BigInt(lines[2].replace(/.*: /, ''))
  const program = lines[4].replace(/.*: /, '').split(/,/).map(cell => parseInt(cell))

  return { a, b, c, program }
}
