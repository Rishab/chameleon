lobbies = {};

function lobbyExists(lobbyName) {
  return lobbyName in lobbies;
}

function getLobby(lobbyName) {
  console.log(Object.keys(lobbies));
  return lobbies[lobbyName];
}

function getLobbies() {
  return lobbies;
}

function createLobby(lobbyName, player) {
  let lobbyDetails = {
    players: [],
    numPlayers: 1,
    lobbyLeader: player.ID,
    currentPlayer: player.ID,
    nextPlayer: null,
    chameleon: null,
    category: null,
  };
  lobbyDetails.players.push(player);
  lobbies[lobbyName] = lobbyDetails;
  return lobbyDetails;
}

function joinLobby(lobbyName, player) {
  // Add player to players list
  lobbies[lobbyName].lobbyDetails.players.push(player);
  //Update the number of players in the lobby
  lobbies[lobbyName].numPlayers++;
  return lobbies[lobbyName];
}

module.exports = {
  lobbyExists,
  getLobby,
  getLobbies,
  createLobby,
  joinLobby,
};
