declare var dcl: any
export type Row = string
export type Col = string

import { Colors  } from './materials'
import { listenToClick } from './microlib'

export interface Tile {
  col: number
  row: number
  entityId: string
  componentId: string
  materialId: string
}
const TransformClassId = 1
const BoxShapeId = 16

export function createTile(i: number, j: number): Tile {
  const id = i.toString(16) + j.toString(16)
  const componentId = 'C' + id
  const entityId = 'E' + id
  const boxComponent = dcl.componentCreated(componentId, 'engine.shape', BoxShapeId)
  dcl.componentUpdated(componentId, JSON.stringify({
    withCollisions: true,
    isPointerBlocker: true,
    visible: true
  }))
  dcl.addEntity(entityId)
  dcl.attachEntityComponent(entityId, 'engine.shape', componentId)
  dcl.attachEntityComponent(entityId, 'engine.material', Colors.green)
  listenToClick(entityId, (ev) => {
    dcl.attachEntityComponent(entityId, 'engine.material', Colors.red)
  })
  dcl.updateEntityComponent(entityId, 'engine.transform', 1, JSON.stringify({
    position: { x: i * 0.5 + 0.5, y: j * 0.5 + 1, z: 8 },
    rotation: { x: 1, y: 0, z: 0, w: 1 },
    scale: { x: 0.5, y: 0.1, z: 0.5 }
  }))
  // const listenId = 'D' + id
  dcl.setParent(entityId, '0')
  return {
    col: i,
    row: j,
    entityId,
    componentId,
    materialId: Colors.red
  }
}
