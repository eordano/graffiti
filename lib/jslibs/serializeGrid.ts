import { COLOR_TO_CHAR } from '../colors'
import { GridState } from '../worldState'

export function serializeGrid(tiles: GridState) {
  const dataToSave = []
  for (let i = 0; i < tiles.rows; i++) {
    dataToSave[i] = []
    for (let j = 0; j < tiles.cols; j++) {
      const coord = `${i},${j}`
      if (tiles.data[coord]) {
        dataToSave[i][j] = COLOR_TO_CHAR[tiles.data[coord].color]
      } else {
        dataToSave[i][j] = '_'
      }
    }
    dataToSave[i] = dataToSave[i].join('')
  }
  return dataToSave
}
