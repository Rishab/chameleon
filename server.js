const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { getLobbies, createLobby } = require("./utils/lobby");
const {
  createPlayer
} = require("./utils/players");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Run when client connects
io.on("connection", (socket) => {
  console.log("A new player has connected");
  
  // Player is creating or joining a lobby
  socket.on("joinLobby", ({ username, lobbyName }) => {
      // Create a new player
      const player = 
    if (!lobbyExists) {
      const lobby = createLobby(lobbyName, user.id);
    }
    // create a user
    const user = userJoin(socket.id, username, lobbyName);
    console.log(getLobbies());
    console.log(user);
    // join the lobby
    socket.join(user.lobbyName);

    socket.emit("message", "Test join");
    //single client
    console.log("joined lobby");
    //Broadcast when a user connects
    socket.broadcast
      .to(user.lobbyName)
      .emit("message", `${user.username} has joined the game`);

    // Send users and room info
    io.to(user.lobbyName).emit("players", {
      lobby: user.lobbyName,
      users: getPlayers(user.lobbyName),
      currentPlayer: getCurrentPlayer(),
    });
  });

  socket.on("category", (category) => {
    const user = getCurrentUser(socket.id);

    io.to(user.lobbyName).emit("category", category);
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
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.lobbyName).emit(
        "message",
        `${user.username} has left the game`
      );
      io.to(user.lobbyName).emit("players", {
        lobby: user.lobbyName,
        users: getPlayers(user.lobbyName),
        currentPlayer: getCurrentPlayer(),
      });
    }
    // io.emit("message", "A user has left the chat");
  });
  //broadcast to everyone
  //io.emit()
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
