'use client';
import { useEffect } from 'react';
import SudokuBoard from './components/SudokuBoard';
import KeyboardHandler from './components/KeyboardHandler';
import { useSudokuStore } from './store/useSudokuStore';

export default function Home() {
  const { grid, handleCellChange, initializeGrid } = useSudokuStore();

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <KeyboardHandler />
      <SudokuBoard 
        grid={grid} 
        onCellChange={handleCellChange}
        onNewPuzzle={initializeGrid}
      />
    </main>
  );
}
