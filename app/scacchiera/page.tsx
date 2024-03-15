"use client"; 
// Importa la libreria React e la funzione useState dall'esterno
import React, { useEffect, useState } from 'react';
// Importa il componente Link da Next.js
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';

//setMessage(moves[0]); handleSendMessage();
// Definizione della componente principale
export default function Home() {
  // Stato per la connessione del socket
  const [socket, setSocket] = useState<Socket | null>(null);
  const [inBox, setInbox] = useState<any>([])
  // Stabilisci la connessione al server Socket.IO all'avvio della componente
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    newSocket.on("message", (message) => {
      setInbox([...inBox, message])
    })
    // Chiudi la connessione quando la componente viene smontata
    return () => {
      newSocket.close();
    };
  }, []); // L'array vuoto [] assicura che questa useEffect venga eseguita solo una volta, all'avvio

  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (socket) { // Controlla se socket è definito
      socket.emit("message", message);
    }
  }
  // Stati della componente
  // Matrice rappresentante il tabellone di gioco
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
  // Cella selezionata
  const [selectedCell, setSelectedCell] = useState<{ rowIndex: number, colIndex: number } | null>(null);
  // Mosse effettuate
  const [moves, setMoves] = useState<string[]>([]);
  // Celle evidenziate
  const [highlightedCells, setHighlightedCells] = useState<{ rowIndex: number, colIndex: number }[]>([]); 
  // Flag per il mouse
  const [hover1vs1, setHover] = useState(false);

  // Definizione delle lettere per le colonne del tabellone
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  // Definizione dei numeri per le righe del tabellone
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

  const [lobby, setLobby] = useState("");

  // Funzione per gestire il click sulle celle del tabellone
  // Funzione per gestire il click sulle celle del tabellone
const handleCellClick = (rowIndex: number, colIndex: number) => {
  if (!lobby) {
    // Se l'utente non è in una lobby, non permettere l'interazione con la scacchiera
    return;
  }
  if (!selectedCell && cells[rowIndex][colIndex] !== 0) {
    // Se non è stata selezionata una cella precedente e la cella selezionata ha un valore diverso da 0
    setSelectedCell({ rowIndex, colIndex });
  } else if (selectedCell) {
    // Se è stata selezionata una cella precedente
    const newCells = [...cells];
    const temp = newCells[selectedCell.rowIndex][selectedCell.colIndex];

    // Verifica che la cella selezionata sia diversa dalla cella in cui si vuole fare lo scambio
    if (selectedCell.rowIndex !== rowIndex || selectedCell.colIndex !== colIndex) {
      newCells[selectedCell.rowIndex][selectedCell.colIndex] = newCells[rowIndex][colIndex];
      newCells[rowIndex][colIndex] = temp;

      // Imposta il valore 0 solo se la cella spostata aveva un valore diverso da 0
      if (temp !== 0) {
        newCells[selectedCell.rowIndex][selectedCell.colIndex] = 0;
      }

      const move = `${letters[selectedCell.colIndex]}${selectedCell.rowIndex + 1} => ${letters[colIndex]}${rowIndex + 1}`;

      if (cells[rowIndex][colIndex] !== 0 && newCells[rowIndex][colIndex] !== 0) {
        // Aggiungi il simbolo "+" solo se entrambe le celle coinvolte nello scambio hanno un valore diverso da 0
        setMoves(prevMoves => [...prevMoves, move + "+"]);
      } else {
        setMoves(prevMoves => [...prevMoves, move]);
      }

      setCells(newCells);
      setSelectedCell(null);
      setHighlightedCells([{ rowIndex: selectedCell.rowIndex, colIndex: selectedCell.colIndex }, { rowIndex, colIndex }]);
      
      // Invia il messaggio al server
      // Invia il nuovo stato della scacchiera al server
      socket?.emit("update_board", newCells);
    } else {
      setSelectedCell(null);
    }
  }
};

const joinLobby = () => {
  if (socket) {
    socket.emit("join_lobby");
  }
};

useEffect(() => {
  if (socket) {
    socket.on("lobby_joined", (lobbyName) => {
      setLobby(lobbyName);
    });
    socket.on("update_board", (newCells) => {
      setCells(newCells);
    });
  }
}, [socket]);
  
  // Ritorno della componente
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24" style={{ backgroundColor: '#c3e6cb' }}>
  {/* Pulsante per tornare indietro */}
  <div className="button-wrapper" style={{ position: 'relative', alignSelf: 'flex-end', marginRight: '10px', marginTop: '10px' }}>
    <Link href="/" passHref>
      <button
        style={{ padding: '10px 20px', backgroundColor: hover1vs1 ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        indietro
      </button>
    </Link>
  </div>
  {/* Contenitore per il tabellone */}
  <div className="flex">
    <div className="grid grid-cols-1">
      {/* Aggiunge una riga vuota all'inizio */}
      <div className="p-4 w-12 h-12"></div>
      {/* Renderizza i numeri delle righe */}
      {numbers.map((number, index) => (
        <div key={`number-${index}`} className="p-4 w-12 h-12 flex justify-center items-center">{number}</div>
      ))}
    </div>
    <div className="grid grid-cols-8">
      {/* Renderizza le lettere delle colonne */}
      {letters.map((letter, index) => (
        <div key={`letter-${index}`} className="p-4 w-12 h-12 flex justify-center items-center">{letter}</div>
      ))}
      {/* Renderizza le celle del tabellone */}
      {cells.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`p-4 ${rowIndex % 2 === colIndex % 2 ? 'bg-gray-200' : 'bg-gray-400'} w-12 h-12`}
            style={{ backgroundColor: highlightedCells.some(c => c.rowIndex === rowIndex && c.colIndex === colIndex) ? 'yellow' : undefined }}
            onClick={() => {handleCellClick(rowIndex, colIndex);}}
          >
            {/* Visualizza il valore della cella se non è vuota */}
            {cell !== 0 ? cell : ""}
          </div>
        ))
      ))}
    </div>
  </div>
  {/* Visualizza le mosse effettuate */}
  <div className="mt-4">
    Mosse effettuate: {moves.join(' , ')}
  </div>
  {/* Visualizza il nome della lobby */}
  {lobby && (
    <h2>You are in lobby: {lobby}</h2>
  )}
  {/* Condizione per la lobby */}
  {!lobby && (
    <div>
      <h2>No lobby joined</h2>
      <button onClick={joinLobby}>Join Lobby</button>
    </div>
  )}
</main>

  );
}
