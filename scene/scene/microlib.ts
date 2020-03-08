declare var dcl: any

const subscriptions = {}

var privateState = {
  counter: 0
}

export function start() {
  dcl.subscribe('sceneStart')
  dcl.subscribe('uuidEvent')
  dcl.subscribe('pointerEvent')

  dcl.onEvent((ev: {type: 'pointerEvent', data?: { payload?: { hit?: { entityId?: string }}}}) => {
    if (ev.type === 'pointerEvent') {
      if (ev.data && ev.data.payload && ev.data.payload.hit && ev.data.payload.hit.entityId !== undefined) {
        const entityId = ev.data.payload.hit.entityId
        if (subscriptions[entityId]) {
          subscriptions[entityId](ev.data.payload)
        }
      }
    }
  })
}

export function listenToClick(entityName: string, callback: Function) {
  subscriptions[entityName] = callback
}

export function spawnModel(modelName: string, coordinates: { x: number; y: number; z: number }, rotation = 0) {
  var GLTF_Shape = 54
  var Transform_Component = 1

  var EntityId = 'E' + privateState.counter.toString(16)
  var ShapeId = 'C' + privateState.counter.toString(16)
  privateState.counter++

  dcl.componentCreated(ShapeId, 'engine.shape', GLTF_Shape)
  dcl.componentUpdated(
    ShapeId,
    JSON.stringify({
      withCollisions: true,
      visible: true,
      src: modelName
    })
  )
  dcl.addEntity(EntityId)
  dcl.attachEntityComponent(EntityId, 'engine.shape', ShapeId)
  var angle =
    rotation === 0
      ? 0
      : rotation === 90
      ? Math.PI / 4
      : rotation === 180
      ? Math.PI / 2
      : rotation === 270
      ? (Math.PI * 3) / 4
      : (rotation / 180) * Math.PI

  dcl.updateEntityComponent(
    EntityId,
    'engine.transform',
    Transform_Component,
    JSON.stringify({
      position: coordinates,
      rotation: { y: Math.sin(angle), x: 0, w: Math.cos(angle), z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    })
  )

  dcl.setParent(EntityId, '0')
}
