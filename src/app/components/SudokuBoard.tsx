'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSudokuStore } from '../store/useSudokuStore';

interface SudokuBoardProps {
  grid: number[][];
  onCellChange: (row: number, col: number, value: number) => void;
  onNewPuzzle: () => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ grid, onCellChange, onNewPuzzle }) => {
  const { selectedCell, setSelectedCell } = useSudokuStore();
  const [showWinMessage, setShowWinMessage] = useState(false);
  const cellRefs = useRef<(HTMLDivElement | null)[][]>(Array(9).fill(null).map(() => Array(9).fill(null)));

  const validateCell = useCallback((row: number, col: number, value: number): boolean => {
    if (value === 0) return true;
    
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === value) return false;
    }
    
    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === value) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (r !== row && c !== col && grid[r][c] === value) return false;
      }
    }
    
    return true;
  }, [grid]);

  // Check if the board is full and valid
  useEffect(() => {
    const isBoardFull = grid.every(row => row.every(cell => cell !== 0));
    const hasErrors = grid.some((row, rowIndex) => 
      row.some((cell, colIndex) => !validateCell(rowIndex, colIndex, cell))
    );
    
    if (isBoardFull && !hasErrors) {
      setShowWinMessage(true);
    } else {
      setShowWinMessage(false);
    }
  }, [grid, validateCell]);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col]);
    cellRefs.current[row][col]?.focus();
  };

  const moveSelectedCell = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    let newRow = row;
    let newCol = col;
    
    switch (direction) {
      case 'up':
        newRow = row > 0 ? row - 1 : 8;
        break;
      case 'down':
        newRow = row < 8 ? row + 1 : 0;
        break;
      case 'left':
        newCol = col > 0 ? col - 1 : 8;
        break;
      case 'right':
        newCol = col < 8 ? col + 1 : 0;
        break;
    }
    
    setSelectedCell([newRow, newCol]);
    cellRefs.current[newRow][newCol]?.focus();
  }, [selectedCell, setSelectedCell]);

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key >= '1' && e.key <= '9') {
      const value = parseInt(e.key);
      onCellChange(row, col, value);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      onCellChange(row, col, 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveSelectedCell('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveSelectedCell('down');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveSelectedCell('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveSelectedCell('right');
    }
  };

  const handleWheel = (e: React.WheelEvent, row: number, col: number) => {
    if (!selectedCell || (selectedCell[0] !== row || selectedCell[1] !== col)) return;
    
    e.preventDefault();
    const currentValue = grid[row][col];
    let newValue;
    
    if (e.deltaY > 0) {
      // Scrolling down
      newValue = currentValue === 9 ? 0 : currentValue + 1;
    } else {
      // Scrolling up
      newValue = currentValue === 0 ? 9 : currentValue - 1;
    }
    
    onCellChange(row, col, newValue);
  };

  const handleNumberButtonClick = (value: number) => {
    if (selectedCell) {
      onCellChange(selectedCell[0], selectedCell[1], value);
    }
  };

  // Initialize the first cell as selected when the component mounts
  useEffect(() => {
    if (grid.length > 0 && !selectedCell) {
      setSelectedCell([0, 0]);
      cellRefs.current[0][0]?.focus();
    }
  }, [grid, selectedCell, setSelectedCell]);

  return (
    <div className="flex flex-col items-center p-2 sm:p-4">
      <div className="flex justify-between w-full max-w-[450px] mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Sudoku</h1>
        <button
          onClick={onNewPuzzle}
          className="px-3 py-1 sm:px-4 sm:py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded hover:bg-[var(--button-hover)] transition-colors text-sm sm:text-base"
        >
          New Puzzle
        </button>
      </div>
      
      {showWinMessage && (
        <div className="mb-4 p-3 sm:p-4 bg-[var(--win-message-bg)] text-[var(--win-message-text)] rounded-lg font-bold text-sm sm:text-base">
          Congratulations! You&apos;ve solved the puzzle!
        </div>
      )}
      
      <div className="grid grid-cols-9 gap-[1px] bg-[var(--grid-bg)] p-[1px] w-full max-w-[450px]">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
            const isValid = validateCell(rowIndex, colIndex, cell);
            const cellKey = `${rowIndex}-${colIndex}`;
            
            return (
              <div
                key={cellKey}
                ref={el => { cellRefs.current[rowIndex][colIndex] = el; }}
                tabIndex={0}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                onWheel={(e) => handleWheel(e, rowIndex, colIndex)}
                className={`
                  aspect-square w-full max-w-[48px] flex items-center justify-center
                  bg-[var(--cell-bg)] text-base sm:text-xl font-medium cursor-pointer
                  ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-r-2 border-r-[var(--cell-border-dark)]' : ''}
                  ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-b-2 border-b-[var(--cell-border-dark)]' : ''}
                  ${isSelected ? 'bg-[var(--cell-selected)]' : ''}
                  ${!isValid ? 'text-[var(--invalid-text)]' : ''}
                  focus:outline-none focus:ring-2 focus:ring-[var(--button-bg)]
                `}
              >
                {cell !== 0 ? cell : ''}
              </div>
            );
          })
        )}
      </div>
      
      <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-1 sm:gap-2 max-w-[450px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberButtonClick(num)}
            className={`
              w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center
              rounded-full text-base sm:text-lg font-medium
              ${num === 0 
                ? "bg-[var(--number-button-bg-alt)] hover:bg-[var(--number-button-hover-alt)]" 
                : "bg-[var(--number-button-bg)] hover:bg-[var(--number-button-hover)]"}
              transition-colors
            `}
          >
            {num === 0 ? "⌫" : num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SudokuBoard; 