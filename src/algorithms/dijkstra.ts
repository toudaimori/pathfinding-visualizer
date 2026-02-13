import type { Node } from '../types';

export function dijkstra(grid: Node[][], startNode: Node, finishNode: Node) {
    const visitedNodesInOrder: Node[] = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length > 0) {
        // 1. 未訪問ノードの中から、現在最短距離にあるノードを選択（本来はPriority Queueを使うのが高速）
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();

        if (!closestNode) break;

        // 2. もし壁ならスキップ
        if (closestNode.isWall) continue;

        // 3. 距離が無限大なら、どのルートでもゴールに辿り着けないということ
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        // 4. ゴールに到達したら終了
        if (closestNode === finishNode) return visitedNodesInOrder;

        // 5. 隣接するノードの距離を更新
        updateUnvisitedNeighbors(closestNode, grid);
    }
}

function sortNodesByDistance(unvisitedNodes: Node[]) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node: Node, grid: Node[][]) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node; // 経路復元用に親を記録
    }
}

function getUnvisitedNeighbors(node: Node, grid: Node[][]) {
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

// 最短経路を復元する関数
export function getNodesInShortestPathOrder(finishNode: Node) {
    const nodesInShortestPathOrder = [];
    let currentNode: Node | null = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}