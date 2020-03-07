declare var dcl: any
export type Row = string
export type Col = string

import { Colors } from './materials'
import { listenToClick } from './microlib'

export interface Tile {
  col: number
  row: number
  entityId: string
  componentId: string
}
const TransformClassId = 1
const BoxShapeId = 16

import { state } from './state'

export function createTile(params: { row: number; col: number; color: string; onClick: Function }): Tile {
  const { row, col, onClick } = params
  const id = row.toString(16) + '_' + col.toString(16)
  const componentId = 'C' + id
  const entityId = 'E' + id
  dcl.componentCreated(componentId, 'engine.shape', BoxShapeId)
  dcl.componentUpdated(
    componentId,
    JSON.stringify({
      withCollisions: true,
      isPointerBlocker: true,
      visible: true
    })
  )
  dcl.addEntity(entityId)
  dcl.attachEntityComponent(entityId, 'engine.shape', componentId)
  const tileId = `${row},${col}`
  dcl.attachEntityComponent(entityId, 'engine.material', Colors[state.data[tileId] ? state.data[tileId].color : '_'])
  listenToClick(entityId, ev => {
    if (ev.type === 0) {
      onClick(row, col)
    }
  })
  dcl.updateEntityComponent(
    entityId,
    'engine.transform',
    1,
    JSON.stringify({
      position: { x: col * 0.5 + 0.5, y: row * 0.5 + 1, z: 8 },
      rotation: { x: 1, y: 0, z: 0, w: 1 },
      scale: { x: 0.5, y: 0.1, z: 0.5 }
    })
  )
  // const listenId = 'D' + id
  dcl.setParent(entityId, '0')
  return {
    col,
    row,
    entityId,
    componentId
  }
}
