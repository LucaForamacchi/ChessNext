// Funzione per verificare se una mossa è valida
//lettere maiuscole bianco, minuscole nero
export function isValidMove(startRow: number, startCol: number, endRow: number, endCol: number, cells: string[][]) {
    //console.log("straprima", cells);
    const piece = cells[startRow][startCol];
    const destinationPiece = cells[endRow][endCol]; // Pezzo nella posizione di destinazione
    const deltax = Math.abs(startCol - endCol);
    const deltay = Math.abs(startRow - endRow);
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
        if (startCol === endCol && endRow < startRow) { // Movimento in avanti
            if ((deltay === 1 && destinationPiece === '') || (startRow === 6 && deltaY === 2 && destinationPiece === '' && cells[endRow + 1][endCol] === '')) {
                //console.log(endRow);
                //if (endRow === 0) {
                //    cells[0][startCol] = 'Q';
                //    console.log(cells);
                //}
                //console.log("prima",cells);
                //console.log("dentro al pedone111111")
                //const cell3 = cells.slice();
                //cell3[endRow][endCol]= piece;
                //cell3[startRow][startCol]= '';
                ////console.log(cells);
                //console.log(cells,isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cell3))
                //if (isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cell3)) {
                //    console.log("falso");
                //    return false;
                //}else{
                //    return true;
                //}
                //
                return true;
            }
        } else if ((startRow - endRow === 1) && deltax === 1 && destinationPiece !== '' && destinationPiece !== piece) {
            //console.log(endRow);
            //if (endRow === 0) {
            //    cells[0][endCol] = "Q";
            //    console.log(cells[0][endCol]);
            //    console.log(cells);
            //}
            //if (isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cells)) {
            //    let cell3 = cells.slice();
            //    cell3[endRow][endCol]= piece;
            //    cell3[startRow][startCol]= '';
            //    if (!isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cell3)) {
            //        return true;
            //    } else{return false;}
            //}
            return true; // mangiare
        }
        
    } else if (piece === 'p'){//pedone nero
        if (startCol === endCol && endRow > startRow) { // Muovimento in avanti
            if ((deltay === 1 && destinationPiece === '') || (startRow === 1 && deltaY === 2 && destinationPiece === '' && cells[endRow - 1][endCol] === '')) {
                //if (isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cells)) {
                //    let cell3 = cells.slice();
                //    cell3[endRow][endCol]= piece;
                //    cell3[startRow][startCol]= '';
                //    if (!isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cell3)) {
                //        return true;
                //    } else{return false;}
                //}
                return true;
            }
        } else if ((startRow - endRow === -1) && deltax === 1 && destinationPiece !== '' && destinationPiece !== piece) {
            //if (isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cells)) {
            //    let cell3 = cells.slice();
            //    cell3[endRow][endCol]= piece;
            //    cell3[startRow][startCol]= '';
            //    if (!isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cell3)) {
            //        return true;
            //    } else{return false;}
            //}
            return true; // mangiare
        }
    }
    
    switch (piece.toLocaleUpperCase()) {
        case 'N': // Cavallo
            if ((Math.abs(deltay) === 1 && Math.abs(deltax) === 2) || (Math.abs(deltay) === 2 && Math.abs(deltax) === 1)) {
                //if (piece === piece.toLocaleLowerCase() && isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cells)) {
                //    let cell3 = cells.slice();
                //    cell3[endRow][endCol]= piece;
                //    cell3[startRow][startCol]= '';
                //    if (!isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cell3)) {
                //        return true;
                //    } else{return false;}
                //} else if (piece === piece.toLocaleUpperCase() && isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cells)) {
                //    let cell3 = cells.slice();
                //    cell3[endRow][endCol]= piece;
                //    cell3[startRow][startCol]= '';
                //    if (!isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cell3)) {
                //        return true;
                //    } else{return false;}
                //}
                return true;  // Mosse valide a "L" del cavallo
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
                //if (piece === piece.toLocaleLowerCase() && isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cells)) {
                //    let cell3 = cells.slice();
                //    cell3[endRow][endCol]= piece;
                //    cell3[startRow][startCol]= '';
                //    if (!isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cell3)) {
                //        return true;
                //    } else{return false;}
                //} else if (piece === piece.toLocaleUpperCase() && isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cells)) {
                //    let cell3 = cells.slice();
                //    cell3[endRow][endCol]= piece;
                //    cell3[startRow][startCol]= '';
                //    if (!isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cell3)) {
                //        return true;
                //    } else{return false;}
                //}
                return true;  // Se non ci sono pezzi lungo la diagonale, la mossa è valida
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
                //if (piece === piece.toLocaleLowerCase() && isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cells)) {
                //    let cell3 = cells.slice();
                //    cell3[endRow][endCol]= piece;
                //    cell3[startRow][startCol]= '';
                //    if (!isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cell3)) {
                //        return true;
                //    } else{return false;}
                //} else if (piece === piece.toLocaleUpperCase() && isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cells)) {
                //    let cell3 = cells.slice();
                //    cell3[endRow][endCol]= piece;
                //    cell3[startRow][startCol]= '';
                //    if (!isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cell3)) {
                //        return true;
                //    } else{return false;}
                //}
                return true;  // Se non ci sono pezzi tra la posizione di partenza e la posizione di destinazione, la mossa è valida
            } else {
                return false; // Se non si muove lungo una riga o una colonna, la mossa non è valida
            }
        
        
        case 'Q': // Regina
             
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
                } else if (Math.abs(deltax) === Math.abs(deltay)){ // Si sta muovendo lungo una diagonale
                    let rowIncrement = (endRow > startRow) ? 1 : -1; // Incremento della riga
                    let colIncrement = (endCol > startCol) ? 1 : -1; // Incremento della colonna
                    for (let i = startRow + rowIncrement, j = startCol + colIncrement; i !== endRow; i += rowIncrement, j += colIncrement) {
                        if (cells[i][j] !== '') { // Se c'è un pezzo in una cella intermedia
                            return false; // La mossa non è valida
                        }
                    }
                } else {
                    return false; // Se non si muove lungo una riga, una colonna o una diagonale, la mossa non è valida
                }

                //console.log("posso spostare la regina in quel punto", cells[endRow][endCol] );
                return true;  // Se non ci sono pezzi tra la posizione di partenza e la posizione di destinazione, la mossa è valida
            
        
        
        case 'K': // Re 
            if ((deltax <= 1 && deltay <= 1)) { // Controllo se il re si muove al massimo di una casella in orizzontale o verticale
                //if (piece === piece.toLocaleLowerCase() && isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cells)) {
                //    let cell3 = cells.slice();
                //    cell3[endRow][endCol]= piece;
                //    cell3[startRow][startCol]= '';
                //    if (!isUnderAttack(blackKingPosition.row, blackKingPosition.col, "white", cell3)) {
                //        return true;
                //    } else{return false;}
                //} else if (piece === piece.toLocaleUpperCase() && isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cells)) {
                //    let cell3 = cells.slice();
                //    cell3[endRow][endCol]= piece;
                //    cell3[startRow][startCol]= '';
                //    if (!isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, "black", cell3)) {
                //        return true;
                //    } else{return false;}
                //}
                return true;  // La mossa è valida
            } else {
                return false; // La mossa non è valida
            }         
        
        default:
            return false; // Pezzo non riconosciuto
    }
}

export function isValidCastle(startRow: number, startCol: number, endRow: number, endCol: number, cells: string[][], kingMoved: boolean, LRookMoved: boolean, RRookMoved: boolean) {
    console.log("guardando arrocco");
    const piece = cells[startRow][startCol];
    const destinationPiece = cells[endRow][endCol]; // Pezzo nella posizione di destinazione

    // Verifica se la mossa è una mossa di arrocco
    if (piece === 'K' && !kingMoved) { // Arrocco bianco
        if (endCol === 6 && !RRookMoved) { // Arrocco corto
            if (cells[7][5] === '' && cells[7][6] === '' && cells[7][7] === 'R') {
                console.log("celle libere");
                // Controlla che non ci siano pezzi tra il re e la torre e che le caselle non siano sotto attacco
                if (!isUnderAttack(7, 4, 'black', cells) && !isUnderAttack(7, 5, 'black', cells) && !isUnderAttack(7, 6, 'black', cells)) {
                    console.log("svolgo arrocco");
                    // Sposta il re
                    cells[7][6] = 'K';
                    cells[7][4] = '';
                    // Sposta la torre
                    cells[7][5] = 'R';
                    cells[7][7] = '';
                    return true;
                }
            }
        } else if (endCol === 2 && !LRookMoved) { // Arrocco lungo
            if (cells[7][1] === '' && cells[7][2] === '' && cells[7][3] === '' && cells[7][0] === 'R') {
                // Controlla che non ci siano pezzi tra il re e la torre e che le caselle non siano sotto attacco
                if (!isUnderAttack(7, 2, 'black', cells) && !isUnderAttack(7, 3, 'black', cells) && !isUnderAttack(7, 4, 'black', cells)) {
                    console.log("svolgo arrocco");
                    // Sposta il re
                    cells[0][6] = 'K';
                    cells[0][4] = '';
                    // Sposta la torre
                    cells[0][5] = 'R';
                    cells[0][7] = '';
                    return true;
                }
            }
        }
    } else if (piece === 'k' && !kingMoved) { // Arrocco nero
        if (endCol === 6 && !LRookMoved) { // Arrocco corto
            if (cells[0][6] === '' && cells[0][5] === '' && cells[0][7] === 'r') {
                // Controlla che non ci siano pezzi tra il re e la torre e che le caselle non siano sotto attacco
                if (!isUnderAttack(0, 6, 'white', cells) && !isUnderAttack(0, 5, 'white', cells) && !isUnderAttack(0, 4, 'white', cells)) {
                    // Sposta il re
                    cells[0][6] = 'k';
                    cells[0][4] = '';
                    // Sposta la torre
                    cells[0][5] = 'r';
                    cells[0][7] = '';
                    return true;
                }
            }
        } else if (endCol === 2 && !RRookMoved) { // Arrocco lungo
            if (cells[0][1] === '' && cells[0][2] === ''  && cells[0][3] === '' && cells[0][0] === 'r') {
                // Controlla che non ci siano pezzi tra il re e la torre e che le caselle non siano sotto attacco
                if (!isUnderAttack(0, 2, 'white', cells) && !isUnderAttack(0, 3, 'white', cells) && !isUnderAttack(0, 4, 'white', cells)) {
                    // Sposta il re
                    cells[0][2] = 'k';
                    cells[0][4] = '';
                    // Sposta la torre
                    cells[0][3] = 'r';
                    cells[0][0] = '';
                    return true;
                }
            }
        }
    }
    return false; // La mossa non è un arrocco valido
}


// Funzione per verificare se una posizione è sotto attacco
export function isUnderAttack(row: number, col: number, attackingColor: string, cells1: string[][]) {
    console.log("controllando attacchi");
    // Trova il colore opposto
    const defendingColor = attackingColor === "white" ? "black" : "white";
    //console.log("attaccking color", attackingColor);
    // Per ogni cella sulla scacchiera
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // Se la cella contiene un pezzo del colore opposto
            const piece = cells1[i][j];
            
            if(piece==='' || (i===row && j === col)){continue;}
            if ((piece.toLowerCase() === piece && defendingColor === "white") || (piece.toUpperCase() === piece && defendingColor === "black")) {
                // Verifica se il pezzo può muoversi sulla posizione specificata
                //console.log(piece);
                //if (piece === "Q"){console.log("le mie palle",cells1);}

                if (isValidMove(i, j, row, col, cells1)) {
                    console.log("the piece attacking is: ",piece);
                    return true; // La posizione è sotto attacco
                }
            }
        }
    }
    // Nessuna mossa avversaria può raggiungere la posizione specificata
    return false; // La posizione non è sotto attacco
}



export function isCheckMate(kingRow: number, kingCol: number, kingColor: string, cells: string[][]) {
    const attackingColor = kingColor === "white" ? "black" : "white";
    console.log("primo arrivo",cells);
    if (!isUnderAttack(kingRow, kingCol, attackingColor, cells)) {
        //console.log("king not under attack");
        return false; // Il re non è sotto scacco, quindi non c'è scacco matto
    } else {
        console.log("king under attackkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
        console.log("arrivo celle", cells);
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
                //console.log("arrivo celle", cells);
                if (isValidMove(kingRow, kingCol, newRow, newCol, cells)) {
                    //console.log("strano", cells);
                    const cell2 = cells.map(row => [...row]);
                    console.log("celle2",cell2);
                    cell2[newRow][newCol] = kingColor === "white" ? "K" : "k";
                    cell2[kingRow][kingCol] = '';
                    //console.log("tentativi", cell2);
                    if(!isUnderAttack(newRow, newCol, attackingColor, cell2)){
                        // Se una mossa è possibile e il re non è più sotto scacco, non c'è scacco matto
                        console.log("king can move away", cell2);
                        return false;
                    }
                    
                }
            }
        }
        
        if (caninterfer(kingRow, kingCol, kingColor, cells)) {
            console.log("piece can defend the king");
            return false;
        }
        // Se non ci sono mosse valide in cui il re non è sotto scacco, allora c'è scacco matto
        console.log("checkmate");
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

export function caninterfer(kingRow: number, kingCol: number, kingColor: string, cells: string[][]): boolean {
    //console.log("arrivo celle", cells);
    let attackingColor = kingColor === "white" ? "black" : "white";
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let piece = cells[row][col];
            if (kingColor === 'white' && piece === piece.toUpperCase()) {
                for (let row1 = 0; row1 < 8; row1++) {
                    for (let col1 = 0; col1 < 8; col1++) {
                        if(isValidMove(row, col, row1, col1, cells)){
                            let trycell = cells.map(row => [...row]);
                            trycell[row1][col1] = piece;
                            trycell[row][col] = '';
                            const whiteKingPosition = findpiece("K", 'white', trycell);
                            if(!isUnderAttack(whiteKingPosition.row, whiteKingPosition.col, attackingColor, trycell)) {
                                console.log("white piece can interfer", piece, trycell);
                                return true;
                            }
                        }
                    }
                }
            }
            else if(kingColor === 'black' && piece === piece.toLowerCase()) {
                for (let row1 = 0; row1 < 8; row1++) {
                    for (let col1 = 0; col1 < 8; col1++) {
                        if(isValidMove(row, col, row1, col1, cells)){
                            let trycell = cells.map(row => [...row]);
                            trycell[row1][col1] = piece;
                            trycell[row][col] = '';
                            
                            const blackKingPosition = findpiece("k", 'black', trycell);
                            if(!isUnderAttack(blackKingPosition.row, blackKingPosition.col, attackingColor, trycell)) {
                                console.log("black piece can interfer", piece, trycell);
                                return true;
                            }
                        }
                    }
                }
            }
        }
    } 
    console.log("cannot interfer")
    return false;

}




export const renderCellContent = (content: string | JSX.Element) => {
    //PEZZI BIANCHI
    if (content === 'R')  { //TORRE
      return  <img src={'/torrebianca.png'} alt="White Rook" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
    if (content === 'P') { //PEDONE
      return <img src={'/pedonebianco.png'} alt="White pund" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
    if (content === 'N') { //CAVALLO
      return <img src={'/cavallobianco.png'} alt="White pund" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
    if (content === 'B') { //ALFIERE
      return <img src={'/alfierebianco.png'} alt="White pund" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
    if (content === 'Q') { //REGINA
      return <img src={'/reginabianca.png'} alt="White pund" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
    if (content === 'K') { //RE
      return <img src={'/rebianco.png'} alt="White pund" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
    //PEZZI NERI
    if (content === 'r')  { //TORRE
      return  <img src={'/torrenera.png'} alt="White Rook" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
    if (content === 'p') { //PEDONE
      return <img src={'/pedonenero.png'} alt="White pund" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
    if (content === 'n') { //CAVALLO
      return <img src={'/cavallonero.png'} alt="White pund" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
    if (content === 'b') { //ALFIERE
      return <img src={'/alfierenero.png'} alt="White pund" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
    if (content === 'q') { //REGINA
      return <img src={'/reginanera.png'} alt="White pund" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
    if (content === 'k') { //RE
      return <img src={'/renero.png'} alt="White pund" style={{width:'200%', height:'200%', objectFit:'cover'}}/>;
    }
  };