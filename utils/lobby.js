lobbies = {};

function lobbyExists(lobbyName) {
  return lobbyName in lobbies;
}

function getLobby(lobbyName) {
  return lobbies[lobbyName];
}

function getLobbies() {
  return lobbies;
}

function createLobby(lobbyName) {
  let lobbyDetails = {
    players: [],
    numPlayers: 1,
    lobbyLeader: "",
    currentPlayer: "",
    nextPlayer: "",
    chameleon: "",
    category: "",
    word: "",
    roundNumber: 1,
    inProgress: false,
  };
  lobbies[lobbyName] = lobbyDetails;
  return lobbyDetails;
}

function joinLobby(lobbyName, player) {
  let lobby = lobbies[lobbyName];
  //Make player next player if nextPlayer not initialized yet
  if (lobby.nextPlayer == "" && lobby.currentPlayer != "") {
    lobby.nextPlayer = player.ID;
  }
  lobby.currentPlayer = player.ID;
  // Add player to players list
  console.log(lobbyName);
  lobby.players.push(player);
  //update the next player in case its the new player added
  if (lobby.nextPlayer != "") {
    let currentPlayerIndex = getCurrentPlayerIndex(lobbyName);
    if (lobby.players[currentPlayerIndex + 1].ID != lobby.nextPlayer) {
      lobby.nextPlayer = lobby.players[currentPlayerIndex + 1].ID;
    }
  }
  //Update the number of players in the lobby
  lobbies[lobbyName].numPlayers++;
  return lobbies[lobbyName];
}

function leaveLobby(lobbyName, player) {
  let lobby = lobbies[lobbyName];
  lobby.numPlayers--;
  if (lobby.numPlayers == 0) {
    delete lobbies[lobbyName];
    return 0;
  }
  console.log(lobby.players);
  console.log(lobby.lobbyLeader);
  const index = lobby.players.findIndex((p) => p.ID === player);
  if (index !== -1) {
    if (player == lobby.nextPlayer) {
      updateNextPlayer(lobbyName, index);
    } else if (player == lobby.currentPlayer) {
      lobby.currentPlayer = "";
      if (!lobby.inProgress) {
        updateCurrentPlayer(lobbyName);
      }
    }
    lobby.players.splice(index, 1);
    if (lobby.lobbyLeader == player) {
      lobby.lobbyLeader = lobby.players[0].ID;
    }
    console.log(lobby.lobbyLeader);
  }
  return lobby.numPlayers;
}

function updateCurrentPlayer(lobbyName) {
  let lobby = lobbies[lobbyName];
  let players = lobby.players;

  // find the index of the next player in the array
  console.log(lobby.nextPlayer);
  let index = players.findIndex((player) => player.ID === lobby.nextPlayer);

  //update the current player to the next player in the list
  console.log(index);
  lobby.currentPlayer = players[index].ID;
  updateNextPlayer(lobbyName, index);
}

function updateNextPlayer(lobbyName, index) {
  //update the next player for the next round
  let lobby = lobbies[lobbyName];
  let players = lobby.players;
  if (index + 1 == players.length) {
    index = 0;
  } else {
    index++;
  }
  lobby.nextPlayer = players[index].ID;
}

function updateGameDetails(lobbyName) {
  let lobby = lobbies[lobbyName];

  lobby.roundNumber++;
  lobby.chameleon = "";
  lobby.category = "";
  lobby.word = "";
  lobby.inProgress = false;
}

function getCurrentPlayerIndex(lobbyName) {
  const lobby = lobbies[lobbyName];
  const players = lobby.players;
  const index = players.findIndex(
    (player) => player.ID === lobby.currentPlayer
  );
  return index;
}

function getNextPlayerIndex(lobbyName) {
  const lobby = lobbies[lobbyName];
  const players = lobby.players;
  const index = players.findIndex((player) => player.ID === lobby.nextPlayer);
  return index;
}

function checkPlayerCount(lobby) {
  if (lobby.numPlayers > 8) {
    return "Note: Playing with more than 8 players is not recommended.";
  }
  return "";
}

module.exports = {
  lobbyExists,
  getLobby,
  getLobbies,
  createLobby,
  joinLobby,
  leaveLobby,
  updateCurrentPlayer,
  updateNextPlayer,
  updateGameDetails,
  getCurrentPlayerIndex,
  getNextPlayerIndex,
  checkPlayerCount,
};
