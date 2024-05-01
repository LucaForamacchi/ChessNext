"use client"; 
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { isValidMove, isValidCastle, isCheckMate, findpiece, isUnderAttack, renderCellContent } from '../chess_rules/chess_rules'

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [cells, setCells] = useState<string[][]>([
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    Array(8).fill(''),
    Array(8).fill(''),
    Array(8).fill(''),
    Array(8).fill(''),
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ]);
  
  const [selectedCell, setSelectedCell] = useState<{ rowIndex: number, colIndex: number } | null>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState('');
  const [hover1vs1, setHover] = useState(false);
  const [timer, setTimer] = useState<number>(600);
  const [lobby, setLobby] = useState("");
  const [myturn, setTurn] = useState(true);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [end, setEnd] = useState(false);
  const [WhiteKingHasMoved, setWhiteKingHasMoved] = useState(false);
  const [BlackKingHasMoved, setBlackKingHasMoved] = useState(false);
  const [WhiteLRookHasMoved, setWhiteLRookHasMoved] = useState(false);
  const [WhiteRRookHasMoved, setWhiteRRookHasMoved] = useState(false);
  const [BlackLRookHasMoved, setBlackLRookHasMoved] = useState(false);
  const [BlackRRookHasMoved, setBlackRRookHasMoved] = useState(false);
  const [clientId, setClientId] = useState<string | null>();
  const [player1, setplayer1] = useState("");
  let move = "";

  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const numbers = [8, 7, 6, 5, 4, 3, 2, 1];
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setClientId(newSocket.id);
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
      socket.on("lobby_joined", (lobbyName, creatorid) => {
        setLobby(lobbyName);
        setplayer1(creatorid[0]);
        //if (clientId!==player1){
        //  setTurn(false);
        //}
      });

      socket.on("update_board", (newCells, currentTurn, new_moves) => {
        setCells(cells => [...newCells]);
        // Verifica se il turno corrente appartiene al socket corrente
        const isMyTurn = currentTurn === socket.id;
        // Imposta il turno corrente
        setTurn(isMyTurn);
        setMoves(moves => [...new_moves]);
      });
      
      socket.on("isCheckMate", async () => {
        const whiteKingPosition = findpiece("K", 'white', cells);
        const blackKingPosition = findpiece("k", 'black', cells);
        if (isCheckMate(whiteKingPosition.row, whiteKingPosition.col, "white", cells)) {
          socket.emit("end-game", "black");
        } else if (isCheckMate(blackKingPosition.row, blackKingPosition.col, "black", cells)) {
          socket.emit("end-game", "white");
        }
      });
    
      socket.on("result", async (result_color) => {
        if (clientId === player1) {
          if (result_color === "white") {
            setResultMessage("win");
            setEnd(true);
          }
          else {
            setResultMessage("lose");
            setEnd(true);
          }
        }
        else if (clientId !== player1) {
          if (result_color === "black") {
            setResultMessage("win");
            setEnd(true);
          }
          else {
            setResultMessage("lose");
            setEnd(true);
          }
        }
      });
      
      //socket.emit("checkmate");
      let intervalId: NodeJS.Timeout;
      const decrementTimer = () => {
        setTimer(prevTimer => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(intervalId);
            return 0;
          }
        });
      };
  
      // Avvia l'intervallo solo se è il tuo turno
      if (myturn && timer > 0) {
        intervalId = setInterval(decrementTimer, 1000);
      }
      if (timer === 0){
        if(clientId===player1){
          socket.emit("end-game", "black");
        }
        else if (clientId!==player1){
          socket.emit("end-game", "white");
        }
      }
      // Pulisci l'intervallo quando il componente viene smontato o quando non è più il tuo turno
      return () => clearInterval(intervalId);
    
    }
  }, [socket, cells]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!lobby || end) {
        return;
    }
    const piece = cells[rowIndex][colIndex];
    if (!selectedCell && piece !== '') {
      // Controlla se è il turno del giocatore corrente
      if ((myturn && piece === piece.toUpperCase() && clientId===player1) || (myturn && piece === piece.toLowerCase() && clientId!==player1 && moves.length!==0)) {
        setSelectedCell({ rowIndex, colIndex });
      }
    } else if (selectedCell) {
      let newCells = cells.map(row => [...row]);
      let temp = newCells[selectedCell.rowIndex][selectedCell.colIndex]
      // Controlla se la mossa è valida rispettando le regole degli scacchi
      let valid_move = isValidMove(selectedCell.rowIndex, selectedCell.colIndex, rowIndex, colIndex, cells);
      if (valid_move) {
        move = `${letters[selectedCell.colIndex]}${8-selectedCell.rowIndex} => ${letters[colIndex]}${8-rowIndex}`;
        
        if (newCells[rowIndex][colIndex] !== '') {
            move += "+";
        }

        // Svuota la casella di partenza
        newCells[selectedCell.rowIndex][selectedCell.colIndex] = '';
        // Sposta il pezzo nella nuova posizione
        newCells[rowIndex][colIndex] = temp;
        
        for (let c = 0; c< 8; c++) {
          
          if(newCells[0][c] === 'P') {
            newCells[0][c] = 'Q';
          }
          else if(newCells[7][c] === 'p') {
            newCells[7][c] = 'q';
          }
        }

        if (clientId===player1) {
          let whiteKingPosition = findpiece("K", 'white', cells);
          if(isUnderAttack(whiteKingPosition.row,whiteKingPosition.col, 'black', cells)) {
            let whiteKingPosition = findpiece("K", 'white', newCells);
            if(!isUnderAttack(whiteKingPosition.row,whiteKingPosition.col, 'black', newCells)) {
              socket?.emit("update_board", newCells, move);
              setCells(newCells);
              setSelectedCell(null);
            } 
            
          } else {
            let whiteKingPosition = findpiece("K", 'white', newCells);
            if(!isUnderAttack(whiteKingPosition.row,whiteKingPosition.col, 'black', newCells)){
            socket?.emit("update_board", newCells, move);
            setCells(newCells);
            setSelectedCell(null);
            }
            
          }
        } else {
          let blackKingPosition = findpiece("k", 'black', cells);
          if(isUnderAttack(blackKingPosition.row,blackKingPosition.col, 'white', cells)) {
            blackKingPosition = findpiece("k", 'black', newCells);
            if(!isUnderAttack(blackKingPosition.row,blackKingPosition.col, 'white', newCells)) {
              socket?.emit("update_board", newCells, move);
              setCells(newCells);
              setSelectedCell(null);
            } 
            
          } else {
            blackKingPosition = findpiece("k", 'black', newCells);
            if(!isUnderAttack(blackKingPosition.row,blackKingPosition.col, 'white', newCells)){
              socket?.emit("update_board", newCells, move);
              setCells(newCells);
              setSelectedCell(null);
              }
          }
        }
        
        if (temp === 'K'){setWhiteKingHasMoved(true);}
        else if (temp === "k"){setBlackKingHasMoved(true);}
        else if (temp === "R" && selectedCell.colIndex === 0){setWhiteLRookHasMoved(true);}
        else if (temp === "R" && selectedCell.colIndex === 7){setWhiteRRookHasMoved(true);}
        else if (temp === "r" && selectedCell.colIndex === 7){setBlackLRookHasMoved(true);}
        else if (temp === "r" && selectedCell.colIndex === 0){setBlackRRookHasMoved(true);}
      }
      else if(isValidCastle(selectedCell.rowIndex, selectedCell.colIndex, rowIndex, colIndex, newCells, WhiteKingHasMoved, WhiteLRookHasMoved, WhiteRRookHasMoved, "white")) {
        // Arrocco bianco corto
        if (rowIndex === 7 && colIndex === 6) {
          setWhiteRRookHasMoved(true);
          move = "O-O";
      }
      // Arrocco bianco lungo
      else if (rowIndex === 7 && colIndex === 2) {
          setWhiteLRookHasMoved(true);
          move = "O-O-O";
      }
      setWhiteKingHasMoved(true); // Imposta il re bianco come mosso
      setCells(newCells);
      setSelectedCell(null);
      socket?.emit("update_board", newCells, move);
    } 
    else if (isValidCastle(selectedCell.rowIndex, selectedCell.colIndex, rowIndex, colIndex, newCells, BlackKingHasMoved, BlackRRookHasMoved, BlackLRookHasMoved, "black")){
        // Arrocco nero corto
        if (rowIndex === 0 && colIndex === 6) {
          setBlackLRookHasMoved(true);
          move = "o-o";
          }
          // Arrocco nero lungo
          else if (rowIndex === 0 && colIndex === 2) {
              setBlackRRookHasMoved(true);
              move = "o-o-o";
          }
          setCells(newCells);
          setSelectedCell(null);
          socket?.emit("update_board", newCells, move);
          setBlackKingHasMoved(true); // Imposta il re nero come mosso
      }
      else {
        setSelectedCell(null);
      }}
      
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const rotationStyle = clientId !== player1 ? { transform: 'rotate(180deg)' } : {};

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24" style={{ backgroundColor: '#c3e6cb', position: 'relative' }}>
      <div className="button-wrapper" style={{ position: 'absolute', top: 10, right: 10 }}>
        <Link href="/" passHref>
          <button
            style={{ padding: '10px 20px', backgroundColor: hover1vs1 ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Indietro
          </button>
        </Link>
      </div>
      <div className="flex">
        <div className="grid grid-cols-1" style={rotationStyle}>
          <div className="p-4 w-12 h-12"></div>
          {numbers.map((number, index) => (
            <div key={`number-${index}`} className="p-4 w-12 h-12 flex justify-center items-center" style={{ color:'black'}}>{
              <div style={rotationStyle}>
               {number} 
              </div>
              }</div>
          ))}
        </div>
        <div className="grid grid-cols-8 relative" style={rotationStyle}> {/* Aggiunto il relative positioning */}
          {letters.map((letter, index) => (
            <div key={`letter-${index}`} className="p-4 w-12 h-12 flex justify-center items-center" style={{ color:'black'}}>{
              <div style={rotationStyle}>{letter}</div>
              }</div>
          ))}
          {cells.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`p-4 ${rowIndex % 2 === colIndex % 2 ? 'bg-indigo-200' : 'bg-gray-500'} w-12 h-12 flex justify-center items-center` }
                style={{ backgroundColor: moves.length > 0 && moves[moves.length - 1].includes(`${letters[colIndex]}${8-rowIndex}`) ? '#ffd700' : undefined }}
                onClick={() => { handleCellClick(rowIndex, colIndex); }}
              >
                {cell !== '' ? (
                    <div style={{ transform: clientId !== player1 ? 'rotate(180deg)' : 'none' }}>
                      {renderCellContent(cell)}
                    </div>
                  ) : ""}
              </div>
            ))
          ))}
          {/* Sovrapposizione del messaggio di vittoria */}
          {resultMessage && (
            <div className="absolute inset-0 flex items-center justify-center" style={rotationStyle}>
              <div className={`bg-white p-4 rounded shadow ${resultMessage === 'win' ? 'text-green-600' : 'text-red-600'}`}>
                <h2>{'You ' + resultMessage}</h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4" style={{ color:'black'}}>
        Mosse effettuate: {moves.join(' , ')}
      </div>
      {lobby && (
        <h2 style={{ color:'black'}}>You are in lobby: {lobby}</h2>
      )}
      {(
        <button style={{ color:'black'}}>{player1}</button>
      )}
      {(
        <button style={{ color:'black'}}>{clientId}</button>
      )}
      <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#c3e6cb', padding: '10px', borderRadius: '5px', color:'black' }}>
        <h2 style={{ margin: '0' }}>Timer: {formatTime(timer)}</h2>
      </div>
    </main>
  );
}