const socket = io();
var category = "";
var players = [];
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
  console.log(options);
  for (var i = 0; i < options.length; i++) {
    var ele = document.createElement("a");
    ele.classList = "dropdown-item";
    ele.innerText = options[i];
    ele.nodeValue = options[i];
    ele.id = options[i];
    ele.addEventListener("click", changeCategory(options[i]));
    document.querySelector(".dropdown-menu").appendChild(ele);
  }
}

socket.on("category", (category) => {
  console.log(category);
  var data = categories[category];
  document.getElementById("category").innerHTML = category;
  for (var i = 0; i < data.length; i++) {
    document.getElementById("cell" + i).innerHTML = data[i];
  }
  this.category = category;
});

randomButton.addEventListener("click", (e) => {
  if (this.category != "") {
    return;
  }
  e.preventDefault();
  categoryNames = Object.keys(categories);
  var rand = Math.floor(Math.random() * categoryNames.length);
  const category = categoryNames[rand];
  socket.emit("category", category);
});

socket.on("start", (word) => {
  document.getElementById("secretWord").innerHTML =
    " " + categories[this.category][word];
  startButton.disabled = true;
  randomButton.disabled = true;
});

startButton.addEventListener("click", (e) => {
  if (this.category != "") {
    e.preventDefault();
    var word = Math.floor(Math.random() * 16);
    socket.emit("start", word);
  } else {
    window.confirm("Category not selected.");
  }
});

socket.on("complete", ({ lobby, users, currentPlayer }) => {
  document.getElementById("secretWord").innerHTML = " ";
  for (var i = 0; i < 16; i++) {
    document.getElementById("cell" + i).innerHTML = "";
  }
  roundNumber++;
  document.getElementById("roundNumber").innerHTML = "" + roundNumber;
  document.getElementById("category").innerHTML = "Category";
  this.category = "";
  currentPlayer--;
  document.getElementById("pointer" + currentPlayer).innerHTML = ``;
  currentPlayer++;
  document.getElementById(
    "pointer" + currentPlayer
  ).innerHTML = `<i class="fas fa-hand-point-right"></i>`;
  startButton.disabled = false;
  randomButton.disabled = false;
});

const completeButton = document.getElementById("complete-btn");
completeButton.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("complete");
});

function changeCategory(id) {
  return function () {
    if (this.category == "") {
      socket.emit("category", id);
    }
  };
}

socket.on("message", (message) => {
  console.log(message);
});

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function handleConnection() {
  username = getCookie("username");
  lobbyName = getCookie("lobbyName");
  socket.emit("joinLobby", { username, lobbyName });
}

socket.on("players", ({ lobby, users, currentPlayer }) => {
  console.log(currentPlayer);
  outputLobbyName(lobby);
  outputPlayersList(users, currentPlayer);
});

function outputLobbyName(lobby) {
  console.log(lobby);
  document.getElementById("LobbyID").innerHTML = lobby;
}

function outputPlayersList(users, currentPlayer) {
  console.log(users);
  var table = document.getElementById("playerList");
  table.innerHTML = "";
  for (var i = 0; i < users.length; i++) {
    let newRow = table.insertRow(-1);
    let pointerIcon = newRow.insertCell(-1);
    pointerIcon.id = "pointer" + i;
    if (currentPlayer == i) {
      pointerIcon.innerHTML = `<i class="fas fa-hand-point-right"></i>`;
    }
    let player = newRow.insertCell(-1);
    player.innerHTML = users[i]["username"];
    if (i == 0) {
      let crown = newRow.insertCell(-1);
      crown.innerHTML = `<i class="fas fa-crown"></i>`;
    }
  }
}

function load() {
  handleConnection();
  createTable();
  populateCategories();
}
