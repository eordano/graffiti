import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
export const CHAR_TO_COLOR: Record<string, string> = {
  r: "#ff0000",
  g: "#00ff00",
  b: "#0000ff",
  _: "#000000",
};
export const COLOR_TO_CHAR: Record<string, string> = {
  "#ff0000": "r",
  "#00ff00": "g",
  "#0000ff": "b",
  "#000000": "_",
};
export const HEART = [
  [0, "r", "r", 0, "r", "r", 0],
  ["r", "r", "r", "r", "r", "r", "r"],
  ["r", "r", "r", "r", "r", "r", "r"],
  ["r", "r", "r", "r", "r", "r", "r"],
  [0, "r", "r", "r", "r", "r", 0],
  [0, 0, "r", "r", "r", 0, 0],
  [0, 0, 0, "r", 0, 0, 0],
];

const where = new URLSearchParams(window.location.search)
function App() {
  const [coord, setCoords] = useState(where.get('coord') || "34,-122");
  const setCoordsCb = useCallback((ev: any) => {
    setCoords(ev.target.value);
  }, []);
  const [grid, setGrid] = useState(null as null | string[][]);
  const [color, setColor] = useState("_");
  const [tool, setTool] = useState("point");
  const setColorCb = useCallback((ev: any) => {
    setColor(ev.target.value);
  }, []);
  const setToolCb = useCallback((ev: any) => {
    setTool(ev.target.value);
  }, []);
  const [currentCoords, setCurrentCoords] = useState(null as string | null);
  const [currentConnection, setCurrentConnection] = useState(
    null as WebSocket | null
  );
  useEffect(() => {
    if (currentConnection !== null) {
      return;
    }
    const io = new WebSocket("wss://tiles.interconnected.online/");
    const res = [] as string[][];
    io.onmessage = (ev: any) => {
      const msg = JSON.parse(ev.data);
      console.log("message", msg);
      if (msg.type === "snapshot") {
        const data = msg.data;
        for (let row = 0; row < data.length; row++) {
          res[data.length - row - 1] = [];
          for (let col = 0; col < data[row].length; col++) {
            res[data.length - row - 1][col] = data[row].charAt(col);
          }
        }
        setGrid(res);
        setCoords(coord);
        setCurrentCoords(coord);
        setCurrentConnection(io);
      }
      if (msg.type === "delta") {
        const { row, col, color } = msg;
        const newGrid = [...res];
        newGrid[res.length - row - 1][col] = COLOR_TO_CHAR[color];
        setGrid(newGrid);
      }
    };
    let interv: any = undefined;
    io.onopen = () => {
      interv = setInterval(() => {
        io.send(JSON.stringify({ type: "ping" }));
      }, 30000);
      io.send(JSON.stringify({ type: "snapshot", parcel: coord }));
    };
    if (!io) {
      return;
    }
    io.onclose = () => {
      if (interv !== undefined) {
        clearInterval(interv);
      }
      setCurrentConnection(null);
    };
  }, [coord, currentConnection]);
  const nul = () => ({});
  return (
    <div className="App">
      <form onSubmit={nul}>
        <div>
          <label htmlFor="coord">Coordinates: </label>
          <input
            className="coord"
            name="coord"
            id="coord"
            value={coord}
            onChange={setCoordsCb}
          ></input>
        </div>
        <div>
          <label htmlFor="coord">Color: </label>
          <select id="color" name="color" onChange={setColorCb}>
            <option value="_">Empty</option>
            <option value="r">Red</option>
            <option value="g">Green</option>
            <option value="b">Blue</option>
          </select>
        </div>
        <div>
          <label htmlFor="coord">Tool: </label>
          <select id="color" name="color" onChange={setToolCb}>
            <option value="point">Point</option>
            <option value="bucket">Bucket</option>
            <option value="heart">Heart</option>
          </select>
        </div>
      </form>
      <div>
        <h2>Mural: {currentCoords}</h2>
        <pre>
          {grid &&
            grid.map((_, index) => {
              return (
                <div key={"r" + index}>
                  {_.map(($, index2) => {
                    const setColor = (ev: any) => {
                      if (tool === "point")
                        currentConnection?.send(
                          JSON.stringify({
                            type: "color",
                            parcel: coord,
                            position: `${grid.length - index - 1},${index2}`,
                            color: CHAR_TO_COLOR[color],
                          })
                        );
                      if (tool === "heart") {
                        for (let i = 0; i < HEART.length; i++) {
                          for (let j = 0; j < HEART[i].length; j++) {
                            if (
                              HEART[i][j] === "r" &&
                              index + i < 10 &&
                              index2 + j < 32
                            ) {
                              currentConnection?.send(
                                JSON.stringify({
                                  type: "color",
                                  parcel: coord,
                                  position: `${grid.length - (index + i) - 1},${
                                    index2 + j
                                  }`,
                                  color: CHAR_TO_COLOR["r"],
                                })
                              );
                            }
                          }
                        }
                      }
                      if (tool === "bucket") {
                        const original = grid[index][index2];
                        const queue = [] as [number, number][];
                        const seen = {} as Record<string, boolean>;
                        seen[`${index},${index2}`] = true;
                        queue.push([index, index2]);
                        console.log("1", original, queue, seen);
                        while (queue.length > 0) {
                          const [a, b] = queue.pop() as [number, number];
                          console.log(grid, original, color, a, b, grid[a][b]);
                          if (CHAR_TO_COLOR[color].startsWith("#")) {
                            currentConnection?.send(
                              JSON.stringify({
                                type: "color",
                                parcel: coord,
                                position: `${grid.length - a - 1},${b}`,
                                color: CHAR_TO_COLOR[color],
                              })
                            );
                          }
                          for (let d = 0; d < 4; d++) {
                            const i = a + [0, 1, 0, -1][d];
                            const j = b + [1, 0, -1, 0][d];
                            if (i >= 0 && i < 10) {
                              if (j >= 0 && j < 32) {
                                if (seen[`${i},${j}`]) {
                                  continue;
                                }
                                seen[`${i},${j}`] = true;
                                console.log(
                                  grid,
                                  original,
                                  color,
                                  i,
                                  j,
                                  grid[i][j]
                                );
                                if (grid[i][j] === original) {
                                  queue.push([i, j]);
                                }
                              }
                            }
                          }
                        }
                      }
                    };
                    return (
                      <div
                        key={"c" + index2}
                        style={{
                          cursor: "crosshair",
                          display: "inline-block",
                          padding: "3px",
                          backgroundColor: CHAR_TO_COLOR[$ as "_"] as string,
                        }}
                        onClick={setColor}
                      >
                        {$}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </pre>
      </div>
    </div>
  );
}

export default App;
