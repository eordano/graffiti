declare var dcl: any
import { CHAR_TO_COLOR, COLOR_TO_CHAR } from '../../lib/colors'
import { parseCoordinates } from '../../lib/jslibs/parseCoordinates'
import { Colors, setupDefaultMaterials } from './materials'
import { spawnModel, start } from './microlib'
import { logicColorChange, nextColor, state } from './state'
import { Col, createTile, Row, Tile } from './tiles'

start()
declare var setTimeout: any
declare var setInterval: any
declare var clearTimeout: any
declare var clearInterval: any

const connectionState: {
  currentSocket: WebSocket
  horizontal: boolean
  backoff: number
  reconnectTimeout: number
  pingInterval: number
  parcel: string
  coordinates: { x: number; y: number }
  tiles: Record<Row, Record<Col, Tile>>
} = {
  currentSocket: null,
  horizontal: false,
  reconnectTimeout: null,
  pingInterval: null,
  backoff: 3000,
  parcel: '0,0',
  coordinates: { x: 0, y: 0 },
  tiles: {}
}

const updateFunctions = {
  network: (() => undefined) as any,
  renderer: (params: { row: number; col: number; color: string }) => {
    const { row, col, color } = params
    dcl.attachEntityComponent(`E${row.toString(16)}_${col.toString(16)}`, 'engine.material', Colors[color])
  }
}
;(async function() {
  const a = await dcl.callRpc('EnvironmentAPI', 'getBootstrapData')
  const parcel = `${a.data.basePosition.x},${a.data.basePosition.y}`
  connectionState.parcel = parcel
  connectionState.coordinates = a.data.basePosition
  connectionState.horizontal = a.data.basePosition.x == 34
  spawnModel('models/model.glb', { x: 8, y: 0, z: 8 }, connectionState.horizontal ? 90 : 0)
  setupDefaultMaterials()
  setupNewConnection(parcel)
})()

function setupNewConnection(parcel: string) {
  if (connectionState.currentSocket) {
    return
  }
  if (connectionState.reconnectTimeout) {
    try {
      clearTimeout(connectionState.reconnectTimeout)
    } catch (e) {
      // Skip
    }
  }
  try {
    const URL = connectionState.parcel === '0,0' ? 'ws://localhost:8765' : 'wss://tiles.interconnected.online/'
    const socket = (connectionState.currentSocket = new WebSocket(URL))
    socket.onmessage = ((ev: MessageEvent) => {
      const msg = JSON.parse(ev.data)
      if (msg.type === 'snapshot') {
        const data = msg.data
        if (!data.length || !data[0].length) {
          return
        }
        state.rows = data.length
        state.cols = data[0].length
        for (let row = 0; row < data.length; row++) {
          for (let col = 0; col < data[row].length; col++) {
            logicColorChange(row, col, data[row].charAt(col))
          }
        }
        setupGrid()
        connectionState.backoff = 3000
      }
      if (msg.type === 'delta') {
        // _.send(JSON.stringify({ type: 'delta', parcel: data.parcel, ...state[data.parcel].data[data.position] }))
        if (msg.parcel === parcel) {
          const { row, col, color } = msg
          logicColorChange(row, col, COLOR_TO_CHAR[color])
          updateFunctions.renderer({ row, col, color: COLOR_TO_CHAR[color] })
        }
      }
    }) as any
    socket.onopen = (() => {
      connectionState.pingInterval = setInterval(() => {
        socket.send(JSON.stringify({ type: 'ping' }))
      }, 30 * 1000)
      socket.send(JSON.stringify({ type: 'snapshot', parcel }))
      updateFunctions.network = (params: { row: number; col: number; color: string }) => {
        const { row, col, color } = params
        socket.send(
          JSON.stringify({
            type: 'color',
            parcel,
            position: `${row},${col}`,
            color: CHAR_TO_COLOR[color]
          })
        )
      }
    }) as any
    socket.onclose = () => {
      updateFunctions.network = () => undefined
      // Try again!
      connectionState.currentSocket = null
      if (connectionState.pingInterval) {
        clearInterval(connectionState.pingInterval)
        connectionState.pingInterval = 0
      }
      if (!connectionState.reconnectTimeout) {
        connectionState.reconnectTimeout = setTimeout(setupNewConnection(parcel), (connectionState.backoff *= 1.61))
      }
    }
  } catch (e) {
    dcl.log(e)

    // Try again!
    if (!connectionState.reconnectTimeout) {
      connectionState.reconnectTimeout = setTimeout(setupNewConnection(parcel), (connectionState.backoff *= 1.61))
    }
  }
}

function setupGrid() {
  const tiles = connectionState.tiles
  const data = Object.keys(state.data)
  const newTiles = []
  for (let coordinate of data) {
    const value = data[coordinate]
    const [row, col] = parseCoordinates(coordinate)
    if (!tiles[row]) {
      tiles[row] = {}
    }
    if (!tiles[row][col]) {
      if (!state.data[coordinate]) {
        continue
      }
      tiles[row][col] = createTile({
        row,
        col,
        horizontal: connectionState.horizontal,
        color: state.data[coordinate].color,
        onClick: (_row: number, _col: number) => {
          try {
            const pos = `${_row},${_col}`
            if (!state.data[pos]) {
              return
            }
            const newColor = nextColor(state.data[pos].color)
            const newData = logicColorChange(row, col, newColor)
            updateFunctions.renderer(newData)
            updateFunctions.network(newData)
          } catch (e) {
            dcl.error(`${JSON.stringify(e.stack)}`)
          }
        }
      })
      newTiles.push(tiles[row][col])
    } else {
      if (!value || !value.color) {
        continue
      }
      updateFunctions.renderer({ row, col, color: COLOR_TO_CHAR[value.color] })
    }
  }
  for (let tile of newTiles) {
    dcl.componentUpdated(
      tile.componentId,
      JSON.stringify({
        withCollisions: true,
        isPointerBlocker: true,
        visible: true
      })
    )
  }
}
