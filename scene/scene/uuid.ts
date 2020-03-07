function uuidGen(c) {
  let r = (Math.random() * 16) | 0
  let v = c === 'x' ? r : (r & 0x3) | 0x8
  return v.toString(16)
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, uuidGen)
}