const socket = io();

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
  console.log(username);
  console.log(lobbyName);
  setCookie("username", username, 1);
  setCookie("lobbyName", lobbyName, 1);
}

function joinGame(form) {
  let username = form.joinUsername.value;
  let lobbyName = form.joinedLobby.value;
  console.log(username);
  console.log(lobbyName);
  setCookie("username", username, 1);
  setCookie("lobbyName", lobbyName, 1);
}

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
