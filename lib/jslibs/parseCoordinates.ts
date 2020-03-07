export function parseCoordinates(coordinates: string) {
  return coordinates.split(',').map(_ => parseInt(_, 10));
}
