//Create entity and assign shape
const myEntity = new Entity()
myEntity.addComponent(new BoxShape())

//Create material and configure its fields
const myMaterial = new Material()
myMaterial.albedoColor = Color3.Blue()
myMaterial.metallic = 0.9
myMaterial.roughness = 1

//Assign the material to the entity
myEntity.addComponent(myMaterial)

// Create and add a `Transform` component to that entity
myEntity.addComponent(new Transform())

// Set the fields in the component
myEntity.getComponent(Transform).position.set(3, 1, 3)

// Add the entity to the engine
engine.addEntity(myEntity)

declare var console: any
declare var dcl: any
console.log(engine)

