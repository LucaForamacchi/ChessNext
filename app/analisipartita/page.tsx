'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { renderCellContent } from '../chess_rules/chess_rules';

export default function Home() {
  const [hover1vs1, setHover] = useState(false);
  const [moves, setMoves] = useState<string[]>([]);
  let [moveIndex, setMoveIndex] = useState<number>(0);
  
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
      }
      else {
        setMoveIndex(moveIndex+1);
      }
    }
  };

  const testMoves = 'e2 e4 d7 d5 b1 c3 d5 e4 c3 e4';
  const testMovesArray = testMoves.split(' ');
  useEffect(() => {
    setMoves(testMovesArray);
  }, []);

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
            <div key={`number-${index}`} className="p-4 w-12 h-12 flex justify-center items-center">{number}</div>
          ))}
        </div>
        <div className="grid grid-cols-8 relative">
          {letters.map((letter, index) => (
            <div key={`letter-${index}`} className="p-4 w-12 h-12 flex justify-center items-center">{letter}</div>
          ))}
          {cells.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`p-4 ${rowIndex % 2 === colIndex % 2 ? 'bg-indigo-200' : 'bg-gray-400'} w-12 h-12`}
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
      <div className="mt-4">
        Mosse effettuate: {moves.join(' , ')}
      </div>
      <div>
        <button onClick={handlePrevMove}
            style={{ padding: '8px 8px', backgroundColor: hover1vs1 ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {'<---'}
          </button>
          <button onClick={handleNextMove}
            style={{ padding: '8px 8px', backgroundColor: hover1vs1 ? '#218838' : '#28a745', color: 'white', borderRadius: '5px', fontSize: '18px', border: 'none', cursor: 'pointer' }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {'--->'}
          </button>
      </div>
    </main>
  )
};

