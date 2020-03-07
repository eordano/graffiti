import { promises } from 'fs'
import path from 'path'
import { serializeGrid } from '../../lib/jslibs/serializeGrid'
import { WorldState } from '../../lib/worldState'
import { storageFolder } from './storageFolder'

const fs = promises

export async function storeAll(state: WorldState): Promise<any> {
  try {
    await fs.readdir(storageFolder)
  } catch (e) {
    console.log(`Could not open dir!`)
    throw e
  }
  return Promise.all(
    Object.keys(state).map(parcelCoordinates => {
      const dataToSave = serializeGrid(state[parcelCoordinates])
      return fs.writeFile(path.join(storageFolder, parcelCoordinates), JSON.stringify(dataToSave))
    })
  )
}

