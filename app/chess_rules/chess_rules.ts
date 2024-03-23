// Funzione per verificare se una mossa è valida
//lettere maiuscole bianco, minuscole nero
export function isValidMove(startRow: number, startCol: number, endRow: number, endCol: number, cells: string[][]) {
    const piece = cells[startRow][startCol];
    const destinationPiece = cells[endRow][endCol]; // Pezzo nella posizione di destinazione
    const deltax = Math.abs(startCol - endCol);
    const deltay = Math.abs(startRow - endRow);
    const deltaX = Math.abs(endCol - startCol);
    const deltaY = Math.abs(endRow - startRow);

    // Verifica se la destinazione è la stessa posizione di partenza per evitare che il pezzo vada su se stesso
    if (startRow === endRow && startCol === endCol) {
        return false;
    }
    if(destinationPiece!==''){
        // Verifica se un pezzo bianco vuole muoversi su un altro pezzo bianco
        if (piece.toUpperCase() === piece && destinationPiece.toUpperCase() === destinationPiece) {
            return false;
        }

        // Verifica se un pezzo nero vuole muoversi su un altro pezzo nero
        if (piece.toLowerCase() === piece && destinationPiece.toLowerCase() === destinationPiece) {
            return false;
        }
    }
    

    if (piece === 'P'){//pedone bianco
        if (startCol === endCol && endRow < startRow) { // Muovimento in avanti
            if ((deltay === 1 && destinationPiece === '') || (startRow === 6 && deltaY === 2 && destinationPiece === '' && cells[endRow + 1][endCol] === '')) {
                return true;
            }
        } else if ((deltaX === 1 || deltaX === -1) && deltay === 1 && destinationPiece !== '' && destinationPiece !== piece) {
            return true; // mangiare
        }
        
    } else if (piece === 'p'){//pedone nero
        if (startCol === endCol && endRow > startRow) { // Muovimento in avanti
            if ((deltay === 1 && destinationPiece === '') || (startRow === 1 && deltaY === 2 && destinationPiece === '' && cells[endRow - 1][endCol] === '')) {
                return true;
            }
        } else if ((deltaX === 1 || deltaX === -1) && deltay === 1 && destinationPiece !== '' && destinationPiece !== piece) {
            return true; // mangiare
        }
    }
    
    switch (piece.toLocaleUpperCase()) {
        case 'N': // Cavallo
            if ((Math.abs(deltay) === 1 && Math.abs(deltax) === 2) || (Math.abs(deltay) === 2 && Math.abs(deltax) === 1)) {
                return true; // Mosse valide a "L" del cavallo
            } else{return false;}

        
        case 'B': // Alfiere
            // Controllo se si sta muovendo lungo una diagonale
            if (Math.abs(deltax) === Math.abs(deltay)) {
                // Controllo se ci sono pezzi lungo la diagonale in entrambe le direzioni
                let rowIncrement = (endRow > startRow) ? 1 : -1; // Incremento della riga
                let colIncrement = (endCol > startCol) ? 1 : -1; // Incremento della colonna
                for (let i = startRow + rowIncrement, j = startCol + colIncrement; i !== endRow; i += rowIncrement, j += colIncrement) {
                    if (cells[i][j] !== '') { // Se c'è un pezzo lungo la diagonale
                        return false; // La mossa non è valida
                    }
                }
                return true; // Se non ci sono pezzi lungo la diagonale, la mossa è valida
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
            if ((startRow === endRow || startCol === endCol) || (Math.abs(deltax) === Math.abs(deltay))) { 
                // Controllo se si muove lungo una riga, una colonna o una diagonale
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
            if ((deltax <= 1 && deltay <= 1 && deltax >= -1 && deltay >= -1)) { // Controllo se il re si muove al massimo di una casella in orizzontale o verticale
                return true; // La mossa è valida
            } else {
                return false; // La mossa non è valida
            }         
        
        default:
            return false; // Pezzo non riconosciuto
    }
}

export function isValidCastle(startRow: number, startCol: number, endRow: number, endCol: number, cells: string[][], kingMoved: boolean, LRookMoved: boolean, RRookMoved: boolean) {
    const piece = cells[startRow][startCol];
    const destinationPiece = cells[endRow][endCol]; // Pezzo nella posizione di destinazione

    // Verifica se la mossa è una mossa di arrocco
    if (piece === 'K' && !kingMoved) { // Arrocco bianco
        if (endCol === 2 && !RRookMoved) { // Arrocco corto
            if (cells[0][1] === '' && cells[0][2] === '' && cells[0][3] === '' && cells[0][0] === 'R') {
                // Controlla che non ci siano pezzi tra il re e la torre e che le caselle non siano sotto attacco
                if (!isUnderAttack(0, 4, 'white', cells) && !isUnderAttack(0, 3, 'white', cells) && !isUnderAttack(0, 2, 'white', cells)) {
                    return true;
                }
            }
        } else if (endCol === 6 && !LRookMoved) { // Arrocco lungo
            if (cells[0][5] === '' && cells[0][6] === '' && cells[0][7] === 'R') {
                // Controlla che non ci siano pezzi tra il re e la torre e che le caselle non siano sotto attacco
                if (!isUnderAttack(0, 4, 'white', cells) && !isUnderAttack(0, 5, 'white', cells) && !isUnderAttack(0, 6, 'white', cells)) {
                    return true;
                }
            }
        }
    } else if (piece === 'k' && !kingMoved) { // Arrocco nero
        if (endCol === 2 && !LRookMoved) { // Arrocco corto
            if (cells[7][1] === '' && cells[7][2] === '' && cells[7][3] === '' && cells[7][0] === 'r') {
                // Controlla che non ci siano pezzi tra il re e la torre e che le caselle non siano sotto attacco
                if (!isUnderAttack(7, 4, 'black', cells) && !isUnderAttack(7, 3, 'black', cells) && !isUnderAttack(7, 2, 'black', cells)) {
                    return true;
                }
            }
        } else if (endCol === 6 && !RRookMoved) { // Arrocco lungo
            if (cells[7][5] === '' && cells[7][6] === '' && cells[7][7] === 'r') {
                // Controlla che non ci siano pezzi tra il re e la torre e che le caselle non siano sotto attacco
                if (!isUnderAttack(7, 4, 'black', cells) && !isUnderAttack(7, 5, 'black', cells) && !isUnderAttack(7, 6, 'black', cells)) {
                    return true;
                }
            }
        }
    }

    return false; // La mossa non è un arrocco valido
}


// Funzione per verificare se una posizione è sotto attacco
export function isUnderAttack(row: number, col: number, attackingColor: string, cells: string[][]) {
    // Trova il colore opposto
    const defendingColor = attackingColor === "white" ? "black" : "white";

    // Per ogni cella sulla scacchiera
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // Se la cella contiene un pezzo del colore opposto
            const piece = cells[i][j];
            if(piece==='' || (i===row && j === col)){continue;}
            if ((piece.toUpperCase() === piece && defendingColor === "white") || (piece.toLowerCase() === piece && defendingColor === "black")) {
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
        // Itera attraverso tutte le possibili mosse del re e verifica se in almeno una di esse il re non è più sotto scacco
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
            for (let colOffset = -1; colOffset <= 1; colOffset++) {
                // Ignora la posizione attuale del re
                if (rowOffset === 0 && colOffset === 0) {
                    continue;
                }
                const newRow = kingRow + rowOffset;
                const newCol = kingCol + colOffset;
                if (newRow > 7 || newRow < 0 || newCol > 7 || newCol < 0){continue;}
                // Verifica se la mossa è valida e se dopo la mossa il re non è più sotto scacco
                if (isValidMove(kingRow, kingCol, newRow, newCol, cells)) {
                    const cell2 = cells;
                    cell2[newRow][newCol] = kingColor === "white" ? "K" : "k";
                    cell2[kingRow][kingCol] = '';
                    if(!isUnderAttack(newRow, newCol, kingColor, cell2)){
                        // Se una mossa è possibile e il re non è più sotto scacco, non c'è scacco matto
                        return false;
                    }
                    
                }
            }
        }
        // Se non ci sono mosse valide in cui il re non è sotto scacco, allora c'è scacco matto
        return true;
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

