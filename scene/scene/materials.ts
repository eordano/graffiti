declare var dcl: any

const materialId = 'M0'

export const c = {
  current: 0
}

export const Colors = {
  red: setupMaterial(1, 0, 0),
  green: setupMaterial(0, 1, 0),
  blue: setupMaterial(0, 0, 1),
}


export function setupMaterial(red: number, green: number, blue: number) {
  const MaterialClassId = 65
  const materialId = 'M' + c.current.toString(16)
  c.current++;
  dcl.componentCreated(materialId, 'engine.material', MaterialClassId)
  dcl.componentUpdated(materialId, JSON.stringify({
      alphaTest: 0.5,
      albedoColor: {
        r: red, g: green, b: blue, a: 1
      },
      metallic: 0.9,
      roughness: 1,
      transparencyMode: 4
  }))
  return materialId
}
