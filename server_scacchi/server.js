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
      // Inizializza il turno corrente quando la lobby viene creata
      currentTurn: socket.id
    };
    socket.join(newLobby);
    socket.lobby = newLobby;
    console.log(`Player ${socket.id} created and joined new lobby ${newLobby}`);
    // Invia il messaggio "lobby_joined" al client
    socket.emit("lobby_joined", newLobby);
  };

  // Se non ci sono lobby disponibili, crea una nuova lobby per il primo client che si connette
  if (Object.keys(lobbies).length === 0) {
    createNewLobby();
  } else {
    // Altrimenti, il primo client si unisce automaticamente alla prima lobby disponibile
    let joinedLobby = false;
    for (const lobby in lobbies) {
      if (lobbies[lobby].players.length === 1) {
        lobbies[lobby].players.push(socket.id);
        // Inizializza il turno corrente quando il secondo giocatore si unisce alla lobby
        lobbies[lobby].currentTurn = lobbies[lobby].players[0];
        socket.join(lobby);
        socket.lobby = lobby;
        joinedLobby = true;
        console.log(`Player ${socket.id} joined lobby ${lobby}`);
        // Invia il messaggio "lobby_joined" al client
        socket.emit("lobby_joined", lobby);
        break;
      }
    }

    // Se non è stato possibile unirsi ad alcuna lobby esistente, crea una nuova lobby
    if (!joinedLobby) {
      createNewLobby();
    }
  }

  socket.on("message", (message) => {
    io.to(socket.lobby).emit("message", message);
  });

  socket.on("update_board", (newBoard) => {
    lobbies[socket.lobby].board = newBoard;
    // Passa il turno al giocatore successivo dopo ogni mossa
    lobbies[socket.lobby].currentTurn = lobbies[socket.lobby].players.find(player => player !== socket.id);
    io.to(socket.lobby).emit("update_board", newBoard);
    
  });
  
  socket.on("turn", () =>{
    io.to(socket.lobby).emit("current_turn", lobbies[socket.lobby].currentTurn);
  });

  socket.on("checkmate", () =>{
    io.to(socket.lobby).emit("isCheckMate");
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