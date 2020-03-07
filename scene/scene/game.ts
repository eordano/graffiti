declare var dcl: any
import { start, spawnModel } from './microlib'
import { Row, Col, Tile, createTile} from './tiles'
import { setupMaterial } from './materials'

start()
setupMaterial(1,0,0)
setupMaterial(0,1,0)
setupMaterial(0,0,1)

spawnModel('models/model.glb', { x: 8, y: 0, z: 8 })

const DEFAULT_ROWS = 8
const DEFAULT_COLS = 32
declare var setTimeout: any
setTimeout(() => {
  const tiles: Record<Row,Record<Col, Tile>> = {}
  
  for (let i = 0; i < DEFAULT_COLS; i++) {
    tiles[i] = {}
    for (let j = 0; j < DEFAULT_ROWS; j++) {
      tiles[i][j] = createTile(i, j)
    }
  }

}, 100)
