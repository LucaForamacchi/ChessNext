"use client"; 
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { isValidMove, isValidCastle, isCheckMate, findpiece, isUnderAttack, renderCellContent, calculateScore } from '../chess_rules/chess_rules';

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
  const [hover1vs1, setHover] = useState(false);
  const [timer, setTimer] = useState<number>(600);
  const [lobby, setLobby] = useState("");
  const [colour, setColour] = useState("white");
  const [myturn, setTurn] = useState(true);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [end, setEnd] = useState(false);
  let move = '';
  const [lastMove, setLastMove] = useState('');
  const [lastcells, setlastCells] = useState<string[][]>([]);

  
  const [WhiteKingHasMoved, setWhiteKingHasMoved] = useState(false);
  const [BlackKingHasMoved, setBlackKingHasMoved] = useState(false);
  const [WhiteLRookHasMoved, setWhiteLRookHasMoved] = useState(false);
  const [WhiteRRookHasMoved, setWhiteRRookHasMoved] = useState(false);
  const [BlackLRookHasMoved, setBlackLRookHasMoved] = useState(false);
  const [BlackRRookHasMoved, setBlackRRookHasMoved] = useState(false);


  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const numbers = [8, 7, 6, 5, 4, 3, 2, 1];
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      // Quando il socket si connette, crea una lobby
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
        socket.emit("bot");
      });
  
      socket.on("update_board", (newCells, currentTurn, new_moves) => {
        const isMyTurn = currentTurn === socket.id;
        // Imposta il turno corrente
        setMoves(() => [...new_moves]);

        const whiteKingPosition = findpiece("K", 'white', newCells);
        const blackKingPosition = findpiece("k", 'black', newCells);
  
        if (isCheckMate(whiteKingPosition.row, whiteKingPosition.col, "white", newCells)) {
          if (colour === "white") {
            setResultMessage("Lose");
            setEnd(true);
          } else {
            setResultMessage("Win");
            setEnd(true);
          }
        } else if (isCheckMate(blackKingPosition.row, blackKingPosition.col, "black", newCells)) {
          if (colour === "black") {
            setResultMessage("Lose");
            setEnd(true);
          } else {
            setResultMessage("Win");
            setEnd(true);
          }
        }
        //makeComputerMove();
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
  }, [socket, cells]); // Aggiunta cells come dipendenza
  
  
  

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
        move = `${letters[selectedCell.colIndex]}${numbers[selectedCell.rowIndex]} => ${letters[colIndex]}${numbers[rowIndex]}`
        if (newCells[rowIndex][colIndex] !== '') {
            move += "+";
        } 
        // Svuota la casella di partenza
        newCells[selectedCell.rowIndex][selectedCell.colIndex] = '';
        // Sposta il pezzo nella nuova posizione
        newCells[rowIndex][colIndex] = temp;
        
        for (let c = 0; c< 8; c++) {
          
          if(cells[0][c] === 'P') {
            cells[0][c] = 'Q';
          }
          else if(cells[7][c] === 'p') {
            cells[7][c] = 'q';
          }
        }
        const whiteKingPosition = findpiece("K", 'white', cells);
        if(isUnderAttack(whiteKingPosition.row,whiteKingPosition.col, 'black', cells)) {
          if(!isUnderAttack(whiteKingPosition.row,whiteKingPosition.col, 'black', newCells)) {
            socket?.emit("update_board", newCells, move);
            setCells(newCells);
            setSelectedCell(null);
            makeComputerMove();
          }
          
        } else {
          
          socket?.emit("update_board", newCells, move);
          setCells(newCells);
          setSelectedCell(null);
          makeComputerMove();
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
      else if (rowIndex === 0 && colIndex === 2) {
          setWhiteLRookHasMoved(true);
          move = "O-O-O";
      }
      setWhiteKingHasMoved(true); // Imposta il re bianco come mosso
      setCells(newCells);
      setSelectedCell(null);
      socket?.emit("update_board", newCells, move);
      makeComputerMove();
    }else if (isValidCastle(selectedCell.rowIndex, selectedCell.colIndex, rowIndex, colIndex, newCells, BlackKingHasMoved, BlackRRookHasMoved, BlackLRookHasMoved, "black")){
      
        // Arrocco nero corto
        if (rowIndex === 7 && colIndex === 2) {
          setBlackLRookHasMoved(true);
          move = "o-o";
          }
          // Arrocco nero lungo
          else if (rowIndex === 7 && colIndex === 6) {
              setBlackRRookHasMoved(true);
              move = "o-o-o";
          }
          setCells(newCells);
          setSelectedCell(null);
          socket?.emit("update_board", newCells, move);
          setBlackKingHasMoved(true); // Imposta il re nero come mosso
          makeComputerMove();
      }
      else {
        setSelectedCell(null);
      }
    }
};
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const makeComputerMove = () => {
    if(end){
      return;
    }
    //le mosse vanno dispari per spostare i pezzi neri
    findbestmove('black',cells, 2);
    bestscore = -10000;
    whitebestscore = 10000;
    let [row,col, row2, col2] = bestmove;
    let piece = cells[row][col];
    
    if (piece === 'k'){
      if (col === 4 && col2 === 6) {
        setBlackLRookHasMoved(true);
        move = "o-o";
        cells[0][6] = 'k';
        cells[0][4] = '';
        // Sposta la torre
        cells[0][5] = 'r';
        cells[0][7] = '';
        }
        // Arrocco nero lungo
        else if (col === 4 && col2 === 2) {
            setBlackRRookHasMoved(true);
            move = "o-o-o";
            // Sposta il re
            cells[0][2] = 'k';
            cells[0][4] = '';
            // Sposta la torre
            cells[0][3] = 'r';
            cells[0][0] = '';
        }
    } else {
      if(cells[row2][col2]!== '') {
        move = `${letters[col]}${numbers[row]} => ${letters[col2]}${numbers[row2]}+`;
      } else{
        move = `${letters[col]}${numbers[row]} => ${letters[col2]}${numbers[row2]}`;
      }
      cells[row2][col2] = piece;
      cells[row][col] = '';
      for (let c = 0; c< 8; c++) {
            
        if(cells[0][c] === 'P') {
          cells[0][c] = 'Q';
        }
        else if(cells[7][c] === 'p') {
          cells[7][c] = 'q';
        }
      }
    }
    socket?.emit("update_board", cells, move)
  };
  
  

  let initialscore = -10000;
  let winitialscore = 10000;
  let bestscore = -10000;
  let initialmove: number[];
  let winitialmove: number[];
  let bestmove: number[];
  let whitebestmove: number[];
  let whitebestscore = 10000;

  const findbestmove = (color: string, cells: string[][], depth: number) => {
    // Condizione di terminazione: raggiunto il livello massimo di profondità
    if (depth === 0) {
      return calculateScore(cells);
    }

    // Copia della scacchiera per effettuare le mosse senza modificare la posizione attuale
    const tempCells = cells.map(row => [...row]);

    // Scansione di ogni cella della scacchiera
    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      for (let colIndex = 0; colIndex < 8; colIndex++) {
        let piece = cells[rowIndex][colIndex];
        if (piece === '') {
          continue; // Se la cella è vuota, passa alla prossima
        }

        // Se il pezzo è nero e la ricerca è per i pezzi neri
        if (piece === piece.toLowerCase() && color === 'black') {
          // Scansione di tutte le mosse possibili per il pezzo
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              if (isValidMove(rowIndex, colIndex, i, j, tempCells)) {

                // Effettua la mossa sulla scacchiera temporanea
                let newCells = tempCells.map(row => [...row]);
                const piece = newCells[rowIndex][colIndex];
                newCells[i][j] = piece;
                newCells[rowIndex][colIndex] = '';
                
                let blackKingPosition = findpiece("k", 'black', tempCells);
                if(isUnderAttack(blackKingPosition.row,blackKingPosition.col, 'white', tempCells)) {
                  blackKingPosition = findpiece("k", 'black', newCells);
                  if(isUnderAttack(blackKingPosition.row,blackKingPosition.col, 'white', newCells)) {
                    continue;
                  } 
                } else {
                  blackKingPosition = findpiece("k", 'black', newCells);
                  if(isUnderAttack(blackKingPosition.row,blackKingPosition.col, 'white', newCells)){
                    continue;
                  }

                }
                // Calcola il punteggio per questa mossa
                const score = calculateScore(newCells);
                if (depth === 2) {
                  initialscore = score;
                  initialmove = [rowIndex, colIndex, i, j];
                  
                }
                // Chiamata ricorsiva per continuare la ricerca a profondità inferiore
                if (findbestmove('white', newCells, depth - 1) && score >= bestscore) {
                  bestmove = initialmove;
                  bestscore = score;
                }
              } else if(tempCells[rowIndex][colIndex]=='k'&& i===rowIndex){
                let newCells = tempCells.map(row => [...row]);
                if (isValidCastle(rowIndex, colIndex, i, j, newCells, BlackKingHasMoved, BlackRRookHasMoved, BlackLRookHasMoved, "black")){
                  let blackKingPosition = findpiece("k", 'black', tempCells);
                  if(isUnderAttack(blackKingPosition.row,blackKingPosition.col, 'white', tempCells)) {
                  blackKingPosition = findpiece("k", 'black', newCells);
                  if(isUnderAttack(blackKingPosition.row,blackKingPosition.col, 'white', newCells)) {
                    continue;
                  } 
                  } 
                  // Calcola il punteggio per questa mossa
                  const score = calculateScore(newCells);
                  if (depth === 2) {
                    initialscore = score;
                    initialmove = [rowIndex, colIndex, i, j];
                    
                  }
                  // Chiamata ricorsiva per continuare la ricerca a profondità inferiore
                  if (findbestmove('white', newCells, depth - 1) && score >= bestscore) {
                  //if (findbestmove('white', newCells, depth - 1)) {
                    bestmove = initialmove;
                    bestscore = score;
                  }
                } 
              } else {
                continue;
              }
            }
          }
        } else if (piece === piece.toUpperCase() && color === 'white') {
          // Scansione di tutte le mosse possibili per il pezzo bianco
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              if (isValidMove(rowIndex, colIndex, i, j, tempCells)) {
                // Effettua la mossa sulla scacchiera temporanea
                let newCells = tempCells.map(row => [...row]);
                const piece = newCells[rowIndex][colIndex];
                newCells[i][j] = piece;
                newCells[rowIndex][colIndex] = '';
                // Calcola il punteggio per questa mossa
                
                let whiteKingPosition = findpiece("K", 'white', tempCells);
                if(isUnderAttack(whiteKingPosition.row,whiteKingPosition.col, 'black', tempCells)) {
                  whiteKingPosition = findpiece("K", 'white', newCells);
                  if(isUnderAttack(whiteKingPosition.row,whiteKingPosition.col, 'black', newCells)) {
                    continue;
                  } 
                  
                }
                const score = calculateScore(newCells);
                if (depth === 1) {
                  winitialscore = score;
                  winitialmove = [rowIndex, colIndex, i, j];
                }
                // Chiamata ricorsiva per continuare la ricerca a profondità inferiore
                if (findbestmove('black', newCells, depth - 1) && score <= whitebestscore) {
                //if (findbestmove('black', newCells, depth - 1)) {
                  whitebestmove = initialmove;
                  whitebestscore = score;
                }
              }
            }
          }
      }
    }
  }
    // Restituisci il miglior punteggio trovato
    return bestscore;
  }

  
  
  
  
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
        <div className="grid grid-cols-1">
          <div className="p-4 w-12 h-12"></div>
          {numbers.map((number, index) => (
            <div key={`number-${index}`} className="p-4 w-12 h-12 flex justify-center items-center" style={{ color:'black'}}>{
              <div>
               {number} 
              </div>
              }</div>
          ))}
        </div>
        <div className="grid grid-cols-8 relative"> {/* Aggiunto il relative positioning */}
          {letters.map((letter, index) => (
            <div key={`letter-${index}`} className="p-4 w-12 h-12 flex justify-center items-center" style={{ color:'black'}}>{
              <div>{letter}</div>
              }</div>
          ))}
          {cells.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`p-4 ${rowIndex % 2 === colIndex % 2 ? 'bg-slate-300' : 'bg-gray-500'} w-12 h-12 flex justify-center items-center` }
                style={{ backgroundColor: moves.length > 0 && moves[moves.length - 1].includes(`${letters[colIndex]}${numbers[rowIndex]}`) ? 'yellow' : undefined }}
                onClick={() => { handleCellClick(rowIndex, colIndex); }}
              >
                {cell !== '' ? (
                    <div>
                      {renderCellContent(cell)}
                    </div>
                  ) : ""}
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
      <div className="mt-4" style={{ color:'black'}}>
        Mosse effettuate: {moves.join(' , ')}
      </div>
      {lobby && (
        <h2 style={{ color:'black'}}>You are in lobby: {lobby}</h2>
      )}

      <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#c3e6cb', padding: '10px', borderRadius: '5px', color: 'black' }}>
        <h2 style={{ margin: '0' }}>Timer: {formatTime(timer)}</h2>
      </div>
    </main>
  );
}