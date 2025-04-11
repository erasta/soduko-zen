'use client';
import { useEffect } from 'react';
import { useSudokuStore } from '../store/useSudokuStore';

export const KeyboardHandler = () => {
  const { selectedCell, handleCellChange, moveSelectedCell } = useSudokuStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const [row, col] = selectedCell;

      if (e.key >= '1' && e.key <= '9') {
        const value = parseInt(e.key);
        handleCellChange(row, col, value);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleCellChange(row, col, 0);
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, handleCellChange, moveSelectedCell]);

  return null;
};

export default KeyboardHandler; 