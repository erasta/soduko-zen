'use client';
import { useState, useEffect } from 'react';
import SudokuBoard from './components/SudokuBoard';

export default function Home() {
  const [grid, setGrid] = useState<number[][]>([]);

  // Check if a number can be placed in a cell without conflicts
  const isValidPlacement = (grid: number[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (grid[row][c] === num) return false;
    }
    
    // Check column
    for (let r = 0; r < 9; r++) {
      if (grid[r][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (grid[r][c] === num) return false;
      }
    }
    
    return true;
  };

  // Try to solve the grid using backtracking
  const solveGrid = (grid: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              if (solveGrid(grid)) {
                return true;
              }
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const initializeGrid = () => {
    // Start with an empty grid
    const newGrid = Array(9).fill(null).map(() => Array(9).fill(0));
    
    // Fill diagonal 3x3 boxes first (these are independent)
    for (let i = 0; i < 9; i += 3) {
      fillBox(newGrid, i, i);
    }
    
    // Solve the rest of the grid
    solveGrid(newGrid);
    
    // Now remove numbers to create the puzzle
    const totalCells = 81;
    const cellsToKeep = Math.floor(totalCells * 0.25); // Keep 25% of cells
    
    // Create an array of all positions
    const positions = Array.from({ length: totalCells }, (_, i) => i);
    
    // Shuffle the positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Create a copy of the solved grid
    const puzzleGrid = newGrid.map(row => [...row]);
    
    // Remove numbers from positions not in the first cellsToKeep positions
    for (let i = cellsToKeep; i < totalCells; i++) {
      const row = Math.floor(positions[i] / 9);
      const col = positions[i] % 9;
      puzzleGrid[row][col] = 0;
    }
    
    setGrid(puzzleGrid);
  };

  // Fill a 3x3 box with random numbers
  const fillBox = (grid: number[][], startRow: number, startCol: number) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    // Shuffle the numbers
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    let index = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        grid[startRow + i][startCol + j] = numbers[index++];
      }
    }
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  const handleCellChange = (row: number, col: number, value: number) => {
    const newGrid = [...grid];
    newGrid[row][col] = value;
    setGrid(newGrid);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SudokuBoard 
        grid={grid} 
        onCellChange={handleCellChange}
        onNewPuzzle={initializeGrid}
      />
    </main>
  );
}
