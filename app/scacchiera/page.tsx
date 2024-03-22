"use client"; 
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { isValidMove, isValidCastle, isCheckMate, findpiece } from '../chess_rules/chess_rules';

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
  const [colour, setColour] = useState("white");
  const [myturn, setTurn] = useState(true);
  const [i, setI] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [end, setEnd] = useState(false);
  const [WhiteKingHasMoved, setWhiteKingHasMoved] = useState(false);
  const [BlackKingHasMoved, setBlackKingHasMoved] = useState(false);
  const [WhiteLRookHasMoved, setWhiteLRookHasMoved] = useState(false);
  const [WhiteRRookHasMoved, setWhiteRRookHasMoved] = useState(false);
  const [BlackLRookHasMoved, setBlackLRookHasMoved] = useState(false);
  const [BlackRRookHasMoved, setBlackRRookHasMoved] = useState(false);



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
        socket.emit("turn");
        
      });
      socket.on("current_turn", (currentTurn) => {
        // Verifica se il turno corrente appartiene al socket corrente
        const isMyTurn = currentTurn === socket.id;
        (i%2)===0 ? setColour("black") : setColour("white");
        setI(i+1);
        // Imposta il turno corrente
        setTurn(isMyTurn);
      });

      socket.on("isCheckMate", () => {
        const whiteKingPosition = findpiece("K", 'white', cells);
        const blackKingPosition = findpiece("k", 'black', cells);
      
        if (isCheckMate(whiteKingPosition.row, whiteKingPosition.col, "white", cells)) {
          if (colour === "white") {
            setResultMessage("Lose");
            setEnd(true);
          } else {
            setResultMessage("Win");
            setEnd(true);
          }
        } else if (isCheckMate(blackKingPosition.row, blackKingPosition.col, "black", cells)) {
          if (colour === "black") {
            setResultMessage("Lose");
            setEnd(true);
          } else {
            setResultMessage("Win");
            setEnd(true);
          }
        }
      });
    
      socket.on("new_move", (new_move) =>{
        setMoves([...moves, new_move]);
      });
  
      if (myturn && moves.length !== 0 && moves.length % 2 === 0) {
        // Avvia l'intervallo solo se è il turno del giocatore bianco
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
      } else if (!myturn) {
        // Avvia l'intervallo solo se è il turno del giocatore nero
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
      
      socket.emit("checkmate");
    }
  }, [socket, moves]);
  

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!lobby || end) {
        return;
    }
    const piece = cells[rowIndex][colIndex];
    
    if (!selectedCell && piece !== '') {
      // Controlla se è il turno del giocatore corrente
      if ((myturn && piece === piece.toUpperCase() && colour === "white") || (myturn && piece === piece.toLowerCase() && colour === "black")) {
        setSelectedCell({ rowIndex, colIndex });
      }
      else {
        setSelectedCell(null);
      }
    } else if (selectedCell) {
      const newCells = [...cells];
      const temp = newCells[selectedCell.rowIndex][selectedCell.colIndex]
        // Controlla se la mossa è valida rispettando le regole degli scacchi
      if (isValidMove(selectedCell.rowIndex, selectedCell.colIndex, rowIndex, colIndex, cells)) {
        const move = `${letters[selectedCell.colIndex]}${selectedCell.rowIndex + 1} => ${letters[colIndex]}${rowIndex + 1}`
        if (newCells[rowIndex][colIndex] !== '') {
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
        if (temp === 'K'){setWhiteKingHasMoved(true);}
        else if (temp === "k"){setBlackKingHasMoved(true);}
        else if (temp === "R" && selectedCell.colIndex === 0){setWhiteLRookHasMoved(true);}
        else if (temp === "R" && selectedCell.colIndex === 7){setWhiteRRookHasMoved(true);}
        else if (temp === "r" && selectedCell.colIndex === 7){setBlackLRookHasMoved(true);}
        else if (temp === "r" && selectedCell.colIndex === 0){setBlackRRookHasMoved(true);}
        
      } else if(isValidCastle(selectedCell.rowIndex, selectedCell.colIndex, rowIndex, colIndex, cells, WhiteKingHasMoved, WhiteLRookHasMoved, WhiteRRookHasMoved)) {
        // Arrocco bianco corto
        if (rowIndex === 0 && colIndex === 2) {
          // Sposta il re
          newCells[0][2] = 'K';
          newCells[0][4] = '';
          // Sposta la torre
          newCells[0][3] = 'R';
          newCells[0][0] = '';
          setWhiteRRookHasMoved(true);
      }
      // Arrocco bianco lungo
      else if (rowIndex === 0 && colIndex === 6) {
          // Sposta il re
          newCells[0][6] = 'K';
          newCells[0][4] = '';
          // Sposta la torre
          newCells[0][5] = 'R';
          newCells[0][7] = '';
          setWhiteLRookHasMoved(true);
      }
      setWhiteKingHasMoved(true); // Imposta il re bianco come mosso
      setCells(newCells);
      setSelectedCell(null);
      socket?.emit("update_board", newCells);
    }else if (isValidCastle(selectedCell.rowIndex, selectedCell.colIndex, rowIndex, colIndex, cells, BlackKingHasMoved, BlackRRookHasMoved, BlackLRookHasMoved)){
        // Arrocco nero corto
        if (rowIndex === 7 && colIndex === 2) {
          // Sposta il re
          newCells[7][2] = 'k';
          newCells[7][4] = '';
          // Sposta la torre
          newCells[7][3] = 'r';
          newCells[7][0] = '';
          setBlackLRookHasMoved(true);
          }
          // Arrocco nero lungo
          else if (rowIndex === 7 && colIndex === 6) {
              // Sposta il re
              newCells[7][6] = 'k';
              newCells[7][4] = '';
              // Sposta la torre
              newCells[7][5] = 'r';
              newCells[7][7] = '';
              setBlackRRookHasMoved(true);
          }
          setCells(newCells);
          setSelectedCell(null);
          socket?.emit("update_board", newCells);
          setBlackKingHasMoved(true); // Imposta il re nero come mosso
      }
      }
      else {
          setSelectedCell({ rowIndex, colIndex });
      }
};
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24" style={{ backgroundColor: '#c3e6cb', position: 'relative' }}>
      <div className="button-wrapper" style={{ position: 'absolute', top: 10, right: 10 }}>
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
        <div className="grid grid-cols-8 relative"> {/* Aggiunto il relative positioning */}
          {letters.map((letter, index) => (
            <div key={`letter-${index}`} className="p-4 w-12 h-12 flex justify-center items-center">{letter}</div>
          ))}
          {cells.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`p-4 ${rowIndex % 2 === colIndex % 2 ? 'bg-gray-200' : 'bg-gray-400'} w-12 h-12`}
                style={{ backgroundColor: moves.length > 0 && moves[moves.length - 1].includes(`${letters[colIndex]}${rowIndex + 1}`) ? 'yellow' : undefined }}
                onClick={() => { handleCellClick(rowIndex, colIndex); }}
              >
                {cell !== '' ? cell : ""}
              </div>
            ))
          ))}
          {/* Sovrapposizione del messaggio di vittoria */}
          {resultMessage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`bg-white p-4 rounded shadow ${resultMessage === 'Win' ? 'text-green-600' : 'text-red-600'}`}>
                <h2>{'You ' + resultMessage}</h2>
              </div>
            </div>
          )}
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
