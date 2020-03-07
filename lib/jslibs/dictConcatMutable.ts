export function dictConcatMutable<T>(values: Record<string, T>, others: Record<string, T>) {
  for (let value of Object.keys(values)) {
    others[value] = values[value]
  }
  return others
}
