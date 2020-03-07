import { promises } from 'fs'
import path from 'path'
import { storageFolder } from './storageFolder'
import { WorldState } from '../logic/worldState'
import { COLOR_TO_CHAR } from '../logic/colors'

const fs = promises

export async function storeAll(state: WorldState): Promise<any> {
  try {
    await fs.opendir(storageFolder)
  } catch (e) {
    console.log(`Could not open dir!`)
    throw e
  }
  return Promise.all(
    Object.keys(state).map(parcelCoordinates => {
      const tiles = state[parcelCoordinates]
      const dataToSave = []
      for (let i = 0; i < tiles.rows; i++) {
        dataToSave[i] = []
        for (let j = 0; j < tiles.cols; j++) {
          dataToSave[i][j] = COLOR_TO_CHAR[tiles.data[`${i},${j}`].color]
        }
      }
      return fs.writeFile(path.join(storageFolder, parcelCoordinates), JSON.stringify(dataToSave))
    })
  )
}
