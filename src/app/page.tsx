'use client';
import { useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import SudokuBoard from './components/SudokuBoard';
import KeyboardHandler from './components/KeyboardHandler';
import { useSudokuStore } from './store/useSudokuStore';

export default function Home() {
  const { grid, handleCellChange, initializeGrid } = useSudokuStore();
  const { data: session } = useSession();

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24">
      <div className="w-full max-w-[450px] mb-4 flex justify-end">
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session.user?.name}
            </span>
            <button
              onClick={() => signOut()}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
      <KeyboardHandler />
      <SudokuBoard 
        grid={grid} 
        onCellChange={handleCellChange}
        onNewPuzzle={initializeGrid}
      />
    </main>
  );
}
