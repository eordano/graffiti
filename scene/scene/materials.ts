declare var dcl: any

export const c = {
  current: 0
}

export const Colors = {
  _: setupMaterial(231 / 256, 231 / 256, 231 / 256),
  r: setupMaterial(241 / 256, 93 / 256, 172 / 256),
  g: setupMaterial(134 / 256, 233 / 256, 225 / 256),
  b: setupMaterial(72 / 256, 54 / 256, 78 / 256)
}
export function setupDefaultMaterials() {
  for (let i of Object.keys(Colors)) {
    dcl.log(`Color ${i} set up to id ${Colors[i]}`)
  }
}

export function setupMaterial(red: number, green: number, blue: number) {
  const MaterialClassId = 65
  const materialId = 'M' + c.current.toString(16)
  c.current++
  dcl.componentCreated(materialId, 'engine.material', MaterialClassId)
  dcl.componentUpdated(
    materialId,
    JSON.stringify({
      alphaTest: 0.5,
      albedoColor: {
        r: red,
        g: green,
        b: blue,
        a: 0.75
      },
      metallic: 0.9,
      roughness: 1,
      transparencyMode: 4
    })
  )
  return materialId
}
