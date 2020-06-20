const players = {};

// Create new player when someone creates or joins a lobby
function createPlayer(ID, name, lobbyName) {
  console.log("Player created");
  console.log(lobbyName);
  let playerDetails = {
    name: name,
    lobbyName: lobbyName,
  };
  console.log(playerDetails);
  players[ID] = playerDetails;
  let player = { ID: ID, name: name };
  console.log(player);
  return player;
}

function getLobbyName(ID) {
  if (players[ID] != null) {
    return players[ID].lobbyName;
  }
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
  getLobbyName,
  // getCurrentplayer,
  // playerLeave,
  // getPlayers,
  // getPlayerCount,
};
