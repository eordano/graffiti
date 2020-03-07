import path from 'path'
import { promises } from 'fs'

import { dictConcatMutable } from '../jslibs/dictConcatMutable'

import { storageFolder } from './storageFolder'
import { COORDINATE_REGEX } from '../logic/coordinateRegex'
import { WorldState } from '../logic/worldState'
import { CHAR_TO_COLOR } from '../logic/colors'

const fs = promises

export async function readAll(): Promise<WorldState> {
  const dirs = await fs.readdir(storageFolder)
  const result: WorldState = {}
  for (let dir of dirs) {
    if (dir.startsWith('.')) {
      continue
    }
    const folder = path.join(storageFolder, dir)
    const stat = await fs.stat(folder)
    if (!stat.isDirectory) {
      continue
    }
    const files = await fs.readdir(folder)
    const data = await Promise.all(
      files.filter(_ => _.match(COORDINATE_REGEX)).map(file => fs.readFile(path.join(folder, file)))
    )
    data.forEach((grid, index) => {
      try {
        const parsed = JSON.parse(grid.toString())
        if (typeof parsed !== 'object') {
          throw new Error('Invalid type for grid: ' + typeof parsed)
        }
        let matrix = parsed as string[]
        if (
          !matrix.length ||
          !matrix[0].length ||
          typeof matrix[0] !== 'string' ||
          matrix.some(_ => _.split('').some($ => CHAR_TO_COLOR[$] === undefined))
        ) {
          throw new Error(
            `Invalid data received: Expected an array that looks like this: ["rrrbrrgrbgrgrbrg", "rrrrbrgrbrggrbrg", ...], found: ${JSON.stringify(
              matrix
            )}`
          )
        }
        result[files[index]] = {
          cols: matrix.length,
          rows: matrix[0].length,
          data: matrix
            .map((rowArray, row) =>
              rowArray
                .split('')
                .map((datum, col) => ({
                  [`${row},${col}`]: {
                    row,
                    col,
                    color: CHAR_TO_COLOR[datum]
                  }
                }))
                .reduce(dictConcatMutable, {})
            )
            .reduce(dictConcatMutable, {})
        }
      } catch (e) {
        console.error(`Could not parse info for ${index}:`, e, `\n\nInfo was:\n`, JSON.stringify(grid, null, 2))
      }
    })
  }
  return result
}
