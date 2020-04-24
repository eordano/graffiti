import http from 'http'
import WebSocket from 'ws'
import { app } from '../index'
import { parseCoordinates } from '../../lib/jslibs/parseCoordinates'
import { parseEnvNumberOrDefault } from '../jslibs/parseEnvNumberOrDefault'
import { serializeGrid } from '../../lib/jslibs/serializeGrid'
import { COORDINATE_REGEX } from '../../lib/coordinateRegex'
import { DEFAULT_COLS, DEFAULT_ROWS } from '../../lib/gridSize'
import { validColors, validOperations } from '../../lib/UserOperation'
import { WorldState } from '../../lib/worldState'

export function initializeServer(
  state: WorldState
): {
  start: Function
} {
  const currentUsers: {
    lastIndex: number
  } = {
    lastIndex: 0
  }
  const server = http.createServer(app)
  const channel: Record<string, Record<string, WebSocket>> = {}
  const wss = new WebSocket.Server({ server })
  wss.on('connection', (ws: WebSocket) => {
    const id: string = ''+(currentUsers.lastIndex++);
    const interval = setInterval(() => {
      try {
        ws.send(JSON.stringify({ typ: 'ping' }))
      } catch(e) {
        // skip
        clearInterval(interval)
      }
    }, 30 * 1000)
    ws.on('message', (message: string) => {
      try {
        console.log(`Received data: ${message}`)
        const data = JSON.parse(message)
        if (!validOperations.includes(data.type)) {
          throw new Error(`invalid value received for type: ${data.type}`)
        }
        if (data.type === 'color') {
          processColorMessage(data)
        }
        if (data.type === 'register') {
          processRegistration(data.parcel)
        }
        if (data.type === 'snapshot') {
          processRegistration(data.parcel)
          processSnapshotRequest(data)
        }
      } catch (e) {
        console.log(e)
        ws.close(1, e.message)
      }
    })
    function processRegistration(parcel: string) {
      if (!channel[parcel]) {
        channel[parcel] = {}
      }
      channel[parcel][id] = ws
    }
    function processSnapshotRequest(data: any) {
      const parcel = data.parcel
      if (typeof data.parcel !== 'string' || !data.parcel.match(COORDINATE_REGEX)) {
        throw new Error(`Invalid request for snapshot: ${JSON.stringify(data)}`)
      }
      if (!state[parcel]) {
        console.log(`No data for ${parcel}`)
        state[data.parcel] = { rows: DEFAULT_ROWS, cols: DEFAULT_COLS, data: {} }
      }
      ws.send(JSON.stringify({ type: 'snapshot', data: serializeGrid(state[parcel]) }))
    }

    function processColorMessage(data: any) {
      if (typeof data.parcel !== 'string' || !data.parcel.match(COORDINATE_REGEX)) {
        throw new Error(`invalid value received for parcel: ${data.parcel}`)
      }
      if (typeof data.position !== 'string' || !data.position.match(COORDINATE_REGEX)) {
        throw new Error(`invalid value received for position: ${data.position}`)
      }
      if (typeof data.color !== 'string' || !validColors.includes(data.color)) {
        throw new Error(`invalid value received for color: ${data.color}`)
      }
      const [row, col] = parseCoordinates(data.position)
      if (!state[data.parcel]) {
        state[data.parcel] = { rows: DEFAULT_ROWS, cols: DEFAULT_COLS, data: {} }
      }
      state[data.parcel].data[data.position] = {
        col,
        row,
        color: data.color
      }
      Object.keys(channel[data.parcel]).forEach(_ => {
        const client = channel[data.parcel][_]
        const value = JSON.stringify({ type: 'delta', parcel: data.parcel, ...state[data.parcel].data[data.position] })
        try {
          client.send(value)
        } catch (e) {
          delete channel[data.parcel][_]
        }
      })
    }
  })

  const port = parseEnvNumberOrDefault(process.env.PORT, 8765)
  return {
    start: () => {
      return new Promise((resolve, reject) => {
        try {
          server.listen(port, () => {
            const address =
              typeof server === 'string'
                ? server
                : `${(server.address() as any).address}:${(server.address() as any).port}`
            console.log(`>> Server started on ${address}`)
            resolve(server)
          })
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
