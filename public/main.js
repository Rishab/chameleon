// const socket = io();
var lobbyName = "";
// var category = "";
var roundNumber = 1;
const startButton = document.getElementById("start-btn");
const randomButton = document.getElementById("random-btn");

function createTable() {
  var table = document.getElementById("words");
  for (var i = 0; i < 16; ) {
    let newRow = table.insertRow(-1);
    for (var j = 0; j < 4; j++) {
      let newCell = newRow.insertCell(-1);
      let newText = document.createTextNode("");
      newCell.id = "cell" + (i + j);
      newCell.appendChild(newText);
    }
    i += 4;
  }
}

function populateCategories() {
  var options = Object.keys(categories);
  for (var i = 0; i < options.length; i++) {
    const category = options[i];
    var ele = document.createElement("a");
    ele.classList = "dropdown-item";
    ele.innerText = category;
    ele.nodeValue = category;
    ele.id = category;
    lobby = this.lobbyName;
    // ele.addEventListener("click", changeCategory(options[i], lobby));
    // lobby = this.lobbyName;
    ele.addEventListener("click", (e) => {
      e.preventDefault();
      return socket.emit("category", category, lobbyName);
    });
    document.querySelector(".dropdown-menu").appendChild(ele);
  }
}

socket.on("category", (category) => {
  var data = categories[category];
  document.getElementById("category").innerHTML = category;
  for (var i = 0; i < data.length; i++) {
    document.getElementById("cell" + i).innerHTML = data[i];
  }
});

randomButton.addEventListener("click", (e) => {
  e.preventDefault();
  categoryNames = Object.keys(categories);
  var rand = Math.floor(Math.random() * categoryNames.length);
  const category = categoryNames[rand];
  socket.emit("category", category, this.lobbyName);
});

socket.on("start", (category, word) => {
  console.log("round started");
  document.getElementById("secretWord").innerHTML =
    " " + categories[category][word];
  startButton.disabled = true;
  randomButton.disabled = true;
});

startButton.addEventListener("click", (e) => {
  if (this.category != "") {
    e.preventDefault();
    const word = Math.floor(Math.random() * 16);
    socket.emit("start", word, lobbyName);
  } else {
    window.confirm("Category not selected.");
  }
});

socket.on("complete", ({ players, currentPlayer, roundNumber }) => {
  document.getElementById("secretWordTitle").innerHTML = "Secret Word:";
  document.getElementById("secretWord").innerHTML = " ";
  for (var i = 0; i < 16; i++) {
    document.getElementById("cell" + i).innerHTML = "";
  }
  document.getElementById("roundNumber").innerHTML = "" + roundNumber;
  document.getElementById("category").innerHTML = "Category";
  outputPlayersList(players, currentPlayer);
  // for (var i = 0; i < players.length; i++) {
  //   document.getElementById("pointer" + i).innerHTML = "";
  // }

  // console.log("currentPlayer:" + currentPlayerIndex);
  // document.getElementById(
  //   "pointer" + currentPlayerIndex
  // ).innerHTML = `<i class="fas fa-hand-point-right"></i>`;
  startButton.disabled = false;
  randomButton.disabled = false;
});

const completeButton = document.getElementById("complete-btn");
completeButton.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("complete", lobbyName);
});

socket.on("message", (message) => {
  console.log(message);
});

socket.on("disconnect", (players) => {
  for (var i = 0; i < players.length; i++) {
    document.getElementById("pointer" + i).innerHTML = "";
  }
});

socket.on("chameleon", () => {
  document.getElementById("secretWordTitle").innerHTML =
    "You are the chameleon";
  startButton.disabled = true;
  randomButton.disabled = true;
});

socket.on("players", ({ players, currentPlayer, tooManyPlayers }) => {
  console.log(tooManyPlayers);
  document.getElementById("playerCountNote").innerHTML = tooManyPlayers;
  outputPlayersList(players, currentPlayer);
});

function outputLobbyName(lobby) {
  console.log("setting lobbyname");
  document.getElementById("LobbyID").innerHTML = lobby;
}

function outputPlayersList(players, currentPlayer) {
  console.log(currentPlayer);
  var table = document.getElementById("playerList");
  table.innerHTML = "";
  for (var i = 0; i < players.length; i++) {
    let newRow = table.insertRow(-1);
    let pointerIcon = newRow.insertCell(-1);
    pointerIcon.id = "pointer" + i;
    if (currentPlayer == players[i].ID) {
      pointerIcon.innerHTML = `<i class="fas fa-hand-point-right"></i>`;
    }
    let player = newRow.insertCell(-1);
    player.innerHTML = players[i].name;
    if (i == 0) {
      let crown = newRow.insertCell(-1);
      crown.innerHTML = `<i class="fas fa-crown"></i>`;
    }
  }
}

socket.on("needMorePlayers", (numPlayers) => {
  let description =
    "" + `Need ${3 - numPlayers} more players to start the game.`;
  var modal = $("#needMorePlayersModal");
  modal.modal("show");
  document.getElementById("needMorePlayersModalText").innerHTML = description;
});

function load() {
  document.getElementById("wrapper").style.display = "block";
  lobbyName = getCookie("lobbyName");
  outputLobbyName(lobbyName);
  createTable();
  populateCategories();
}
