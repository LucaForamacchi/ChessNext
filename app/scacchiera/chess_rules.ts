// Funzione per verificare se una mossa è valida
//lettere maiuscole bianco, minuscole nero
export function isValidMove(startRow: number, startCol: number, endRow: number, endCol: number, cells: string[][]) {
    const piece = cells[startRow][startCol];
    const deltax = Math.abs(startCol - endCol);
    const deltay = Math.abs(startRow - endRow);
    const deltaX = Math.abs(endCol -startCol);
    const deltaY = Math.abs(endRow - startRow);

    if (piece === 'P'){//pedone bianco
        if (startCol === endCol) {
            if ((deltaY === 1 && cells[endRow][endCol] === '') || (startRow === 1 && deltaY === 2 && cells[endRow][endCol] === '' && cells[endRow - 1][endCol] === '')) {
                return true;
            }
        } else if (deltaX === 1 && deltaY === 1 && cells[endRow][endCol] !== '' && cells[endRow][endCol].toLowerCase() === cells[startRow][startCol].toLowerCase()) {
            return true; // mangiare
        } else if (startRow === 4 && endRow === 5 && deltax === 1 && cells[4][endCol] === 'p' && cells[startRow][startCol] === 'P') {
            return true; // en passant
        }
    }
    else if (piece === 'p'){//pedone nero
        if (startCol === endCol) {
            if ((deltaY === 1 && cells[endRow][endCol] === '') || (startRow === 6 && deltaY === 2 && cells[endRow][endCol] === '' && cells[endRow + 1][endCol] === '')) {
                return true;
            }
        } else if (deltaX === 1 && deltaY === 1 && cells[endRow][endCol] !== '' && cells[endRow][endCol].toUpperCase() === cells[startRow][startCol].toUpperCase()) {
            return true; // mangiare
        } else if (startRow === 3 && endRow === 2 && deltax === 1 && cells[3][endCol] === 'P' && cells[startRow][startCol] === 'p') {
            return true; // en passant
        }
    }

    switch (piece.toLocaleUpperCase()) {
        case 'N': // Cavallo
            if((deltay === -2 && deltax === 1) || (deltay === -1 && deltax === 2) || (deltay === 1 && deltax === 2) || (deltay === 2 && deltax === 1) || (deltay === 2 && deltax === -1) || (deltay === 1 && deltax === -2)){
                return true;
            }
        
            case 'B': // Alfiere 
            if (deltax === deltay) { // Controllo se si sta muovendo lungo una diagonale
                // Controllo se non ci sono pezzi tra la posizione di partenza e la posizione di destinazione
                let rowIncrement = (endRow > startRow) ? 1 : -1; // Incremento della riga
                let colIncrement = (endCol > startCol) ? 1 : -1; // Incremento della colonna
                for (let i = startRow + rowIncrement, j = startCol + colIncrement; i !== endRow; i += rowIncrement, j += colIncrement) {
                    if (cells[i][j] !== '') { // Se c'è un pezzo in una cella intermedia
                        return false; // La mossa non è valida
                    }
                }
                return true; // Se non ci sono pezzi tra la posizione di partenza e la posizione di destinazione, la mossa è valida
            } else {
                return false; // Se non si muove lungo una diagonale, la mossa non è valida
            }
        
            case 'R': // Torre 
            if (startRow === endRow || startCol === endCol) { // Controllo se si muove lungo una riga o una colonna
                // Controllo se non ci sono pezzi tra la posizione di partenza e la posizione di destinazione
                if (startRow === endRow) { // Si sta muovendo lungo una riga
                    let colIncrement = (endCol > startCol) ? 1 : -1; // Incremento della colonna
                    for (let j = startCol + colIncrement; j !== endCol; j += colIncrement) {
                        if (cells[startRow][j] !== '') { // Se c'è un pezzo in una cella intermedia
                            return false; // La mossa non è valida
                        }
                    }
                } else { // Si sta muovendo lungo una colonna
                    let rowIncrement = (endRow > startRow) ? 1 : -1; // Incremento della riga
                    for (let i = startRow + rowIncrement; i !== endRow; i += rowIncrement) {
                        if (cells[i][startCol] !== '') { // Se c'è un pezzo in una cella intermedia
                            return false; // La mossa non è valida
                        }
                    }
                }
                return true; // Se non ci sono pezzi tra la posizione di partenza e la posizione di destinazione, la mossa è valida
            } else {
                return false; // Se non si muove lungo una riga o una colonna, la mossa non è valida
            }
        
            case 'Q': // Regina 
            if ((startRow === endRow || startCol === endCol) || (deltax === deltay)) { 
                // Controllo se si muove lungo una riga o una colonna oppure lungo una diagonale
                if (startRow === endRow) { // Si sta muovendo lungo una riga
                    let colIncrement = (endCol > startCol) ? 1 : -1; // Incremento della colonna
                    for (let j = startCol + colIncrement; j !== endCol; j += colIncrement) {
                        if (cells[startRow][j] !== '') { // Se c'è un pezzo in una cella intermedia
                            return false; // La mossa non è valida
                        }
                    }
                } else if (startCol === endCol) { // Si sta muovendo lungo una colonna
                    let rowIncrement = (endRow > startRow) ? 1 : -1; // Incremento della riga
                    for (let i = startRow + rowIncrement; i !== endRow; i += rowIncrement) {
                        if (cells[i][startCol] !== '') { // Se c'è un pezzo in una cella intermedia
                            return false; // La mossa non è valida
                        }
                    }
                } else { // Si sta muovendo lungo una diagonale
                    let rowIncrement = (endRow > startRow) ? 1 : -1; // Incremento della riga
                    let colIncrement = (endCol > startCol) ? 1 : -1; // Incremento della colonna
                    for (let i = startRow + rowIncrement, j = startCol + colIncrement; i !== endRow; i += rowIncrement, j += colIncrement) {
                        if (cells[i][j] !== '') { // Se c'è un pezzo in una cella intermedia
                            return false; // La mossa non è valida
                        }
                    }
                }
                return true; // Se non ci sono pezzi tra la posizione di partenza e la posizione di destinazione, la mossa è valida
            } else {
                return false; // Se non si muove lungo una riga, una colonna o una diagonale, la mossa non è valida
            }
        
        case 'K': // Re 
            if ((deltax <= 1 && deltay <= 1)) { // Controllo se il re si muove al massimo di una casella in orizzontale o verticale
                return true; // La mossa è valida
            } else {
                return false; // La mossa non è valida
            }         
        
        default:
            return false; // Pezzo non riconosciuto
    }
}

// Funzione per verificare se una posizione è sotto attacco
export function isUnderAttack(row: number, col: number, attackingColor: string, cells: number[][]) {
    // Implementa qui la logica per verificare se la posizione è sotto attacco
    // Restituisci true se la posizione è sotto attacco, altrimenti false
}


