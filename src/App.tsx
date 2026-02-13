import { useState, useEffect } from 'react';
import type { Node } from './types';
import { dijkstra, getNodesInShortestPathOrder } from './algorithms/dijkstra';
import { astar } from './algorithms/astar';
import { recursiveDivision } from './algorithms/maze';

const ROWS = 20;
const COLS = 40;

const App = () => {
  const [grid, setGrid] = useState<Node[][]>([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [draggingNode, setDraggingNode] = useState<'start' | 'end' | 'wall' | null>(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [algorithm, setAlgorithm] = useState<'dijkstra' | 'astar'>('dijkstra');
  const [speed, setSpeed] = useState(10);
  const [message, setMessage] = useState<string | null>(null); // メッセージ用

  useEffect(() => {
    resetGrid();
  }, []);

  const resetGrid = () => {
    if (isVisualizing) return;
    setMessage(null);
    const initialGrid = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push(createNode(row, col));
      }
      initialGrid.push(currentRow);
    }
    setGrid(initialGrid);
  };

  const createNode = (row: number, col: number): Node => ({
    row, col,
    isStart: row === 10 && col === 5,
    isEnd: row === 10 && col === 35,
    isWall: false,
    isVisited: false,
    isShortestPath: false,
    distance: Infinity,
    previousNode: null,
  });

  // --- 迷路生成 ---
  const generateMaze = () => {
    if (isVisualizing) return;
    const freshGrid = grid.map(row => row.map(node => ({
      ...node, isWall: false, isVisited: false, isShortestPath: false, distance: Infinity, previousNode: null
    })));
    setGrid(freshGrid);
    setMessage(null);
    setIsVisualizing(true);
    const walls: Node[] = [];
    recursiveDivision(freshGrid, 1, ROWS - 2, 1, COLS - 2, 'horizontal', walls);

    for (let i = 0; i < walls.length; i++) {
      setTimeout(() => {
        const wall = walls[i];
        updateNodeState(wall.row, wall.col, { isWall: true });
        if (i === walls.length - 1) setIsVisualizing(false);
      }, 10 * (i / 10));
    }
  };

  // --- アルゴリズム実行 ---
  const handleVisualize = () => {
    if (isVisualizing) return;
    clearPath();
    setMessage(null);
    setIsVisualizing(true);

    const newGrid = grid.map(row => row.map(node => ({ ...node })));
    const startNode = newGrid.flat().find(node => node.isStart)!;
    const finishNode = newGrid.flat().find(node => node.isEnd)!;

    let visitedNodesInOrder: Node[] | undefined;
    if (algorithm === 'dijkstra') {
      visitedNodesInOrder = dijkstra(newGrid, startNode, finishNode);
    } else {
      visitedNodesInOrder = astar(newGrid, startNode, finishNode);
    }

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    // 経路が見つかったかの判定：最短経路リストにスタートノードが含まれているか
    const isPathFound = nodesInShortestPathOrder.some(node => node.isStart);

    animatePathfinding(visitedNodesInOrder || [], nodesInShortestPathOrder, isPathFound);
  };

  const animatePathfinding = (visitedNodesInOrder: Node[], nodesInShortestPathOrder: Node[], isPathFound: boolean) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          if (isPathFound) {
            animateShortestPath(nodesInShortestPathOrder);
          } else {
            setIsVisualizing(false);
            setMessage("No path found! The target is unreachable.");
          }
        }, speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        updateNodeState(node.row, node.col, { isVisited: true });
      }, speed * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder: Node[]) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        updateNodeState(node.row, node.col, { isShortestPath: true });
        if (i === nodesInShortestPathOrder.length - 1) setIsVisualizing(false);
      }, 50 * i);
    }
  };

  const updateNodeState = (row: number, col: number, newState: Partial<Node>) => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = { ...newGrid[row][col], ...newState };
      return newGrid;
    });
  };

  const clearPath = () => {
    if (isVisualizing) return;
    setMessage(null);
    setGrid(prev => prev.map(row => row.map(node => ({
      ...node, isVisited: false, isShortestPath: false, distance: Infinity, previousNode: null
    }))));
  };

  // --- マウスイベント ---
  const handleMouseDown = (row: number, col: number) => {
    if (isVisualizing) return;
    const node = grid[row][col];
    setIsMousePressed(true);
    if (node.isStart) setDraggingNode('start');
    else if (node.isEnd) setDraggingNode('end');
    else { setDraggingNode('wall'); toggleWall(row, col); }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isMousePressed || !draggingNode || isVisualizing) return;
    if (draggingNode === 'start') moveSpecialNode(row, col, 'isStart');
    else if (draggingNode === 'end') moveSpecialNode(row, col, 'isEnd');
    else toggleWall(row, col);
  };

  const moveSpecialNode = (row: number, col: number, type: 'isStart' | 'isEnd') => {
    setGrid(prev => prev.map(r => r.map(node => ({
      ...node,
      [type]: node.row === row && node.col === col,
      isWall: node.row === row && node.col === col ? false : node.isWall
    }))));
  };

  const toggleWall = (row: number, col: number) => {
    const node = grid[row][col];
    if (node.isStart || node.isEnd) return;
    updateNodeState(row, col, { isWall: !node.isWall });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 select-none bg-[#0f172a] text-slate-200" onMouseUp={() => { setIsMousePressed(false); setDraggingNode(null); }}>
      <h1 className="text-4xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tighter italic">
        PATHFINDING VISUALIZER
      </h1>

      {/* メッセージ表示エリア */}
      <div className="h-10 flex items-center">
        {message && (
          <div className="bg-rose-500/20 text-rose-400 px-4 py-1 rounded-full text-xs font-bold border border-rose-500/30 animate-pulse">
            ⚠️ {message}
          </div>
        )}
      </div>

      {/* コントロールパネル */}
      <div className="flex flex-wrap items-center justify-center gap-6 my-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-1">Algorithm</label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as any)} disabled={isVisualizing} className="bg-slate-900 border border-slate-600 text-white px-4 py-2 rounded-lg outline-none focus:border-indigo-500 transition-all cursor-pointer text-sm">
            <option value="dijkstra">Dijkstra's (Shortest Path)</option>
            <option value="astar">A* Search (Heuristic)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest px-1">Speed: {speed}ms</label>
          <input type="range" min="1" max="50" step="1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-32 accent-indigo-500 cursor-pointer" />
        </div>

        <div className="h-10 w-[1px] bg-slate-700 mx-2 hidden lg:block"></div>

        <div className="flex items-center gap-3">
          <button onClick={handleVisualize} disabled={isVisualizing} className="px-8 py-3 bg-gradient-to-br from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-800 text-white font-black rounded-xl transition-all shadow-lg active:scale-95 uppercase text-xs tracking-widest">
            {isVisualizing ? 'Visualizing...' : `Run ${algorithm.toUpperCase()}`}
          </button>
          <button onClick={generateMaze} disabled={isVisualizing} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-emerald-400 font-bold rounded-xl transition-all text-xs uppercase tracking-widest border border-emerald-900/30 shadow-md">
            Generate Maze
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={clearPath} disabled={isVisualizing} className="px-4 py-2 text-xs font-bold border border-slate-600 rounded-lg hover:bg-slate-700 transition-all text-slate-400">Clear Path</button>
          <button onClick={resetGrid} disabled={isVisualizing} className="px-4 py-2 text-xs font-bold border border-slate-600 rounded-lg hover:bg-slate-700 transition-all text-slate-400">Reset All</button>
        </div>
      </div>

      {/* グリッド */}
      <div className="inline-grid border-4 border-slate-800 bg-slate-900 shadow-2xl rounded-sm overflow-hidden mb-8">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((node, nodeIdx) => (
              <div
                key={nodeIdx}
                onMouseDown={() => handleMouseDown(node.row, node.col)}
                onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                className={`w-6 h-6 border-[0.5px] border-slate-800/40 transition-all duration-300 relative
                  ${node.isStart ? 'bg-emerald-500 z-20 shadow-[0_0_15px_rgba(16,185,129,0.6)]' : ''}
                  ${node.isEnd ? 'bg-rose-500 z-20 shadow-[0_0_15px_rgba(244,63,94,0.6)]' : ''}
                  ${node.isWall ? 'bg-slate-800 scale-90 rounded-xs' : 'bg-[#1e293b] hover:bg-slate-700'}
                  ${node.isShortestPath ? 'bg-yellow-400 z-10 scale-100 shadow-[0_0_20px_#facc15]' :
                    node.isVisited && !node.isStart && !node.isEnd ? 'bg-indigo-600/40 animate-pulse' : ''}
                `}
              >
                <div className="flex items-center justify-center h-full text-[10px] font-black text-white/90">
                  {node.isStart && 'S'}
                  {node.isEnd && 'G'}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 凡例 */}
      <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-800/20 px-6 py-3 rounded-full border border-slate-800">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Start</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> Target</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-800 border border-slate-600"></div> Wall</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500/50"></div> Visited</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 shadow-[0_0_5px_#facc15]"></div> Path</div>
      </div>
    </div>
  );
};

export default App;