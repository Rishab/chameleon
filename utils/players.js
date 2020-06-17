const players = [];

// Create new player when someone creates or joins a lobby
function createPlayer(id, playername) {
  const player = { id, playername };
  players.push(player);
  return player;
}

// function playerJoin(id, playername, lobbyName) {
//   const player = { id, playername, lobbyName };
//   players.push(player);
//   return player;
// }

// // Get current player
// function getCurrentplayer(id) {
//   return players.find((player) => player.id === id);
// }

// function playerLeave(id) {
//   const index = players.findIndex((player) => player.id === id);
//   if (index !== -1) {
//     return players.splice(index, 1)[0];
//   }
// }

// function getPlayers(lobbyName) {
//   return players.filter((players) => players.lobbyName === lobbyName);
// }

// function getPlayerCount(lobbyName) {
//   return players.filter((players) => players.lobbyName === lobbyName).length;
// }

module.exports = {
  createPlayer,
  // getCurrentplayer,
  // playerLeave,
  // getPlayers,
  // getPlayerCount,
};
