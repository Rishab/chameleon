const socket = io();
var joinForm = document.getElementById("join-form");

function details(username, lobbyName) {
  return { username, lobbyName };
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function createGame(form) {
  let username = form.username.value;
  let lobbyName = form.lobbyName.value;
  socket.emit("createLobby", { username, lobbyName });
  console.log(username);
  console.log(lobbyName);
  setCookie("username", username, 1);
  setCookie("lobbyName", lobbyName, 1);
}

function joinGame() {
  console.log(socket.id);
  let lobbyName = joinForm.joinedLobby.value.toUpperCase();
  console.log("Joining Game: " + lobbyName);
  socket.emit("checkGame", lobbyName);
  return false;
}

socket.on("checkGameResult", (result) => {
  console.log("Result of checking game " + result);
  if (!result) {
    window.location.replace("");
  } else {
    let username = joinForm.joinUsername.value;
    let lobbyName = joinForm.joinedLobby.value.toUpperCase();
    setCookie("username", username, 1);
    setCookie("lobbyName", lobbyName, 1);
    window.location.replace("chameleon.html");
  }
});

function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function load() {
  var rString = randomString(4, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  console.log(rString);
  document.getElementById("lobbyName").value = rString;
}

// Listen to submit event on the <form> itself!
$("#join-form").submit(function (e) {
  e.preventDefault();
  console.log("prevented");
  let lobbyName = joinForm.joinedLobby.value.toUpperCase();
  socket.emit("checkGame", lobbyName);
  return false;
});
