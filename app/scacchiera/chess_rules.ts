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
        } else if ((deltaX === 1 || deltax === -1) && deltaY === 1 && cells[endRow][endCol] !== '' && cells[endRow][endCol] !== cells[startRow][startCol]) {
            return true; // mangiare
        }
        
    }
    else if (piece === 'p'){//pedone nero
        if (startCol === endCol) {
            if ((deltaY === 1 && cells[endRow][endCol] === '') || (startRow === 6 && deltaY === 2 && cells[endRow][endCol] === '' && cells[endRow + 1][endCol] === '')) {
                return true;
            }
        } else if ((deltaX === 1 || deltax === -1) && deltaY === 1 && cells[endRow][endCol] !== '' && cells[endRow][endCol] !== cells[startRow][startCol]) {
            return true; // mangiare
        }
        
    }

    switch (piece.toLocaleUpperCase()) {
        case 'N': // Cavallo
        if ((Math.abs(deltay) + Math.abs(deltax) === 3) &&
        ((Math.abs(deltay) === 1 && Math.abs(deltax) === 2) || (Math.abs(deltay) === 2 && Math.abs(deltax) === 1))) {
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
export function isUnderAttack(row: number, col: number, attackingColor: string, cells: string[][]) {
    // Trova il colore opposto
    const defendingColor = attackingColor === "white" ? "black" : "white";

    // Per ogni cella sulla scacchiera
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // Se la cella contiene un pezzo del colore opposto
            if ((cells[i][j].toUpperCase()===cells[i][j] && attackingColor==="white") || (cells[i][j].toLowerCase()===cells[i][j] && attackingColor==="black")) {
                // Verifica se il pezzo può muoversi sulla posizione specificata
                if (isValidMove(i, j, row, col, cells)) {
                    return true; // La posizione è sotto attacco
                }
            }
        }
    }

    // Nessuna mossa avversaria può raggiungere la posizione specificata
    return false; // La posizione non è sotto attacco
}


export function isCheckMate(kingRow: number, kingCol: number, kingColor: string, cells: string[][]) {
    if (!isUnderAttack(kingRow, kingCol, kingColor, cells)) {
        return false; // Il re non è sotto scacco, quindi non c'è scacco matto
    } else {
        if((!isValidMove(kingRow, kingCol, kingRow+1, kingCol, cells)) && (!isValidMove(kingRow, kingCol, kingRow, kingCol+1, cells)) && (!isValidMove(kingRow, kingCol, kingRow+1, kingCol+1, cells)) && (!isValidMove(kingRow, kingCol, kingRow-1, kingCol, cells)) && (!isValidMove(kingRow, kingCol, kingRow, kingCol-1, cells)) && (!isValidMove(kingRow, kingCol, kingRow-1, kingCol-1, cells)) && (!isValidMove(kingRow, kingCol, kingRow-1, kingCol+1, cells)) && (!isValidMove(kingRow, kingCol, kingRow+1, kingCol-1, cells))){
            return true;
        }
        else{return false;}
    }
}

export function findpiece(piecename: string, pieceColor: string, cells: string[][]): { row: number, col: number } {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = cells[row][col];
            if ((piece === piecename && pieceColor === 'white') || (piecename === piece && pieceColor === 'black')) {
                return { row, col };
            }
        }
    }
    return { row: 0, col: 0 }; // Se il pezzo non è stato trovato
}

