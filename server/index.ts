import cors from 'cors'
import express from 'express'
import { readAll } from './disk/readAll'
import { storeAll } from './disk/storeAll'
import { initializeServer } from './wss/initializeServer'
import { parseEnvNumberOrDefault } from './jslibs/parseEnvNumberOrDefault'

export const app = express()
app.use(cors)

const UPDATE_DISK_STATE_INTERVAL = parseEnvNumberOrDefault('UPDATE_DISK_INTERVAL', 6 * 1000)

async function initialize() {
  const state = await readAll()
  setInterval(() => storeAll(state), UPDATE_DISK_STATE_INTERVAL)

  const server = initializeServer(state)

  server.start()
}

if (!module.parent) {
  initialize().catch(e => {
    console.error(e)
    process.exit(-1)
  })
}
