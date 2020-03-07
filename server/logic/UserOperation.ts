import { COLOR_TO_CHAR } from './colors';
import { Coordinate } from './Coordinate';
type UserOperation = {
  type: 'color';
  parcel: Coordinate;
  position: Coordinate;
  color: keyof typeof COLOR_TO_CHAR;
};
export const validOperations = ['color'];
export const validColors = Object.keys(COLOR_TO_CHAR);
