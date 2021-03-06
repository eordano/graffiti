var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
define("lib/jslibs/dictConcatMutable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function dictConcatMutable(values, others) {
        var e_1, _a;
        try {
            for (var _b = __values(Object.keys(values)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var value = _c.value;
                others[value] = values[value];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return others;
    }
    exports.dictConcatMutable = dictConcatMutable;
});
define("lib/colors", ["require", "exports", "lib/jslibs/dictConcatMutable"], function (require, exports, dictConcatMutable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CHAR_TO_COLOR = {
        r: '#ff0000',
        g: '#00ff00',
        b: '#0000ff',
        _: '#000000'
    };
    exports.COLOR_TO_CHAR = Object.keys(exports.CHAR_TO_COLOR)
        .map(function (_) {
        var _a;
        return (_a = {}, _a[exports.CHAR_TO_COLOR[_]] = _, _a);
    })
        .reduce(dictConcatMutable_1.dictConcatMutable);
});
define("lib/jslibs/parseCoordinates", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function parseCoordinates(coordinates) {
        return coordinates.split(',').map(function (_) { return parseInt(_, 10); });
    }
    exports.parseCoordinates = parseCoordinates;
});
define("scene/scene/materials", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.c = {
        current: 0
    };
    exports.Colors = {
        _: setupMaterial(1, 1, 1, 0.75),
        r: setupMaterial(241 / 256, 93 / 256, 172 / 256, 0.9),
        g: setupMaterial(255 / 256, 203 / 256, 76 / 256, 0.92),
        b: setupMaterial(100 / 256, 170 / 256, 221 / 256, 0.8)
    };
    function setupDefaultMaterials() {
        var e_2, _a;
        try {
            for (var _b = __values(Object.keys(exports.Colors)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var i = _c.value;
                dcl.log("Color " + i + " set up to id " + exports.Colors[i]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    exports.setupDefaultMaterials = setupDefaultMaterials;
    function getMaterial(key) {
        if (!exports.Colors[key]) {
            return exports.Colors['_'];
        }
        return exports.Colors[key];
    }
    exports.getMaterial = getMaterial;
    function setupMaterial(red, green, blue, alpha) {
        var MaterialClassId = 65;
        var materialId = 'M' + exports.c.current.toString(16);
        exports.c.current++;
        dcl.log('material created' + materialId);
        dcl.componentCreated(materialId, 'engine.material', MaterialClassId);
        dcl.componentUpdated(materialId, JSON.stringify({
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
        }));
        return materialId;
    }
    exports.setupMaterial = setupMaterial;
});
define("scene/scene/microlib", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var subscriptions = {};
    var privateState = {
        counter: 0
    };
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
    function listenToClick(entityName, callback) {
        subscriptions[entityName] = callback;
    }
    exports.listenToClick = listenToClick;
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
        var angle = rotation === 0
            ? 0
            : rotation === 90
                ? Math.PI / 4
                : rotation === 180
                    ? Math.PI / 2
                    : rotation === 270
                        ? (Math.PI * 3) / 4
                        : (rotation / 180) * Math.PI;
        dcl.updateEntityComponent(EntityId, 'engine.transform', Transform_Component, JSON.stringify({
            position: coordinates,
            rotation: { y: Math.sin(angle), x: 0, w: Math.cos(angle), z: 0 },
            scale: { x: 1, y: 1, z: 1 }
        }));
        dcl.setParent(EntityId, '0');
    }
    exports.spawnModel = spawnModel;
});
define("lib/gridSize", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_COLS = 32;
    exports.DEFAULT_ROWS = 10;
});
define("lib/Coordinate", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("lib/worldState", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("scene/scene/state", ["require", "exports", "lib/gridSize"], function (require, exports, gridSize_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.state = {
        rows: gridSize_1.DEFAULT_ROWS,
        cols: gridSize_1.DEFAULT_COLS,
        data: {}
    };
    function logicColorChange(row, col, newColor) {
        var pos = row + "," + col;
        if (!exports.state.data[pos]) {
            exports.state.data[pos] = { row: row, col: col, color: newColor };
        }
        else {
            exports.state.data[pos].color = newColor;
        }
        return exports.state.data[pos];
    }
    exports.logicColorChange = logicColorChange;
    var NEXT = {
        _: 'b',
        b: 'g',
        g: 'r',
        r: '_'
    };
    function nextColor(current) {
        return NEXT[current];
    }
    exports.nextColor = nextColor;
});
define("scene/scene/tiles", ["require", "exports", "scene/scene/materials", "scene/scene/microlib", "scene/scene/state"], function (require, exports, materials_1, microlib_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TransformClassId = 1;
    var BoxShapeId = 16;
    function createTile(params) {
        var horizontal = params.horizontal, row = params.row, col = params.col, onClick = params.onClick;
        var id = row.toString(16) + '_' + col.toString(16);
        var componentId = 'C' + id;
        var entityId = 'E' + id;
        dcl.addEntity(entityId);
        dcl.updateEntityComponent(entityId, 'engine.transform', TransformClassId, JSON.stringify(horizontal
            ? {
                position: { z: col * 0.5 + 0.25, y: row * 0.5 + 1, x: 8 },
                rotation: { x: 0, y: 0, z: 1, w: 1 },
                scale: { x: 0.5, y: 0.1, z: 0.5 }
            }
            : {
                position: { x: col * 0.5 + 0.25, y: row * 0.5 + 1, z: 8 },
                rotation: { x: 1, y: 0, z: 0, w: 1 },
                scale: { x: 0.5, y: 0.1, z: 0.5 }
            }));
        dcl.componentCreated(componentId, 'engine.shape', BoxShapeId);
        dcl.componentUpdated(componentId, JSON.stringify({
            withCollisions: true,
            isPointerBlocker: true,
            visible: false
        }));
        dcl.attachEntityComponent(entityId, 'engine.shape', componentId);
        var tileId = row + "," + col;
        dcl.attachEntityComponent(entityId, 'engine.material', materials_1.getMaterial(state_1.state.data[tileId] ? state_1.state.data[tileId].color : '_'));
        microlib_1.listenToClick(entityId, function (ev) {
            if (ev.type === 0) {
                onClick(row, col);
            }
        });
        dcl.setParent(entityId, '0');
        return {
            col: col,
            row: row,
            entityId: entityId,
            componentId: componentId
        };
    }
    exports.createTile = createTile;
});
define("scene/scene/game", ["require", "exports", "lib/colors", "lib/jslibs/parseCoordinates", "scene/scene/materials", "scene/scene/microlib", "scene/scene/state", "scene/scene/tiles"], function (require, exports, colors_1, parseCoordinates_1, materials_2, microlib_2, state_2, tiles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    microlib_2.start();
    var connectionState = {
        currentSocket: null,
        horizontal: false,
        reconnectTimeout: null,
        pingInterval: null,
        backoff: 3000,
        parcel: '0,0',
        coordinates: { x: 0, y: 0 },
        tiles: {}
    };
    var updateFunctions = {
        network: (function () { return undefined; }),
        renderer: function (params) {
            var row = params.row, col = params.col, color = params.color;
            dcl.attachEntityComponent("E" + row.toString(16) + "_" + col.toString(16), 'engine.material', materials_2.Colors[color]);
        }
    };
    (function () {
        return __awaiter(this, void 0, void 0, function () {
            var a, parcel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dcl.callRpc('EnvironmentAPI', 'getBootstrapData')];
                    case 1:
                        a = _a.sent();
                        parcel = a.data.basePosition.x + "," + a.data.basePosition.y;
                        connectionState.parcel = parcel;
                        connectionState.coordinates = a.data.basePosition;
                        connectionState.horizontal = a.data.basePosition.x == 34;
                        microlib_2.spawnModel('models/model.glb', { x: 8, y: 0, z: 8 }, connectionState.horizontal ? 90 : 0);
                        materials_2.setupDefaultMaterials();
                        setupNewConnection(parcel);
                        return [2 /*return*/];
                }
            });
        });
    })();
    function setupNewConnection(parcel) {
        if (connectionState.currentSocket) {
            return;
        }
        if (connectionState.reconnectTimeout) {
            try {
                clearTimeout(connectionState.reconnectTimeout);
            }
            catch (e) {
                // Skip
            }
        }
        try {
            var URL = connectionState.parcel === '0,0' ? 'ws://localhost:8765' : 'wss://tiles.interconnected.online/';
            var socket_1 = (connectionState.currentSocket = new WebSocket(URL));
            socket_1.onmessage = (function (ev) {
                var msg = JSON.parse(ev.data);
                if (msg.type === 'snapshot') {
                    var data = msg.data;
                    if (!data.length || !data[0].length) {
                        return;
                    }
                    state_2.state.rows = data.length;
                    state_2.state.cols = data[0].length;
                    for (var row = 0; row < data.length; row++) {
                        for (var col = 0; col < data[row].length; col++) {
                            state_2.logicColorChange(row, col, data[row].charAt(col));
                        }
                    }
                    setupGrid();
                    connectionState.backoff = 3000;
                }
                if (msg.type === 'delta') {
                    // _.send(JSON.stringify({ type: 'delta', parcel: data.parcel, ...state[data.parcel].data[data.position] }))
                    if (msg.parcel === parcel) {
                        var row = msg.row, col = msg.col, color = msg.color;
                        state_2.logicColorChange(row, col, colors_1.COLOR_TO_CHAR[color]);
                        updateFunctions.renderer({ row: row, col: col, color: colors_1.COLOR_TO_CHAR[color] });
                    }
                }
            });
            socket_1.onopen = (function () {
                connectionState.pingInterval = setInterval(function () {
                    socket_1.send(JSON.stringify({ type: 'ping' }));
                }, 30 * 1000);
                socket_1.send(JSON.stringify({ type: 'snapshot', parcel: parcel }));
                updateFunctions.network = function (params) {
                    var row = params.row, col = params.col, color = params.color;
                    socket_1.send(JSON.stringify({
                        type: 'color',
                        parcel: parcel,
                        position: row + "," + col,
                        color: colors_1.CHAR_TO_COLOR[color]
                    }));
                };
            });
            socket_1.onclose = function () {
                updateFunctions.network = function () { return undefined; };
                // Try again!
                connectionState.currentSocket = null;
                if (connectionState.pingInterval) {
                    clearInterval(connectionState.pingInterval);
                    connectionState.pingInterval = 0;
                }
                if (!connectionState.reconnectTimeout) {
                    connectionState.reconnectTimeout = setTimeout(setupNewConnection(parcel), (connectionState.backoff *= 1.61));
                }
            };
        }
        catch (e) {
            dcl.log(e);
            // Try again!
            if (!connectionState.reconnectTimeout) {
                connectionState.reconnectTimeout = setTimeout(setupNewConnection(parcel), (connectionState.backoff *= 1.61));
            }
        }
    }
    function setupGrid() {
        var e_3, _a, e_4, _b;
        var tiles = connectionState.tiles;
        var data = Object.keys(state_2.state.data);
        var newTiles = [];
        var _loop_1 = function (coordinate) {
            var value = data[coordinate];
            var _a = __read(parseCoordinates_1.parseCoordinates(coordinate), 2), row = _a[0], col = _a[1];
            if (!tiles[row]) {
                tiles[row] = {};
            }
            if (!tiles[row][col]) {
                if (!state_2.state.data[coordinate]) {
                    return "continue";
                }
                tiles[row][col] = tiles_1.createTile({
                    row: row,
                    col: col,
                    horizontal: connectionState.horizontal,
                    color: state_2.state.data[coordinate].color,
                    onClick: function (_row, _col) {
                        try {
                            var pos = _row + "," + _col;
                            if (!state_2.state.data[pos]) {
                                return;
                            }
                            var newColor = state_2.nextColor(state_2.state.data[pos].color);
                            var newData = state_2.logicColorChange(row, col, newColor);
                            updateFunctions.renderer(newData);
                            updateFunctions.network(newData);
                        }
                        catch (e) {
                            dcl.error("" + JSON.stringify(e.stack));
                        }
                    }
                });
                newTiles.push(tiles[row][col]);
            }
            else {
                if (!value || !value.color) {
                    return "continue";
                }
                updateFunctions.renderer({ row: row, col: col, color: colors_1.COLOR_TO_CHAR[value.color] });
            }
        };
        try {
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var coordinate = data_1_1.value;
                _loop_1(coordinate);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var newTiles_1 = __values(newTiles), newTiles_1_1 = newTiles_1.next(); !newTiles_1_1.done; newTiles_1_1 = newTiles_1.next()) {
                var tile = newTiles_1_1.value;
                dcl.componentUpdated(tile.componentId, JSON.stringify({
                    withCollisions: true,
                    isPointerBlocker: true,
                    visible: true
                }));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (newTiles_1_1 && !newTiles_1_1.done && (_b = newTiles_1.return)) _b.call(newTiles_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
});
