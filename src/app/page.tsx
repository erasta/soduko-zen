'use client';
import { useEffect } from 'react';
import SudokuBoard from './components/SudokuBoard';
import { useSudokuStore } from './store/useSudokuStore';

export default function Home() {
  const { grid, handleCellChange, initializeGrid } = useSudokuStore();

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

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
