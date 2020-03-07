import http from 'http'
import WebSocket from 'ws'
import { app } from '../index'
import { parseCoordinates } from '../jslibs/parseCoordinates'
import { parseEnvNumberOrDefault } from '../jslibs/parseEnvNumberOrDefault'
import { COORDINATE_REGEX } from '../logic/coordinateRegex'
import { validColors, validOperations } from '../logic/UserOperation'
import { WorldState } from '../logic/worldState'

export function initializeServer(
  state: WorldState
): {
  start: Function
} {
  const server = http.createServer(app)
  const wss = new WebSocket.Server({ server })
  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message)
        if (!validOperations.includes(data.type)) {
          throw new Error(`invalid value received for type: ${data.type}`)
        }
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
        state[data.parcel].data[data.position] = {
          col,
          row,
          color: data.color
        }
        wss.emit('delta', data)
      } catch (e) {
        console.log(e)
        ws.close(-1, e.message)
      }
    })
    ws.send({ type: 'snapshot', data: JSON.stringify(state) })
  })

  const port = parseEnvNumberOrDefault(process.env.PORT, 1337)
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
