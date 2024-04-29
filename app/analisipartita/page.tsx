'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { renderCellContent } from '../chess_rules/chess_rules';
import { mosse } from "../database/page";
import { vincitore } from "../database/page";
import { setConfig } from "next/config";

export default function Home() {
  const [hover1vs1, setHover] = useState(false);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false); 
  const [moves, setMoves] = useState<string[]>([]);
  const [visulizzaMoves, setVisualizzaMoves] = useState<string[]>([]);
  let [moveIndex, setMoveIndex] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState<string>("");
  
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
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const numbers = [8, 7, 6, 5, 4, 3, 2, 1];
  const [removedPiece, setRemovedPiece] = useState<string[]>([]);

  const getPieceAtCell = (cell: string, newCells: string) => {
    let [letter, number] = cell.split(''); 
    let [letter2, number2] = newCells.split('');
    let rowIndex = numbers.indexOf(parseInt(number));
    let colIndex = letters.indexOf(letter);
    let nextRowIndex = numbers.indexOf(parseInt(number2));
    let nextColIndex = letters.indexOf(letter2);

    let piece = cells[rowIndex][colIndex];
    let piece2 = cells[nextRowIndex][nextColIndex];

    if(piece2 != '') {
      setRemovedPiece([...removedPiece, piece2]); // Aggiungi il pezzo rimosso all'array    
    }

    cells[rowIndex][colIndex]='';
    cells[nextRowIndex][nextColIndex]=piece;
    
    setCells(cells);
  };
  
  const handlePrevMove = () => {
    if(moveIndex % 2 !== 0) {
      const nextMoveIndex = moveIndex - 1;
      setMoveIndex(nextMoveIndex);
      const firstMove = moves[moveIndex].split(' ')[0];
      const secondMove = moves[nextMoveIndex].split(' ')[0];
      getPieceAtCell(firstMove, secondMove);

      if (removedPiece.length > 0) { // Se c'è un pezzo rimosso, ripristinalo
        const firstMove = moves[moveIndex].split(' ')[0];
        const [letter, number] = firstMove.split('');
        const rowIndex = numbers.indexOf(parseInt(number));
        const colIndex = letters.indexOf(letter);
        const pieceToRestore = removedPiece.pop(); // Prendi l'ultimo pezzo rimosso
        if (pieceToRestore !== undefined) { // Controlla se il pezzo rimosso non è undefined
            cells[rowIndex][colIndex] = pieceToRestore; // Ripristina il pezzo nella sua posizione originale
            setCells(cells);
        }
      }
    }
    else {
      setMoveIndex(moveIndex-1);
    }
  };
  
  const handleNextMove = () => {
    if (moveIndex < moves.length - 1) {
      if (moveIndex % 2 === 0) {
        const nextMoveIndex = moveIndex + 1;
        setMoveIndex(nextMoveIndex);
        const firstMove = moves[moveIndex].split(' ')[0];
        const secondMove = moves[nextMoveIndex].split(' ')[0];
        getPieceAtCell(firstMove, secondMove);
        if (nextMoveIndex === moves.length-1) {
          setResultMessage('wins');
        }
      }
      else {
        setMoveIndex(moveIndex+1);
      }
    }
  };
  
  if (mosse != null) {
    const testMovesArray = mosse.split(' ');
    useEffect(() => {
      setVisualizzaMoves(testMovesArray);
      setMoves(testMovesArray);
      const arrocco_corto_bianco = testMovesArray.some((element) => element === 'O-O');
      if (arrocco_corto_bianco) {
        const updatedArray = testMovesArray.map((element) => (element === 'O-O' ? ['e1', 'g1', 'h1', 'f1'] : element));
        setMoves(updatedArray.flat());
      }
      const arrocco_lungo_bianco = testMovesArray.some((element) => element === 'O-O-O');
      if (arrocco_lungo_bianco) {
        const updatedArray = testMovesArray.map((element) => (element === 'O-O-O' ? ['e1', 'c1', 'a1', 'd1'] : element));
        setMoves(updatedArray.flat());
      }
      const arrocco_corto_nero = testMovesArray.some((element) => element === 'o-o');
      if (arrocco_corto_nero) {
        const updatedArray = testMovesArray.map((element) => (element === 'o-o' ? ['e8', 'g8', 'h8', 'f8'] : element));
        setMoves(updatedArray.flat());
      }
      const arrocco_lungo_nero = testMovesArray.some((element) => element === 'o-o-o');
      if (arrocco_lungo_bianco) {
        const updatedArray = testMovesArray.map((element) => (element === 'o-o-o' ? ['e8', 'c8', 'a8', 'd8'] : element));
        setMoves(updatedArray.flat());
      }
    }, []);
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24" style={{ backgroundColor: '#c3e6cb', position: 'relative' }}>
      <div className="button-wrapper" style={{ position: 'absolute', top: 10, right: 10 }}>
        <Link href="/database" passHref>
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
            <div key={`number-${index}`} className="p-4 w-12 h-12 flex justify-center items-center" style={{ color:'black'}}>{number}</div>
          ))}
        </div>
        <div className="grid grid-cols-8 relative">
          {letters.map((letter, index) => (
            <div key={`letter-${index}`} className="p-4 w-12 h-12 flex justify-center items-center" style={{ color:'black'}}>{letter}</div>
          ))}
          {cells.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`p-4 ${rowIndex % 2 === colIndex % 2 ? 'bg-slate-300' : 'bg-gray-500'} w-12 h-12 flex justify-center items-center`}
                style={{ 
                  backgroundColor: 
                    moves.length > 0 && 
                    moves[moveIndex] && 
                    moves[moveIndex].includes(`${letters[colIndex]}${8-rowIndex}`) ? 'yellow' : undefined 
                }}
              >
                {renderCellContent(cell)}
              </div>
            ))
          ))}
        </div>
      </div>
      {resultMessage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`bg-white p-4 rounded shadow relative ${resultMessage === 'wins' ? 'text-green-600' : 'text-red-600'}`}>
            <h2>{vincitore + ' ' + resultMessage}</h2>
            <button onClick={() => setResultMessage('')} className="text-gray-600 hover:text-gray-800 absolute top-0 right-0 m-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <div className="mt-4" style={{ color:'black'}}>
        Mosse effettuate nella partita: {visulizzaMoves.join(' , ')}
      </div>
      <div>
        <button onClick={handlePrevMove}
            style={{ padding: '8px 8px', backgroundColor: hoverPrev ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
            onMouseEnter={() => setHoverPrev(true)}
            onMouseLeave={() => setHoverPrev(false)}
          >
            {'<---'}
          </button>
          <button onClick={handleNextMove}
            style={{ padding: '8px 8px', backgroundColor: hoverNext ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
            onMouseEnter={() => setHoverNext(true)}
            onMouseLeave={() => setHoverNext(false)}
          >
            {'--->'}
          </button>
      </div>
    </main>
  )
};

