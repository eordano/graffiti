declare var dcl: any
export type Row = string
export type Col = string

import { getMaterial } from './materials'
import { listenToClick } from './microlib'
import { state } from './state'

export interface Tile {
  col: number
  row: number
  entityId: string
  componentId: string
}
const TransformClassId = 1
const BoxShapeId = 16

export function createTile(params: { row: number; col: number; color: string; onClick: Function }): Tile {
  const { row, col, onClick } = params
  const id = row.toString(16) + '_' + col.toString(16)
  const componentId = 'C' + id
  const entityId = 'E' + id
  dcl.addEntity(entityId)
  dcl.updateEntityComponent(
    entityId,
    'engine.transform',
    TransformClassId,
    JSON.stringify({
      // position: { x: col * 0.5 + 0.25, y: row * 0.5 + 1, z: 8 },
      // rotation: { x: 1, y: 0, z: 0, w: 1 },
      // scale: { x: 0.5, y: 0.1, z: 0.5 }
      position: { z: col * 0.5 + 0.25, y: row * 0.5 + 1, x: 8 },
      rotation: { x: 0, y: 0, z: 1, w: 1 },
      scale: { x: 0.5, y: 0.1, z: 0.5 }
    })
  )
  dcl.componentCreated(componentId, 'engine.shape', BoxShapeId)
  dcl.componentUpdated(
    componentId,
    JSON.stringify({
      withCollisions: true,
      isPointerBlocker: true,
      visible: false
    })
  )
  dcl.attachEntityComponent(entityId, 'engine.shape', componentId)
  const tileId = `${row},${col}`
  dcl.attachEntityComponent(entityId, 'engine.material', getMaterial(state.data[tileId] ? state.data[tileId].color : '_'))
  listenToClick(entityId, (ev: { type: number }) => {
    if (ev.type === 0) {
      onClick(row, col)
    }
  })
  dcl.setParent(entityId, '0')
  return {
    col,
    row,
    entityId,
    componentId
  }
}
