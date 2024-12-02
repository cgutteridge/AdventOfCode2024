import fs from "fs";

    export function getData() {
        let srcFile: string = 'data'
        if (process.argv.length > 2) {
            srcFile = process.argv[2]
        }

        const data: string = fs.readFileSync(srcFile).toString()
        const lines: string[] = data.split(/\n/)
        const lastBit = lines.pop()
        if (lastBit !== '') {
            console.error(`Last bit wasn't empty: '${lastBit}'`)
            process.exit(1)
        }
        return lines;
    }
