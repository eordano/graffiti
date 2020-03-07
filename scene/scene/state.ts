import { DEFAULT_COLS, DEFAULT_ROWS } from '../../lib/gridSize'
import { GridState } from '../../lib/worldState'
export const state: GridState = {
  rows: DEFAULT_ROWS,
  cols: DEFAULT_COLS,
  data: {}
}
export function logicColorChange(row: number, col: number, newColor: string) {
  const pos = `${row},${col}`
  if (!state.data[pos]) {
    state.data[pos] = { row, col, color: newColor }
  } else {
    state.data[pos].color = newColor
  }
  return state.data[pos]
}
const NEXT = {
  _: 'r',
  r: 'g',
  g: 'b',
  b: '_'
}
export function nextColor(current: string): string {
  return NEXT[current]
}
