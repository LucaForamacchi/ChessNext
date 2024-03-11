import React from 'react';
// Definizione del componente Home
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Griglia di 8x8 celle */}
      <div className="grid grid-cols-8">
        {/* Generazione dinamica delle celle della griglia */}
        {Array.from({ length: 8 }, (_, rowIndex) => (
          // Generazione dinamica delle colonne
          Array.from({ length: 8 }, (_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`} // Chiave unica per ogni cella
              className={`p-4 ${rowIndex % 2 === colIndex % 2 ? 'bg-gray-200' : 'bg-gray-400'}`} // Applicazione di classi CSS in base alla posizione della cella
            >
              {/* Testo all'interno della cella, calcolato in base alla posizione */}
              {rowIndex * 8 + colIndex + 1}
            </div>
          ))
        ))}
      </div>
    </main>
  );
}

