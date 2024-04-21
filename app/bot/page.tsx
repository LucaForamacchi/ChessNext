"use client"; 
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import { isValidMove, isValidCastle, isCheckMate, findpiece } from '../chess_rules/chess_rules';

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
  const [i, setI] = useState<number>(0);
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
      });
  
      socket.on("update_board", (newCells, currentTurn, new_move) => {
        console.log("aggiornamento");
        if(newCells !== lastcells) {
          setCells(newCells); // Aggiornamento delle celle
          setlastCells(newCells);
        }
        
  
        // Verifica se è il turno corrente del giocatore
        if (myturn && lastMove !== new_move) {
          console.log("mossa", lastMove, "mossa dopo", new_move);
          setMoves(moves => [...moves, new_move]);
          setLastMove(new_move);
        }
      });
  
      socket.on("isCheckMate", () => {
        const whiteKingPosition = findpiece("K", 'white', cells);
        const blackKingPosition = findpiece("k", 'black', cells);
  
        console.log("controllo scacchi", cells);
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
        setCells(newCells);
        setSelectedCell(null);
        for (let c = 0; c< 8; c++) {
          
          if(cells[0][c] === 'P') {
            cells[0][c] = 'Q';
          }
          else if(cells[7][c] === 'p') {
            cells[0][c] = 'q';
          }
        }
        socket?.emit("update_board", newCells, move);
        makeComputerMove();
        //setTurn(false);
        if (temp === 'K'){setWhiteKingHasMoved(true);}
        else if (temp === "k"){setBlackKingHasMoved(true);}
        else if (temp === "R" && selectedCell.colIndex === 0){setWhiteLRookHasMoved(true);}
        else if (temp === "R" && selectedCell.colIndex === 7){setWhiteRRookHasMoved(true);}
        else if (temp === "r" && selectedCell.colIndex === 7){setBlackLRookHasMoved(true);}
        else if (temp === "r" && selectedCell.colIndex === 0){setBlackRRookHasMoved(true);}
      } 
      else if(isValidCastle(selectedCell.rowIndex, selectedCell.colIndex, rowIndex, colIndex, cells, WhiteKingHasMoved, WhiteLRookHasMoved, WhiteRRookHasMoved)) {
        // Arrocco bianco corto
        if (rowIndex === 7 && colIndex === 6) {
          setWhiteRRookHasMoved(true);
          //socket?.emit("new_move", "O-O");
          move = "O-O";
      }
      // Arrocco bianco lungo
      else if (rowIndex === 0 && colIndex === 2) {
          setWhiteLRookHasMoved(true);
          //socket?.emit("new_move", "O-O-O");
          move = "O-O-O";
      }
      setWhiteKingHasMoved(true); // Imposta il re bianco come mosso
      setCells(newCells);
      setSelectedCell(null);
      socket?.emit("update_board", newCells, move);
      makeComputerMove();
    }else if (isValidCastle(selectedCell.rowIndex, selectedCell.colIndex, rowIndex, colIndex, cells, BlackKingHasMoved, BlackRRookHasMoved, BlackLRookHasMoved)){
      
        // Arrocco nero corto
        if (rowIndex === 7 && colIndex === 2) {
          setBlackLRookHasMoved(true);
          //socket?.emit("new_move", "o-o");
          move = "o-o";
          }
          // Arrocco nero lungo
          else if (rowIndex === 7 && colIndex === 6) {
              setBlackRRookHasMoved(true);
              //socket?.emit("new_move", "o-o-o");
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
    const validMoves = [];
    const newCells = [...cells];
    const moveScores: Record<string, number> = {}; // oggetto per memorizzare i punteggi delle mosse
    
    // Scansiona tutte le celle per trovare le mosse valide
    for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
      for (let colIndex = 0; colIndex < 8; colIndex++) {
        if (newCells[rowIndex][colIndex] !== '' && ((myturn && newCells[rowIndex][colIndex] === newCells[rowIndex][colIndex].toUpperCase() && colour === "black") || (myturn && newCells[rowIndex][colIndex] === newCells[rowIndex][colIndex].toLowerCase() && colour === "white"))) {
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              if (isValidMove(rowIndex, colIndex, i, j, newCells)) {
                // Calcola il punteggio per questa mossa
                const score = calculateMoveScore(rowIndex, colIndex, i, j, newCells);
                const moveKey = `${rowIndex},${colIndex},${i},${j}`;
                moveScores[moveKey] = score;
                validMoves.push({ from: { row: rowIndex, col: colIndex }, to: { row: i, col: j }, score });
              } 
            }
          }
        }
      }
    }
  
    // Se ci sono mosse valide, seleziona quella con il punteggio più alto
    if (validMoves.length > 0) {
      validMoves.sort((a, b) => b.score - a.score); // Ordina le mosse per punteggio decrescente
      console.log("mosse",validMoves);
      const { from, to } = validMoves[0]; // Seleziona la mossa con il punteggio più alto
      const move = `${letters[from.col]}${numbers[from.row]} => ${letters[to.col]}${numbers[to.row]}`;
      newCells[to.row][to.col] = newCells[from.row][from.col];
      newCells[from.row][from.col] = '';
      socket?.emit("update_board", newCells, move);
    }
  };
  
  // Funzione per calcolare il punteggio di una mossa
  const calculateMoveScore = (fromRow: number, fromCol: number, toRow: number, toCol: number, cells: any[]) => {
    const pieceValues: Record<string, number>  = {
      'p': 1, // Pedone
      'r': 5, // Torre
      'n': 3, // Cavallo
      'b': 3, // Alfiere
      'q': 9, // Regina
      'k': 100 // Re (valore arbitrario, in quanto non è desiderabile sacrificare il re)
    };
  
    // Matrice dei punteggi posizionali dei pedoni per il computer nero
    const pawnPositionScores = [
      [ 0,  0,  0,  0,  0,  0,  0,  0],
      [ 1,  1,  1,  0,  0,  1,  1,  1],
      [ 0,  0,  0,0.5,0.5,  0,  0,  0],
      [ 0,  0,  0,  1,  1,  0,  0,  0],
      [0.5,0.5, 1,1.5,1.5, 1, 0.5,0.5],
      [ 1,  1,  2,  3,  3,  2,  1,  1],
      [ 5,  5,  5,  5,  5,  5,  5,  5],
      [ 9,  9,  9,  9,  9,  9,  9,  9]
    ];
  
    // Simula la mossa sulla copia temporanea della scacchiera
    const tempCells = cells.map(row => [...row]); // Copia profonda della scacchiera
    const piece = tempCells[fromRow][fromCol];
    tempCells[toRow][toCol] = piece;
    tempCells[fromRow][fromCol] = '';
  
    let myScore = 0;
    let opponentScore = 0;
  
    // Calcola il punteggio totale dei pezzi sulla scacchiera
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = tempCells[i][j];
        if (piece !== '') {
          // Se il pezzo è nero, aggiungi il suo valore al punteggio dell'avversario
          if (piece === piece.toLowerCase()) {
            myScore += pieceValues[piece.toLowerCase()]; // Utilizza lettere maiuscole per il pezzo avversario
            // Se il pezzo è un pedone nero, aggiungi anche il punteggio posizionale
            if (piece === 'p') {
              myScore += pawnPositionScores[i][j];
            }
          } else { // Se il pezzo non è nero, aggiungi il suo valore al tuo punteggio
            opponentScore += pieceValues[piece.toLowerCase()];
            // Se il pezzo è un pedone bianco, aggiungi anche il punteggio posizionale
            if (piece === 'P') {
              opponentScore += pawnPositionScores[7-i][j]; // Inverto la riga
            }
          }
        }
      }
    }
  
    // Restituisci la differenza tra il tuo punteggio e quello dell'avversario
    return myScore - opponentScore;
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
            <div key={`number-${index}`} className="p-4 w-12 h-12 flex justify-center items-center">{
              <div>
               {number} 
              </div>
              }</div>
          ))}
        </div>
        <div className="grid grid-cols-8 relative"> {/* Aggiunto il relative positioning */}
          {letters.map((letter, index) => (
            <div key={`letter-${index}`} className="p-4 w-12 h-12 flex justify-center items-center">{
              <div>{letter}</div>
              }</div>
          ))}
          {cells.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`p-4 ${rowIndex % 2 === colIndex % 2 ? 'bg-gray-200' : 'bg-gray-400'} w-12 h-12` }
                style={{ backgroundColor: moves.length > 0 && moves[moves.length - 1].includes(`${letters[colIndex]}${numbers[rowIndex]}`) ? 'yellow' : undefined }}
                onClick={() => { handleCellClick(rowIndex, colIndex); }}
              >
                {cell !== '' ? (
                    <div>
                      {cell}
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
