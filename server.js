const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
  lobbyExists,
  getLobby,
  getLobbies,
  createLobby,
  joinLobby,
  leaveLobby,
  updateCurrentPlayer,
  updateGameDetails,
  checkPlayerCount,
} = require("./utils/lobby");
const { createPlayer, getLobbyName } = require("./utils/players");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  pingInterval: 300000,
  pingTimeout: 600000,
});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connection is established
io.on("connection", (socket) => {
  console.log("A new player has connected");

  // Player is creating or joining a lobby
  socket.on("joinLobby", ({ username, lobbyName }) => {
    // Create a new player
    const player = createPlayer(socket.id, username, lobbyName);
    // // Check to see if a new lobby should be created
    // let lobby;
    // if (!lobbyExists(lobbyName)) {
    //   lobby = createLobby(lobbyName, player);
    // }
    // // Lobby already exists, connect the player
    // else {
    let lobby = joinLobby(lobbyName, player);
    // }
    // console.log(lobby);
    console.log(player);

    // Join the lobby
    socket.join(lobbyName);

    socket.lobbyID = lobbyName;

    // Broadcast when a player connects
    socket.broadcast
      .to(lobbyName)
      .emit("message", `${player.playerName} has joined the game`);

    let tooManyPlayers = checkPlayerCount(lobby);
    // Send players and room info
    io.to(lobbyName).emit("players", {
      players: lobby.players,
      currentPlayer: lobby.currentPlayer,
      tooManyPlayers,
    });
  });

  socket.on("createLobby", ({ username, lobbyName }) => {
    console.log("creating game");
    // const player = createPlayer(socket.id, username, lobbyName);
    let lobby = createLobby(lobbyName);
    socket.broadcast
      .to(lobbyName)
      .emit("message", `${username} has created the game`);

    let tooManyPlayers = checkPlayerCount(lobby);
    // Send players and room info
    io.to(lobbyName).emit("players", {
      players: lobby.players,
      currentPlayer: lobby.currentPlayer,
      tooManyPlayers,
    });
  });

  socket.on("checkGame", (lobbyName) => {
    console.log(socket.id);
    console.log("Checking Game: " + lobbyName);
    console.log("Does it exist? " + lobbyExists(lobbyName));
    io.to(socket.id).emit("checkGameResult", lobbyExists(lobbyName));
  });

  // Category selected or randomize button selected by a player
  socket.on("category", (category, lobbyName) => {
    // Change the category if lobbyLeader made request and round is not in-progress
    const lobby = getLobby(lobbyName);
    if (socket.id + "" == lobby.lobbyLeader && !lobby.inProgress) {
      lobby.category = category;
      io.to(lobbyName).emit("category", category);
    }
  });

  // Start the round: lock the word, category, and chameleon
  socket.on("start", (word, lobbyName) => {
    const lobby = getLobby(lobbyName);
    if (
      socket.id + "" == lobby.lobbyLeader &&
      !lobby.inProgress &&
      lobby.category != ""
    ) {
      if (lobby.numPlayers < 3) {
        let numPlayers = lobby.numPlayers;
        io.to(lobbyName).emit("needMorePlayers", numPlayers);
      } else {
        var chameleon =
          lobby.players[Math.floor(Math.random() * lobby.players.length)].ID;
        sendWord = lobby.players.filter((players) => players.ID != chameleon);
        // console.log(sendWord);
        sendWord.forEach((player) => {
          io.to(player.ID).emit("start", lobby.category, word);
        });
        io.to(chameleon).emit("chameleon");
        lobby.word = word;
        lobby.chameleon = chameleon;
        lobby.inProgress = true;
      }
    }
  });
  // Round complete -> update game details
  socket.on("complete", (lobbyName) => {
    const lobby = getLobby(lobbyName);
    if (
      socket.id + "" == lobby.lobbyLeader &&
      lobby.inProgress &&
      lobby.category != ""
    ) {
      updateCurrentPlayer(lobbyName);
      updateGameDetails(lobbyName);

      io.to(lobbyName).emit("complete", {
        players: lobby.players,
        currentPlayer: lobby.currentPlayer,
        roundNumber: lobby.roundNumber,
      });
    }
  });

  //Runs when client disconnects
  socket.on("disconnect", () => {
    console.log("player disconnecting");
    const player = socket.id;
    let lobbyName = getLobbyName(player);
    // console.log("lobbyName: " + lobbyName);
    if (lobbyName != null) {
      let playerCount = leaveLobby(lobbyName, player);
      if (playerCount != 0) {
        const lobby = getLobby(lobbyName);
        let tooManyPlayers = checkPlayerCount(lobby);
        io.to(lobbyName).emit("players", {
          players: lobby.players,
          currentPlayer: lobby.currentPlayer,
          tooManyPlayers,
        });
      }
    }
    // console.log(player);
  });
  //broadcast to everyone
  //io.emit()
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
