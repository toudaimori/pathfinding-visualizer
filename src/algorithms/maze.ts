import type { Node } from '../types';

export function recursiveDivision(
    grid: Node[][],
    rowStart: number,
    rowEnd: number,
    colStart: number,
    colEnd: number,
    orientation: 'horizontal' | 'vertical',
    walls: Node[]
) {
    // 終了条件: スペースが足りなくなったら終了
    if (rowEnd < rowStart || colEnd < colStart) return;

    if (orientation === 'horizontal') {
        // 横に壁を作る行を選択
        const possibleRows = [];
        for (let i = rowStart; i <= rowEnd; i += 2) possibleRows.push(i);
        const possibleCols = [];
        for (let i = colStart - 1; i <= colEnd + 1; i += 2) possibleCols.push(i);

        if (possibleRows.length === 0 || possibleCols.length === 0) return;

        const currentRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
        const colPassage = possibleCols[Math.floor(Math.random() * possibleCols.length)];

        for (let col = colStart - 1; col <= colEnd + 1; col++) {
            // 配列の範囲内かつ、通り道(Passage)でない場合のみ壁にする
            if (
                col !== colPassage &&
                currentRow >= 0 && currentRow < grid.length &&
                col >= 0 && col < grid[0].length
            ) {
                const node = grid[currentRow][col];
                if (!node.isStart && !node.isEnd) walls.push(node);
            }
        }

        // 上下のエリアで再帰
        recursiveDivision(grid, rowStart, currentRow - 2, colStart, colEnd, 'vertical', walls);
        recursiveDivision(grid, currentRow + 2, rowEnd, colStart, colEnd, 'vertical', walls);
    } else {
        // 縦に壁を作る列を選択
        const possibleCols = [];
        for (let i = colStart; i <= colEnd; i += 2) possibleCols.push(i);
        const possibleRows = [];
        for (let i = rowStart - 1; i <= rowEnd + 1; i += 2) possibleRows.push(i);

        if (possibleCols.length === 0 || possibleRows.length === 0) return;

        const currentCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
        const rowPassage = possibleRows[Math.floor(Math.random() * possibleRows.length)];

        for (let row = rowStart - 1; row <= rowEnd + 1; row++) {
            // 配列の範囲内かつ、通り道(Passage)でない場合のみ壁にする
            if (
                row !== rowPassage &&
                row >= 0 && row < grid.length &&
                currentCol >= 0 && currentCol < grid[0].length
            ) {
                const node = grid[row][currentCol];
                if (!node.isStart && !node.isEnd) walls.push(node);
            }
        }

        // 左右のエリアで再帰
        recursiveDivision(grid, rowStart, rowEnd, colStart, currentCol - 2, 'horizontal', walls);
        recursiveDivision(grid, rowStart, rowEnd, currentCol + 2, colEnd, 'horizontal', walls);
    }
}