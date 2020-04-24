import { COLOR_TO_CHAR } from './colors'
import { Coordinate } from './Coordinate'

export type UserOperation = {
  type: 'color'
  parcel: Coordinate
  position: Coordinate
  color: keyof typeof COLOR_TO_CHAR
}

export type SnapshotOperation = {
  type: 'snapshot'
  parcel: Coordinate
  position: Coordinate
  color: keyof typeof COLOR_TO_CHAR
}

export const validOperations = ['color', 'snapshot', 'ping', 'register']
export const validColors = Object.keys(COLOR_TO_CHAR)
