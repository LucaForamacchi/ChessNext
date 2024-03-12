// To inform next js, this is a client component 
"use client"; 
import React, { useState } from 'react';

export default function Home() {
  const [cells, setCells] = useState<number[][]>([
    [5, 3, 3, 9, 10, 3, 3, 5],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [5, 3, 3, 9, 10, 3, 3, 5]
  ]);
  const [selectedCell, setSelectedCell] = useState<{ rowIndex: number, colIndex: number } | null>(null);
  const [moves, setMoves] = useState<string[]>([]); 

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (selectedCell) {
      const newCells = [...cells];
      const temp = newCells[selectedCell.rowIndex][selectedCell.colIndex];

      newCells[selectedCell.rowIndex][selectedCell.colIndex] = newCells[rowIndex][colIndex];
      newCells[rowIndex][colIndex] = temp;

      if (newCells[rowIndex][colIndex] !== 0) {
        newCells[selectedCell.rowIndex][selectedCell.colIndex] = 0;
        
        const move = `${selectedCell.rowIndex + 1}${selectedCell.colIndex + 1} => ${rowIndex + 1}${colIndex + 1}`;
        
        // Se la mossa implica una mangiata, aggiungi il "+" alla fine
        if ((Math.abs(selectedCell.rowIndex - rowIndex) > 1 || Math.abs(selectedCell.colIndex - colIndex) > 1)&&temp!=0) {
          setMoves(prevMoves => [...prevMoves, move + "+"]);
        } else {
          setMoves(prevMoves => [...prevMoves, move]);
        }
      }
      
      setCells(newCells);
      setSelectedCell(null);
    } else {
      setSelectedCell({ rowIndex, colIndex });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid grid-cols-8">
        {cells.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`p-4 ${rowIndex % 2 === colIndex % 2 ? 'bg-gray-200' : 'bg-gray-400'} w-12 h-12`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell !== 0 ? cell : ""}
            </div>
          ))
        ))}
      </div>
      <div className="mt-4">
        Mosse effettuate: {moves.join(' , ')}
      </div>
    </main>
  );
}
