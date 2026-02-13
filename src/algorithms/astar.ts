import type { Node } from '../types';

export function astar(grid: Node[][], startNode: Node, finishNode: Node) {
    const visitedNodesInOrder: Node[] = [];
    startNode.distance = 0;

    // A* 用のスコア。g: スタートからの距離, h: ゴールまでの推定距離
    const unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length > 0) {
        // 距離(g) + ヒューリスティック(h) が最小のノードを選択
        sortNodesByAStarScore(unvisitedNodes, finishNode);
        const closestNode = unvisitedNodes.shift();

        if (!closestNode) break;
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === finishNode) return visitedNodesInOrder;

        updateNeighbors(closestNode, grid);
    }
}

// マンハッタン距離（ヒューリスティック）を計算
function getManhattanDistance(node: Node, finishNode: Node) {
    return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
}

function sortNodesByAStarScore(unvisitedNodes: Node[], finishNode: Node) {
    unvisitedNodes.sort((nodeA, nodeB) => {
        const fA = nodeA.distance + getManhattanDistance(nodeA, finishNode);
        const fB = nodeB.distance + getManhattanDistance(nodeB, finishNode);
        return fA - fB;
    });
}

function updateNeighbors(node: Node, grid: Node[][]) {
    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
        const newDistance = node.distance + 1;
        if (newDistance < neighbor.distance) {
            neighbor.distance = newDistance;
            neighbor.previousNode = node;
        }
    }
}

function getNeighbors(node: Node, grid: Node[][]) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid: Node[][]) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}