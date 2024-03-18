"use client"; 
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { isValidMove } from './chess_rules';

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [cells, setCells] = useState<string[][]>([
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    Array(8).fill(''),
    Array(8).fill(''),
    Array(8).fill(''),
    Array(8).fill(''),
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
  ]);
  
  const [selectedCell, setSelectedCell] = useState<{ rowIndex: number, colIndex: number } | null>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const [hover1vs1, setHover] = useState(false);
  const [timer, setTimer] = useState<number>(600);
  const [lobby, setLobby] = useState("");
  const [myturn, setTurn] = useState(true);

  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      // Quando il socket si connette, controlla se c'è una lobby disponibile
      newSocket.emit("check_lobby");
    });

    newSocket.on("lobby_available", (lobbyName: string) => {
      // Se una lobby è disponibile, unisciti automaticamente ad essa
      setLobby(lobbyName);
      newSocket.emit("join_lobby", lobbyName);
    });

    newSocket.on("no_lobby_available", () => {
      // Se nessuna lobby è disponibile, crea una nuova lobby
      newSocket.emit("create_lobby");
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("lobby_joined", (lobbyName) => {
        setLobby(lobbyName);
      });
      socket.on("update_board", (newCells) => {
        setCells(newCells);
      });
      socket.on("current_turn", (currentTurn) => {
        // Verifica se il turno corrente appartiene al socket corrente
        const isMyTurn = currentTurn === socket.id;
    
        // Imposta il turno corrente
        setTurn(isMyTurn);
    });
    
      socket.on("new_move", (new_move) =>{
        setMoves([...moves, new_move]);
      });
  
      if (moves.length !== 0 && moves.length % 2 === 0) {
        const interval = setInterval(() => {
          setTimer(prevTimer => {
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              clearInterval(interval);
              return 0;
            }
          });
        }, 1000);
    
        return () => clearInterval(interval);
      }
    }
  }, [socket, moves]);
  

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!lobby || !myturn) {
        return;
    }

    const piece = cells[rowIndex][colIndex];

    // Controlla se è il turno del giocatore corrente
    if ((myturn && piece === piece.toUpperCase()) || (!myturn && piece === piece.toLowerCase())) {
        if (!selectedCell && piece !== '') {
            setSelectedCell({ rowIndex, colIndex });
        } else if (selectedCell) {
            const newCells = [...cells];
            const temp = newCells[selectedCell.rowIndex][selectedCell.colIndex];

            if (selectedCell.rowIndex !== rowIndex || selectedCell.colIndex !== colIndex) {
                // Controlla se la mossa è valida rispettando le regole degli scacchi
                if (isValidMove(selectedCell.rowIndex, selectedCell.colIndex, rowIndex, colIndex, cells)) {
                    if ((myturn && piece === piece.toUpperCase()) || (!myturn && piece === piece.toLowerCase())) {
                        const move = `${letters[selectedCell.colIndex]}${selectedCell.rowIndex + 1} => ${letters[colIndex]}${rowIndex + 1}`;

                        if (newCells[rowIndex][colIndex] !== '') {
                            newCells[selectedCell.rowIndex][selectedCell.colIndex] = '';
                            socket?.emit("new_move", move + "+");
                        } else {
                            socket?.emit("new_move", move);
                        }

                        // Svuota la casella di partenza
                        newCells[selectedCell.rowIndex][selectedCell.colIndex] = '';

                        // Sposta il pezzo nella nuova posizione
                        newCells[rowIndex][colIndex] = temp;

                        setCells(newCells);
                        setSelectedCell(null);
                        socket?.emit("update_board", newCells);
                    } else {
                        console.log("Il pezzo selezionato non è consentito per il tuo turno.");
                    }
                } else {
                    setSelectedCell({ rowIndex, colIndex });
                }
            } else {
                setSelectedCell(null);
            }
        }
    }
};
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24" style={{ backgroundColor: '#c3e6cb' }}>
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
      <div className="flex">
        <div className="grid grid-cols-1">
          <div className="p-4 w-12 h-12"></div>
          {numbers.map((number, index) => (
            <div key={`number-${index}`} className="p-4 w-12 h-12 flex justify-center items-center">{number}</div>
          ))}
        </div>
        <div className="grid grid-cols-8">
          {letters.map((letter, index) => (
            <div key={`letter-${index}`} className="p-4 w-12 h-12 flex justify-center items-center">{letter}</div>
          ))}
          {cells.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`p-4 ${rowIndex % 2 === colIndex % 2 ? 'bg-gray-200' : 'bg-gray-400'} w-12 h-12`}
                style={{ backgroundColor: moves.length > 0 && moves[moves.length - 1].includes(`${letters[colIndex]}${rowIndex + 1}`) ? 'yellow' : undefined }}
                onClick={() => {handleCellClick(rowIndex, colIndex);}}
              >
                {cell !== '' ? cell : ""}
              </div>
            ))
          ))}
        </div>
      </div>
      <div className="mt-4">
        Mosse effettuate: {moves.join(' , ')}
      </div>
      {lobby && (
        <h2>You are in lobby: {lobby}</h2>
      )}
      <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#c3e6cb', padding: '10px', borderRadius: '5px' }}>
        <h2 style={{ margin: '0' }}>Timer: {formatTime(timer)}</h2>
      </div>
    </main>
  );
}
