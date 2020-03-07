define("microlib", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function start() {
        dcl.subscribe('sceneStart');
        dcl.subscribe('uuidEvent');
        dcl.subscribe('pointerEvent');
        dcl.onEvent(function (ev) {
            if (ev.type === 'pointerEvent') {
                if (ev.data && ev.data.payload && ev.data.payload.hit && ev.data.payload.hit.entityId !== undefined) {
                    var entityId = ev.data.payload.hit.entityId;
                    if (subscriptions[entityId]) {
                        subscriptions[entityId](ev.data.payload);
                    }
                }
            }
        });
    }
    exports.start = start;
    var subscriptions = {};
    function listenToClick(entityName, callback) {
        subscriptions[entityName] = callback;
    }
    exports.listenToClick = listenToClick;
    var privateState = {
        counter: 0
    };
    function spawnModel(modelName, coordinates, rotation) {
        if (rotation === void 0) { rotation = 0; }
        var GLTF_Shape = 54;
        var Transform_Component = 1;
        var EntityId = 'E' + privateState.counter.toString(16);
        var ShapeId = 'C' + privateState.counter.toString(16);
        privateState.counter++;
        dcl.componentCreated(ShapeId, 'engine.shape', GLTF_Shape);
        dcl.componentUpdated(ShapeId, JSON.stringify({
            withCollisions: true,
            visible: true,
            src: modelName
        }));
        dcl.addEntity(EntityId);
        dcl.attachEntityComponent(EntityId, 'engine.shape', ShapeId);
        var angle = rotation === 0 ? 0
            : rotation === 90 ? Math.PI / 4
                : rotation === 180 ? Math.PI / 2
                    : rotation === 270 ? Math.PI * 3 / 4
                        : rotation / 180 * Math.PI;
        dcl.updateEntityComponent(EntityId, 'engine.transform', Transform_Component, JSON.stringify({
            position: coordinates,
            rotation: { y: Math.sin(angle), x: 0, w: Math.cos(angle), z: 0 },
            scale: { x: 1, y: 1, z: 1 }
        }));
        dcl.setParent(EntityId, '0');
    }
    exports.spawnModel = spawnModel;
});
define("materials", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var materialId = 'M0';
    exports.c = {
        current: 0
    };
    exports.Colors = {
        red: setupMaterial(1, 0, 0),
        green: setupMaterial(0, 1, 0),
        blue: setupMaterial(0, 0, 1),
    };
    function setupMaterial(red, green, blue) {
        var MaterialClassId = 65;
        var materialId = 'M' + exports.c.current.toString(16);
        exports.c.current++;
        dcl.componentCreated(materialId, 'engine.material', MaterialClassId);
        dcl.componentUpdated(materialId, JSON.stringify({
            alphaTest: 0.5,
            albedoColor: {
                r: red, g: green, b: blue, a: 1
            },
            metallic: 0.9,
            roughness: 1,
            transparencyMode: 4
        }));
        return materialId;
    }
    exports.setupMaterial = setupMaterial;
});
define("tiles", ["require", "exports", "materials", "microlib"], function (require, exports, materials_1, microlib_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TransformClassId = 1;
    var BoxShapeId = 16;
    function createTile(i, j) {
        var id = i.toString(16) + j.toString(16);
        var componentId = 'C' + id;
        var entityId = 'E' + id;
        var boxComponent = dcl.componentCreated(componentId, 'engine.shape', BoxShapeId);
        dcl.componentUpdated(componentId, JSON.stringify({
            withCollisions: true,
            isPointerBlocker: true,
            visible: true
        }));
        dcl.addEntity(entityId);
        dcl.attachEntityComponent(entityId, 'engine.shape', componentId);
        dcl.attachEntityComponent(entityId, 'engine.material', materials_1.Colors.green);
        microlib_1.listenToClick(entityId, function (ev) {
            dcl.attachEntityComponent(entityId, 'engine.material', materials_1.Colors.red);
        });
        dcl.updateEntityComponent(entityId, 'engine.transform', 1, JSON.stringify({
            position: { x: i * 0.5 + 0.5, y: j * 0.5 + 1, z: 8 },
            rotation: { x: 1, y: 0, z: 0, w: 1 },
            scale: { x: 0.5, y: 0.1, z: 0.5 }
        }));
        // const listenId = 'D' + id
        dcl.setParent(entityId, '0');
        return {
            col: i,
            row: j,
            entityId: entityId,
            componentId: componentId,
            materialId: materials_1.Colors.red
        };
    }
    exports.createTile = createTile;
});
define("game", ["require", "exports", "microlib", "tiles", "materials"], function (require, exports, microlib_2, tiles_1, materials_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    microlib_2.start();
    materials_2.setupMaterial(1, 0, 0);
    materials_2.setupMaterial(0, 1, 0);
    materials_2.setupMaterial(0, 0, 1);
    microlib_2.spawnModel('models/model.glb', { x: 8, y: 0, z: 8 });
    setTimeout(function () {
        var tiles = {};
        for (var i = 0; i < 32; i++) {
            tiles[i] = {};
            for (var j = 0; j < 8; j++) {
                tiles[i][j] = tiles_1.createTile(i, j);
            }
        }
    }, 100);
});
