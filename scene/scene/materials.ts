declare var dcl: any

export const c = {
  current: 0
}

export const Colors = {
  _: setupMaterial(1, 1, 1, 0.75),
  r: setupMaterial(241 / 256, 93 / 256, 172 / 256, 0.9),
  g: setupMaterial(255 / 256, 203 / 256, 76 / 256, 0.92),
  b: setupMaterial(100 / 256, 170 / 256, 221 / 256, 0.8)
}
export function setupDefaultMaterials() {
  for (let i of Object.keys(Colors)) {
    dcl.log(`Color ${i} set up to id ${Colors[i]}`)
  }
}
export function getMaterial(key: string) {
  if (!Colors[key]) {
    return Colors['_']
  }
  return Colors[key]
}

export function setupMaterial(red: number, green: number, blue: number, alpha: number) {
  const MaterialClassId = 65
  const materialId = 'M' + c.current.toString(16)
  c.current++
  dcl.log('material created' + materialId)
  dcl.componentCreated(materialId, 'engine.material', MaterialClassId)
  dcl.componentUpdated(
    materialId,
    JSON.stringify({
      alphaTest: 0.5,
      albedoColor: {
        r: red,
        g: green,
        b: blue,
        a: alpha
      },
      metallic: 0.95,
      roughness: 0.95,
      transparencyMode: 4
    })
  )
  return materialId
}
