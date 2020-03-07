import { dictConcatMutable } from '../jslibs/dictConcatMutable'
export const CHAR_TO_COLOR = {
  r: '#ff0000',
  g: '#00ff00',
  b: '#0000ff'
}
export const COLOR_TO_CHAR = Object.keys(CHAR_TO_COLOR)
  .map(_ => ({ [CHAR_TO_COLOR[_]]: _ }))
  .reduce(dictConcatMutable)
