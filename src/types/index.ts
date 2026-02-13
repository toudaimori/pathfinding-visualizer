// src/types/index.ts

export interface Node {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    isVisited: boolean;
    isShortestPath: boolean;
    distance: number;
    previousNode: Node | null;
}