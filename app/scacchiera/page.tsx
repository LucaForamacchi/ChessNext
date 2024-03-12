// To inform next js, this is a client component 
"use client"; 
import React, { useState } from 'react';
// Definizione del componente Home
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
  const [previousCell, setPreviousCell] = useState<{ rowIndex: number, colIndex: number } | null>(null);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (selectedCell) {
      // Scambio dei numeri tra le due caselle
      const temp = cells[selectedCell.rowIndex][selectedCell.colIndex];
      const newCells = [...cells];
      newCells[selectedCell.rowIndex][selectedCell.colIndex] = cells[rowIndex][colIndex];
      newCells[rowIndex][colIndex] = temp;
      setCells(newCells);
      setPreviousCell(selectedCell);
      setSelectedCell({ rowIndex, colIndex });
    } else {
      setSelectedCell({ rowIndex, colIndex });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Griglia di 8x8 celle */}
      <div className="grid grid-cols-8">
        {/* Generazione dinamica delle celle della griglia */}
        {cells.map((row, rowIndex) => (
          // Generazione dinamica delle colonne
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`} // Chiave unica per ogni cella
              className={`p-4 ${rowIndex % 2 === colIndex % 2 ? 'bg-gray-200' : 'bg-gray-400'} w-12 h-12`} // Applicazione di classi CSS in base alla posizione della cella
              onClick={() => handleCellClick(rowIndex, colIndex)} // Gestore del clic sulla cella
            >
              {/* Testo all'interno della cella, calcolato in base alla posizione */}
              {cell !== 0 ? cell : ""}
            </div>
          ))
        ))}
      </div>
      {/* Visualizzazione del numero della cella cliccata */}
      {selectedCell && (
        <div className="mt-4">
          Cell clicked: {cells[selectedCell.rowIndex][selectedCell.colIndex]}
        </div>
      )}
      {/* Visualizzazione della cella precedente */}
      {previousCell && (
        <div className="mt-4">
          Previous cell: {cells[previousCell.rowIndex][previousCell.colIndex]}
        </div>
      )}
    </main>
  );
}