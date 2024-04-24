// Funzione per verificare se una mossa è valida
//lettere maiuscole bianco, minuscole nero
export function isValidMove(startRow: number, startCol: number, endRow: number, endCol: number, cells: string[][]) {
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
                return true;
            }
        } else if ((startRow - endRow === 1) && deltax === 1 && destinationPiece !== '' && destinationPiece !== piece) {
            return true; // mangiare
        }
        
    } else if (piece === 'p'){//pedone nero
        if (startCol === endCol && endRow > startRow) { // Muovimento in avanti
            if ((deltay === 1 && destinationPiece === '') || (startRow === 1 && deltaY === 2 && destinationPiece === '' && cells[endRow - 1][endCol] === '')) {
                return true;
            }
        } else if ((startRow - endRow === -1) && deltax === 1 && destinationPiece !== '' && destinationPiece !== piece) {
            return true; // mangiare
        }
    }
    
    switch (piece.toLocaleUpperCase()) {
        case 'N': // Cavallo
            if ((Math.abs(deltay) === 1 && Math.abs(deltax) === 2) || (Math.abs(deltay) === 2 && Math.abs(deltax) === 1)) {
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

                return true;  // Se non ci sono pezzi tra la posizione di partenza e la posizione di destinazione, la mossa è valida
            
        
        
        case 'K': // Re 
            if ((deltax <= 1 && deltay <= 1)) { // Controllo se il re si muove al massimo di una casella in orizzontale o verticale
                return true;  // La mossa è valida
            } else {
                return false; // La mossa non è valida
            }         
        
        default:
            return false; // Pezzo non riconosciuto
    }
}

export function isValidCastle(startRow: number, startCol: number, endRow: number, endCol: number, cells: string[][], kingMoved: boolean, LRookMoved: boolean, RRookMoved: boolean) {
    const piece = cells[startRow][startCol];
    // Verifica se la mossa è una mossa di arrocco
    if (piece === 'K' && !kingMoved) { // Arrocco bianco
        if (endCol === 6 && !RRookMoved) { // Arrocco corto
            if (cells[7][5] === '' && cells[7][6] === '' && cells[7][7] === 'R') {
                // Controlla che non ci siano pezzi tra il re e la torre e che le caselle non siano sotto attacco
                if (!isUnderAttack(7, 4, 'black', cells) && !isUnderAttack(7, 5, 'black', cells) && !isUnderAttack(7, 6, 'black', cells)) {
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
    // Trova il colore opposto
    const defendingColor = attackingColor === "white" ? "black" : "white";
    // Per ogni cella sulla scacchiera
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // Se la cella contiene un pezzo del colore opposto
            const piece = cells1[i][j];
            
            if(piece==='' || (i===row && j === col)){continue;}
            if ((piece.toLowerCase() === piece && defendingColor === "white") || (piece.toUpperCase() === piece && defendingColor === "black")) {
                // Verifica se il pezzo può muoversi sulla posizione specificata
                if (isValidMove(i, j, row, col, cells1)) {
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
    if (!isUnderAttack(kingRow, kingCol, attackingColor, cells)) {
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
                //console.log("arrivo celle", cells);
                if (isValidMove(kingRow, kingCol, newRow, newCol, cells)) {
                    //console.log("strano", cells);
                    const cell2 = cells.map(row => [...row]);
                    cell2[newRow][newCol] = kingColor === "white" ? "K" : "k";
                    cell2[kingRow][kingCol] = '';
                    if(!isUnderAttack(newRow, newCol, attackingColor, cell2)){
                        // Se una mossa è possibile e il re non è più sotto scacco, non c'è scacco matto
                        return false;
                    }
                    
                }
            }
        }
        
        if (caninterfer(kingRow, kingCol, kingColor, cells)) {
            return false;
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
                                return true;
                            }
                        }
                    }
                }
            }
        }
    } 
    return false;

}

// Funzione per calcolare il punteggio di una mossa
export const calculateScore = (cells: any[]) => {
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

    const knightPositionScores = [
      [-5, 0, -3, -3, -3, -3, 0, -5],
      [-4, -2,  0,  0,  0,  0, -2, -4],
      [-3,  0,  1,  1.5,  1.5,  1,  0, -3],
      [-3,  0.5,  1.5, 2, 2,  1.5, 0.5, -3],
      [-3,  0,  1.5, 2, 2,  1.5, 0, -3],
      [-3,  0.5,  1,  1.5,  1.5,  1,  0.5, -3],
      [-4, -2,  0,  0.5,  0.5,  0, -2, -4],
      [-5, 0, -3, -3, -3, -3, 0, -5]
    ];
    
    const bishopPositionScores = [
        [-2, -1, -1, -1, -1, -1, -1, -2],
        [-1,  0,  0,  0,  0,  0,  0, -1],
        [-1,  0,  0.5,  1,  1,  0.5,  0, -1],
        [-1,  0.5,  0.5,  1,  1,  0.5,  0.5, -1],
        [-1,  0,  1,  1,  1,  1,  0, -1],
        [-1,  1,  1,  1,  1,  1,  1, -1],
        [-1,  0.5,  0,  0,  0,  0,  0.5, -1],
        [-2, -1, -1, -1, -1, -1, -1, -2]
      ];
      
    const bishopPairBonus = 0.5; 
    let myBishopCount = 0; // Count of my bishops
    let opponentBishopCount = 0; // Count of opponent's bishops
    let myScore = 0;
    let opponentScore = 0;
  
    // Calcola il punteggio totale dei pezzi sulla scacchiera
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = cells[i][j];
        if (piece !== '') {
          // Se il pezzo è nero, aggiungi il suo valore al punteggio dell'avversario
          if (piece === piece.toLowerCase()) {
            myScore += pieceValues[piece.toLowerCase()]; // Utilizza lettere maiuscole per il pezzo avversario
            // Se il pezzo è un pedone nero, aggiungi anche il punteggio posizionale
            if (piece === 'p') {
              myScore += pawnPositionScores[i][j];
            }
            else if (piece === 'n') {
              myScore += knightPositionScores[i][j];
            } else if (piece === 'b') {
                myScore += bishopPositionScores[i][j];
                myBishopCount++;
              }
          } else { // Se il pezzo non è nero, aggiungi il suo valore al tuo punteggio
            opponentScore += pieceValues[piece.toLowerCase()];
            // Se il pezzo è un pedone bianco, aggiungi anche il punteggio posizionale
            if (piece === 'P') {
              opponentScore += pawnPositionScores[7-i][j]; // Inverto la riga
            }
            else if (piece === 'N') {
              opponentScore += knightPositionScores[i][j]; // Inverto la riga
            }
            else if (piece === 'B') {
                opponentScore += bishopPositionScores[7 - i][j];
                opponentBishopCount++;
              }
          }
        }
      }
    }
    // Controlla se il giocatore ha la coppia di alfieri
    if (myBishopCount === 2) {
        myScore += bishopPairBonus;
    }
    if (opponentBishopCount === 2) {
        opponentScore += bishopPairBonus;
    }
    // Restituisci la differenza tra il tuo punteggio e quello dell'avversario
    return myScore - opponentScore;
  };



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