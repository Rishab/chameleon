lobbies = [];

function getLobbies() {
  return lobbies;
}

function createLobby(lobbyName, lobbyLeader) {
  let lobbyDetails = {
    players: [],
    numPlayers: 1,
    lobbyLeader: lobbyLeader,
    currentPlayer: lobbyLeader,
    nextPlayer: null,
    chameleon: null,
  };

  lobbies.push({ [lobbyName]: lobbyDetails });
}

module.exports = {
  getLobbies,
  createLobby,
};
