import { Coordinate } from './Coordinate'

export type GridState = {
  rows: number
  cols: number
  data: Record<Coordinate, TileState>
}
export type WorldState = Record<Coordinate, GridState>
export type TileState = {
  row: number
  col: number
  color: string
}
