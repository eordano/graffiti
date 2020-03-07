import path from 'path'
import { promises } from 'fs'

import { dictConcatMutable } from '../../lib/jslibs/dictConcatMutable'

import { storageFolder } from './storageFolder'
import { COORDINATE_REGEX } from '../../lib/coordinateRegex'
import { WorldState } from '../../lib/worldState'
import { CHAR_TO_COLOR } from '../../lib/colors'

const fs = promises

export async function readAll(): Promise<WorldState> {
  const files = await fs.readdir(storageFolder)
  const result: WorldState = {}
  for (let scene of files) {
    if (scene.startsWith('.')) {
      continue
    }
    if (!scene.match(COORDINATE_REGEX)) {
      continue
    }
    const file = path.join(storageFolder, scene)
    const stat = await fs.stat(file)
    if (!stat.isFile) {
      continue
    }
    const data = await fs.readFile(file)
    const parsed = JSON.parse(data.toString())
    try {
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
      result[scene] = {
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
      console.error(`Could not parse info for ${scene}:`, e, `\n\nInfo was:\n`, JSON.stringify(parsed, null, 2))
    }
  }
  console.log(`Read state from file. Loaded data for scenes: ${Object.keys(result).join(', ')}`)
  return result
}
