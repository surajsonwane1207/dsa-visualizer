import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ShieldAlert, Zap, Info, HelpCircle } from 'lucide-react';

const ROWS = 18;
const COLS = 36;

const ALGO_DETAILS = {
  dijkstra: {
    name: "Dijkstra's Algorithm",
    time: 'O((V + E) log V)',
    space: 'O(V)',
    guaranteed: 'Yes (shortest path)',
    desc: 'Explores nodes in order of their distance from the start. It is weighted and guarantees the shortest path.',
    pseudocode: `dijkstra(grid, start, target):
  set distance of start to 0
  set distance of all others to infinity
  while unvisited nodes exist:
    curr = node with min distance
    mark curr as visited
    if curr == target: stop
    for each neighbor of curr:
      dist = curr.distance + 1
      if dist < neighbor.distance:
        neighbor.distance = dist
        neighbor.parent = curr`
  },
  astar: {
    name: 'A* Search',
    time: 'O(E log V)',
    space: 'O(V)',
    guaranteed: 'Yes (shortest path)',
    desc: 'Uses heuristics to estimate cost to the destination. It combines Dijkstra’s with Manhattan distance to target. Highly efficient and weighted.',
    pseudocode: `astar(grid, start, target):
  gScore[start] = 0
  fScore[start] = heuristic(start, target)
  openSet = [start]
  while openSet is not empty:
    curr = node in openSet with min fScore
    remove curr from openSet
    mark curr as visited
    if curr == target: stop
    for each neighbor of curr:
      tempG = gScore[curr] + 1
      if tempG < gScore[neighbor]:
        neighbor.parent = curr
        gScore[neighbor] = tempG
        fScore[neighbor] = tempG + heuristic(neighbor, target)
        add neighbor to openSet if not present`
  },
  bfs: {
    name: 'Breadth-First Search',
    time: 'O(V + E)',
    space: 'O(V)',
    guaranteed: 'Yes (for unweighted)',
    desc: 'Explores neighbor nodes level-by-level (expanding like a wave). It is unweighted and guarantees the shortest path on uniform cost grids.',
    pseudocode: `bfs(grid, start, target):
  queue = [start]
  mark start as visited
  while queue is not empty:
    curr = dequeue(queue)
    if curr == target: stop
    for each neighbor of curr:
      if neighbor is not visited:
        mark neighbor as visited
        neighbor.parent = curr
        enqueue(queue, neighbor)`
  },
  dfs: {
    name: 'Depth-First Search',
    time: 'O(V + E)',
    space: 'O(V)',
    guaranteed: 'No',
    desc: 'Explores as far as possible along each branch before backtracking. It is unweighted and does NOT guarantee the shortest path.',
    pseudocode: `dfs(grid, start, target):
  stack = [start]
  while stack is not empty:
    curr = pop(stack)
    if curr == target: stop
    if curr is not visited:
      mark curr as visited
      for each neighbor of curr:
        if neighbor is not visited:
          neighbor.parent = curr
          push(stack, neighbor)`
  }
};

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [draggingNode, setDraggingNode] = useState(null); // 'start' or 'target'
  const [startNode, setStartNode] = useState({ row: 8, col: 6 });
  const [targetNode, setTargetNode] = useState({ row: 8, col: 29 });
  const [selectedAlgo, setSelectedAlgo] = useState('dijkstra');
  const [speed, setSpeed] = useState(20); // ms delay per node
  const [isRunning, setIsRunning] = useState(false);

  const startNodeRef = useRef(startNode);
  const targetNodeRef = useRef(targetNode);
  startNodeRef.current = startNode;
  targetNodeRef.current = targetNode;

  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  // Initialize grid
  const getInitialGrid = (startLoc = startNode, targetLoc = targetNode) => {
    const initialGrid = [];
    for (let r = 0; r < ROWS; r++) {
      const currentRow = [];
      for (let c = 0; c < COLS; c++) {
        currentRow.push({
          row: r,
          col: c,
          isStart: r === startLoc.row && c === startLoc.col,
          isTarget: r === targetLoc.row && c === targetLoc.col,
          isWall: false,
          distance: Infinity,
          gScore: Infinity,
          fScore: Infinity,
          isVisited: false,
          previousNode: null,
        });
      }
      initialGrid.push(currentRow);
    }
    return initialGrid;
  };

  useEffect(() => {
    resetGrid();
  }, []);

  const resetGrid = () => {
    if (isRunning) return;
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);

    // Reset visual classes
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const el = document.getElementById(`node-${r}-${c}`);
        if (el) {
          el.className = 'grid-node';
          if (r === startNode.row && c === startNode.col) {
            el.classList.add('grid-node-start');
          } else if (r === targetNode.row && c === targetNode.col) {
            el.classList.add('grid-node-target');
          }
        }
      }
    }
  };

  const clearWalls = () => {
    if (isRunning) return;
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) =>
        row.map((node) => ({
          ...node,
          isWall: false,
        }))
      );
      return newGrid;
    });

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const el = document.getElementById(`node-${r}-${c}`);
        if (el) {
          el.classList.remove('grid-node-wall');
        }
      }
    }
  };

  const clearPathOnly = () => {
    if (isRunning) return;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const el = document.getElementById(`node-${r}-${c}`);
        if (el) {
          el.classList.remove('grid-node-visited');
          el.classList.remove('grid-node-shortest-path');
        }
      }
    }
  };

  // Mouse actions
  const handleMouseDown = (row, col) => {
    if (isRunning) return;
    setMouseIsPressed(true);

    if (row === startNode.row && col === startNode.col) {
      setDraggingNode('start');
    } else if (row === targetNode.row && col === targetNode.col) {
      setDraggingNode('target');
    } else {
      toggleWall(row, col);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (isRunning || !mouseIsPressed) return;

    if (draggingNode === 'start') {
      // Don't overlap with target
      if (row === targetNode.row && col === targetNode.col) return;
      
      const prevStart = startNode;
      const elPrev = document.getElementById(`node-${prevStart.row}-${prevStart.col}`);
      if (elPrev) elPrev.classList.remove('grid-node-start');
      
      const elNew = document.getElementById(`node-${row}-${col}`);
      if (elNew) {
        elNew.classList.remove('grid-node-wall');
        elNew.classList.add('grid-node-start');
      }

      setStartNode({ row, col });
    } else if (draggingNode === 'target') {
      // Don't overlap with start
      if (row === startNode.row && col === startNode.col) return;
      
      const prevTarget = targetNode;
      const elPrev = document.getElementById(`node-${prevTarget.row}-${prevTarget.col}`);
      if (elPrev) elPrev.classList.remove('grid-node-target');
      
      const elNew = document.getElementById(`node-${row}-${col}`);
      if (elNew) {
        elNew.classList.remove('grid-node-wall');
        elNew.classList.add('grid-node-target');
      }

      setTargetNode({ row, col });
    } else {
      toggleWall(row, col);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setDraggingNode(null);
  };

  const toggleWall = (row, col) => {
    const node = grid[row][col];
    if (node.isStart || node.isTarget) return;

    const el = document.getElementById(`node-${row}-${col}`);
    if (el) {
      if (el.classList.contains('grid-node-wall')) {
        el.classList.remove('grid-node-wall');
        node.isWall = false;
      } else {
        el.classList.add('grid-node-wall');
        node.isWall = true;
      }
    }
  };

  // Algorithms Implementation
  const getNeighbors = (node, currentGrid) => {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(currentGrid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(currentGrid[row + 1][col]);
    if (col > 0) neighbors.push(currentGrid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(currentGrid[row][col + 1]);
    return neighbors;
  };

  const manhattanDistance = (nodeA, nodeB) => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  };

  // Dijkstra
  const runDijkstra = (currentGrid, start, target) => {
    const visitedNodesInOrder = [];
    const unvisitedNodes = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const node = currentGrid[r][c];
        node.distance = r === start.row && c === start.col ? 0 : Infinity;
        node.isVisited = false;
        node.previousNode = null;
        unvisitedNodes.push(node);
      }
    }

    while (unvisitedNodes.length) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const closestNode = unvisitedNodes.shift();
      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) break;

      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);

      if (closestNode.row === target.row && closestNode.col === target.col) break;

      const neighbors = getNeighbors(closestNode, currentGrid).filter(n => !n.isVisited);
      for (const neighbor of neighbors) {
        const altDist = closestNode.distance + 1;
        if (altDist < neighbor.distance) {
          neighbor.distance = altDist;
          neighbor.previousNode = closestNode;
        }
      }
    }
    return visitedNodesInOrder;
  };

  // A*
  const runAStar = (currentGrid, start, target) => {
    const visitedNodesInOrder = [];
    const openSet = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const node = currentGrid[r][c];
        node.gScore = r === start.row && c === start.col ? 0 : Infinity;
        node.fScore = r === start.row && c === start.col ? manhattanDistance(start, target) : Infinity;
        node.isVisited = false;
        node.previousNode = null;
      }
    }

    const startNodeObj = currentGrid[start.row][start.col];
    openSet.push(startNodeObj);

    while (openSet.length) {
      openSet.sort((a, b) => a.fScore - b.fScore);
      const curr = openSet.shift();
      if (curr.isWall) continue;
      
      curr.isVisited = true;
      visitedNodesInOrder.push(curr);

      if (curr.row === target.row && curr.col === target.col) break;

      const neighbors = getNeighbors(curr, currentGrid).filter(n => !n.isVisited);
      for (const neighbor of neighbors) {
        if (neighbor.isWall) continue;
        const tempG = curr.gScore + 1;
        if (tempG < neighbor.gScore) {
          neighbor.previousNode = curr;
          neighbor.gScore = tempG;
          neighbor.fScore = tempG + manhattanDistance(neighbor, target);
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }
    return visitedNodesInOrder;
  };

  // BFS
  const runBFS = (currentGrid, start, target) => {
    const visitedNodesInOrder = [];
    
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const node = currentGrid[r][c];
        node.isVisited = false;
        node.previousNode = null;
      }
    }

    const startNodeObj = currentGrid[start.row][start.col];
    startNodeObj.isVisited = true;
    const queue = [startNodeObj];

    while (queue.length) {
      const curr = queue.shift();
      if (curr.isWall) continue;

      visitedNodesInOrder.push(curr);

      if (curr.row === target.row && curr.col === target.col) break;

      const neighbors = getNeighbors(curr, currentGrid).filter(n => !n.isVisited && !n.isWall);
      for (const neighbor of neighbors) {
        neighbor.isVisited = true;
        neighbor.previousNode = curr;
        queue.push(neighbor);
      }
    }
    return visitedNodesInOrder;
  };

  // DFS
  const runDFS = (currentGrid, start, target) => {
    const visitedNodesInOrder = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const node = currentGrid[r][c];
        node.isVisited = false;
        node.previousNode = null;
      }
    }

    const startNodeObj = currentGrid[start.row][start.col];
    const stack = [startNodeObj];

    while (stack.length) {
      const curr = stack.pop();
      if (curr.isVisited || curr.isWall) continue;

      curr.isVisited = true;
      visitedNodesInOrder.push(curr);

      if (curr.row === target.row && curr.col === target.col) break;

      const neighbors = getNeighbors(curr, currentGrid).filter(n => !n.isVisited && !n.isWall);
      // DFS standard goes deep on last added, reverse for conventional search direction
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        neighbor.previousNode = curr;
        stack.push(neighbor);
      }
    }
    return visitedNodesInOrder;
  };

  // Run Visualization
  const handleVisualize = async () => {
    if (isRunning) return;
    setIsRunning(true);
    isRunningRef.current = true;
    clearPathOnly();

    // Prepare fresh grid with wall preservation
    const currentGrid = grid.map(row => row.map(node => ({
      ...node,
      isStart: node.row === startNode.row && node.col === startNode.col,
      isTarget: node.row === targetNode.row && node.col === targetNode.col,
    })));

    let visitedNodesInOrder = [];
    if (selectedAlgo === 'dijkstra') {
      visitedNodesInOrder = runDijkstra(currentGrid, startNode, targetNode);
    } else if (selectedAlgo === 'astar') {
      visitedNodesInOrder = runAStar(currentGrid, startNode, targetNode);
    } else if (selectedAlgo === 'bfs') {
      visitedNodesInOrder = runBFS(currentGrid, startNode, targetNode);
    } else if (selectedAlgo === 'dfs') {
      visitedNodesInOrder = runDFS(currentGrid, startNode, targetNode);
    }

    const targetNodeInGrid = currentGrid[targetNode.row][targetNode.col];
    const shortestPath = [];
    let curr = targetNodeInGrid;
    while (curr !== null) {
      shortestPath.unshift(curr);
      curr = curr.previousNode;
    }

    // Playback visited animation
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      if (!isRunningRef.current) return;
      const node = visitedNodesInOrder[i];
      if (!node.isStart && !node.isTarget) {
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.classList.add('grid-node-visited');
        await new Promise(r => setTimeout(r, speed));
      }
    }

    // Playback path animation
    // Only show path if target was reached
    const reached = visitedNodesInOrder.some(n => n.row === targetNode.row && n.col === targetNode.col);
    if (reached) {
      for (let i = 0; i < shortestPath.length; i++) {
        if (!isRunningRef.current) return;
        const node = shortestPath[i];
        if (!node.isStart && !node.isTarget) {
          const el = document.getElementById(`node-${node.row}-${node.col}`);
          if (el) {
            el.classList.remove('grid-node-visited');
            el.classList.add('grid-node-shortest-path');
          }
          await new Promise(r => setTimeout(r, speed * 2));
        }
      }
    }

    setIsRunning(false);
    isRunningRef.current = false;
  };

  const details = ALGO_DETAILS[selectedAlgo];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', height: '100%' }}>
      {/* Settings Header Panel */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {Object.keys(ALGO_DETAILS).map((key) => (
            <button
              key={key}
              className="btn-secondary"
              onClick={() => !isRunning && setSelectedAlgo(key)}
              style={{
                borderColor: selectedAlgo === key ? 'var(--accent-primary)' : 'var(--border-color)',
                background: selectedAlgo === key ? 'rgba(139, 92, 246, 0.15)' : '',
                opacity: isRunning && selectedAlgo !== key ? 0.4 : 1
              }}
              disabled={isRunning}
            >
              {ALGO_DETAILS[key].name}
            </button>
          ))}
        </div>

        {/* Speed / Buttons Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '120px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Visualization Speed
            </label>
            <input
              type="range"
              min="2"
              max="100"
              value={102 - speed}
              onChange={(e) => setSpeed(102 - Number(e.target.value))}
              className="range-slider"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" onClick={handleVisualize} disabled={isRunning}>
              <Play size={16} /> Visualize
            </button>
            <button className="btn-secondary" onClick={clearWalls} disabled={isRunning}>
              Clear Walls
            </button>
            <button className="btn-secondary" onClick={resetGrid} disabled={isRunning}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Grid Board Canvas */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowX: 'auto', position: 'relative' }}>
        {/* Colors/Status Legend */}
        <div style={{ display: 'flex', gap: '18px', marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--color-success)', boxShadow: '0 0 6px var(--color-success)' }}></span> Start (Drag me!)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--color-danger)', boxShadow: '0 0 6px var(--color-danger)' }}></span> Target (Drag me!)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '2px', background: '#3b4252', border: '1px solid #4c566a' }}></span> Wall (Click & Drag)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '2px', background: 'rgba(139, 92, 246, 0.3)', border: '1px solid rgba(139, 92, 246, 0.4)' }}></span> Visited Node
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '2px', background: '#ec4899', border: '1px solid #f472b6', boxShadow: '0 0 6px rgba(236, 72, 153, 0.5)' }}></span> Shortest Path
          </div>
        </div>

        {/* The Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 25px)`,
            gap: '1px',
            backgroundColor: 'var(--border-color)',
            border: '2px solid var(--border-color)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
          onMouseLeave={handleMouseUp}
        >
          {grid.map((row, rIdx) =>
            row.map((node, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                id={`node-${rIdx}-${cIdx}`}
                className={`grid-node ${node.isStart ? 'grid-node-start' : node.isTarget ? 'grid-node-target' : ''}`}
                onMouseDown={() => handleMouseDown(rIdx, cIdx)}
                onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                onMouseUp={handleMouseUp}
              />
            ))
          )}
        </div>
      </div>

      {/* Info Breakdown Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Stats */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Zap size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Algorithm Metrics</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Time Complexity</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--color-warning)' }}>{details.time}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Space Complexity</td>
                <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{details.space}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: '500' }}>Guarantees Shortest Path?</td>
                <td style={{ padding: '8px 0', textAlign: 'right', color: details.guaranteed.startsWith('Yes') ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: '600' }}>
                  {details.guaranteed}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Narrative Description */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Info size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>How it Works</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
            {details.desc}
          </p>
        </div>

        {/* Pseudocode */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <HelpCircle size={20} className="text-gradient" />
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Pseudocode</h3>
          </div>
          <pre style={{ fontSize: '11px', margin: 0, overflowX: 'auto', maxHeight: '180px', lineHeight: '1.4' }}>
            {details.pseudocode}
          </pre>
        </div>
      </div>
    </div>
  );
}
