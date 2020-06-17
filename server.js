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
} = require("./utils/lobby");
const { createPlayer } = require("./utils/players");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connection is established
io.on("connection", (socket) => {
  console.log("A new player has connected");

  // Player is creating or joining a lobby
  socket.on("joinLobby", ({ username, lobbyName }) => {
    // Create a new player
    const player = createPlayer(socket.id, username);
    // Check to see if a new lobby should be created
    let lobby;
    if (!lobbyExists(lobbyName)) {
      lobby = createLobby(lobbyName, player);
    }
    // Lobby already exists, connect the player
    else {
      lobby = joinLobby(lobbyName, player);
    }
    console.log(lobby);
    console.log(player);

    // Join the lobby
    socket.join(lobbyName);

    // Broadcast when a player connects
    socket.broadcast
      .to(lobbyName)
      .emit("message", `${player.playerName} has joined the game`);

    // Send players and room info
    io.to(lobbyName).emit("players", {
      players: lobby.players,
      currentPlayer: lobby.currentPlayer,
    });
  });

  socket.on("category", (category, lobbyName) => {
    console.log(getLobbies());
    const lobby = getLobby(lobbyName);
    console.log(lobby);
    lobby.category = category;
    console.log(socket.id);
    console.log(category);
    if (socket.id + "" == lobby.lobbyLeader.ID) {
      io.to(lobbyName).emit("category", category);
    }
  });

  socket.on("start", (word) => {
    const user = getCurrentUser(socket.id);
    io.to(user.lobbyName).emit("start", word);
  });

  socket.on("complete", () => {
    const user = getCurrentUser(socket.id);

    io.to(user.lobbyName).emit("complete", {
      lobby: user.lobbyName,
      users: getPlayers(user.lobbyName),
      currentPlayer: updateCurrentPlayer(false),
    });
  });

  //Runs when client disconnects
  socket.on("disconnect", () => {
    // const user = userLeave(socket.id);
    // if (user) {
    //   io.to(user.lobbyName).emit(
    //     "message",
    //     `${user.username} has left the game`
    //   );
    //   io.to(user.lobbyName).emit("players", {
    //     lobby: user.lobbyName,
    //     users: getPlayers(user.lobbyName),
    //     currentPlayer: getCurrentPlayer(),
    //   });
    // }
    // io.emit("message", "A user has left the chat");
  });
  //broadcast to everyone
  //io.emit()
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
