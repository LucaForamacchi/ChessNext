'use server';
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'scacchi'
});

function inserisciPartita(vincitore, mosse, data) {
  return new Promise((resolve, reject) => {
    if (connection) {
      const query = `INSERT INTO partite (vincitore, mosse, data) VALUES ('${vincitore}', '${mosse}', '${data}')`;
      connection.query(query, (error, results, fields) => {
        if (error) {
          console.error('Errore durante l\'inserimento della partita:', error);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } else {
      const error = new Error('Connessione al database non stabilita.');
      console.error(error);
      reject(error);
    }
  });
}
module.exports = inserisciPartita;

function getCurrentData() {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear().toString();
  return `${day}-${month}-${year}`;
}
module.exports = getCurrentData;

const io = require("socket.io")(3000, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// Oggetto per memorizzare le lobby e i giocatori all'interno di ciascuna lobby, insieme alla scacchiera associata
const lobbies = {};

io.on("connection", (socket) => {
  console.log("A user connected.");

  // Funzione per creare una nuova lobby
  const createNewLobby = () => {
    const newLobby = "lobby_" + Math.random().toString(36).substr(2, 9);
    lobbies[newLobby] = {
      players: [socket.id],
      board: [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        Array(8).fill(''),
        Array(8).fill(''),
        Array(8).fill(''),
        Array(8).fill(''),
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
      ],
      moves: [],
      full: false,
      // Inizializza il turno corrente quando la lobby viene creata
      currentTurn: socket.id,
    };
    socket.join(newLobby);
    socket.lobby = newLobby;
    console.log(`Player ${socket.id} created and joined new lobby ${newLobby}`);
    // Invia il messaggio "lobby_joined" al client
    socket.emit("lobby_joined", newLobby, [socket.id]);
  };

  // Se non ci sono lobby disponibili, crea una nuova lobby per il primo client che si connette
  if (Object.keys(lobbies).length === 0) {
    createNewLobby();
  } else {
    // Altrimenti, il primo client si unisce automaticamente alla prima lobby disponibile
    let joinedLobby = false;
    for (lobby in lobbies) {
      if (lobbies[lobby].players.length === 1 && !lobbies[lobby].players.full) {
        lobbies[lobby].players.full = true;
        lobbies[lobby].players.push(socket.id);
        // Inizializza il turno corrente quando il secondo giocatore si unisce alla lobby
        lobbies[lobby].currentTurn = lobbies[lobby].players[0];
        socket.join(lobby);
        socket.lobby = lobby;
        joinedLobby = true;
        console.log(`Player ${socket.id} joined lobby ${lobby}`);
        // Invia il messaggio "lobby_joined" al client
        socket.emit("lobby_joined", lobby, lobbies[lobby].players);
        break;
      }
    }
    // Se non è stato possibile unirsi ad alcuna lobby esistente, crea una nuova lobby
    if (!joinedLobby) {
      createNewLobby();
    }
  }

  socket.on("bot", () => {
    // Aggiungi un bot alla lobby corrente
    if (socket.lobby && lobbies[socket.lobby]) {
      if (lobbies[socket.lobby].players.length < 2 && !lobbies[socket.lobby].players.full) {
        lobbies[socket.lobby].players.push("bot");
        console.log(`Bot joined lobby ${socket.lobby}`);
        socket.lobby.full = true;
      } else {
        console.log(`Cannot add bot to full lobby ${socket.lobby}`);
      }
    } else {
      console.log(`Cannot add bot, no lobby found for socket ${socket.id}`);
    }
  });
  
  socket.on("message", (message) => {
    io.to(socket.lobby).emit("message", message);
  });

  socket.on("update_board", (newBoard, move) => {
    lobbies[socket.lobby].board = newBoard;
    lobbies[socket.lobby].moves.push(move);
    // Passa il turno al giocatore successivo dopo ogni mossa
    lobbies[socket.lobby].currentTurn = lobbies[socket.lobby].players.find(player => player !== socket.id);
    io.to(socket.lobby).emit("update_board", newBoard, lobbies[socket.lobby].currentTurn, lobbies[socket.lobby].moves);
    io.to(socket.lobby).emit("isCheckMate", newBoard);
  });

  socket.on("checkmate", () =>{
    io.to(socket.lobby).emit("isCheckMate");
  });

  socket.on("end-game", async (win_color) =>{
    io.to(socket.lobby).emit("result", win_color);
    const movesSenzaFreccia = lobbies[socket.lobby].moves.map(move => move.replace(" =>", ""));
    const stringMoves = movesSenzaFreccia.join(" ");
    const db = await inserisciPartita(win_color, stringMoves, getCurrentData());
    if (db) {
      console.log('Partita inserita nel database');
    }
  });

  socket.on("new_move", (move) =>{
    io.to(socket.lobby).emit("new_move", move);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected.");

    if (socket.lobby && lobbies[socket.lobby]) {
      const index = lobbies[socket.lobby].players.indexOf(socket.id);
      if (index !== -1) {
        lobbies[socket.lobby].players.splice(index, 1);
        if (lobbies[socket.lobby].players.length === 0) {
          delete lobbies[socket.lobby];
          console.log(`Empty lobby ${socket.lobby} removed`);
        }
      }
    }
  });
});

console.log("server started")