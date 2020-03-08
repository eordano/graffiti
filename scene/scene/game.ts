declare var dcl: any
import { CHAR_TO_COLOR, COLOR_TO_CHAR } from '../../lib/colors'
import { parseCoordinates } from '../../lib/jslibs/parseCoordinates'
import { Colors, setupDefaultMaterials } from './materials'
import { spawnModel, start } from './microlib'
import { logicColorChange, nextColor, state } from './state'
import { Col, createTile, Row, Tile } from './tiles'

start()
declare var setTimeout: any

const URL = 'ws://localhost:1337/'
const updateFunctions = {
  network: (() => undefined) as any,
  renderer: (params: { row: number; col: number; color: string }) => {
    const { row, col, color } = params
    dcl.attachEntityComponent(`E${row.toString(16)}_${col.toString(16)}`, 'engine.material', Colors[color])
  }
}

spawnModel('models/model.glb', { x: 8, y: 0, z: 8 })
;(async function() {
  const a = await dcl.callRpc('EnvironmentAPI', 'getBootstrapData')
  const parcel = `${a.data.basePosition.x},${a.data.basePosition.y}`
  setupDefaultMaterials()
  setupNewConnection(parcel)
})()

function setupNewConnection(parcel: string) {
  try {
    const socket = new WebSocket(URL)
    socket.onmessage = ((ev: MessageEvent) => {
      const msg = JSON.parse(ev.data)
      if (msg.type === 'snapshot') {
        const data = JSON.parse(msg.data)
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
      }
      if (msg.type === 'delta') {
        const { row, col, color } = msg.data
        logicColorChange(row, col, COLOR_TO_CHAR[color])
        updateFunctions.renderer({ row, col, color: COLOR_TO_CHAR[color] })
      }
    }) as any
    socket.onopen = (() => {
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
      setTimeout(setupNewConnection(parcel), 500)
    }
  } catch (e) {
    dcl.log(e)

    // Try again!
    setTimeout(setupNewConnection(parcel), 500)
  }
}

function setupGrid() {
  const tiles: Record<Row, Record<Col, Tile>> = {}

  const data = Object.keys(state.data)
  for (let coordinate of data) {
    const value = data[coordinate]
    const [col, row] = parseCoordinates(coordinate)
    if (!tiles[row]) {
      tiles[row] = {}
    }
    if (!tiles[row][col]) {
      tiles[row][col] = createTile({
        row,
        col,
        color: state.data[`${row},${col}`].color,
        onClick: (_row: number, _col: number) => {
          dcl.log('changing', _row, _col)
          try {
            const pos = `${_row},${_col}`
            const newColor = nextColor(state.data[pos].color)
            const newData = logicColorChange(row, col, newColor)
            updateFunctions.renderer(newData)
            updateFunctions.network(newData)
          } catch (e) {
            dcl.error(`${JSON.stringify(e.stack)}`)
          }
        }
      })
    } else {
      updateFunctions.renderer({ row, col, color: COLOR_TO_CHAR[value.color] })
    }
  }
}
