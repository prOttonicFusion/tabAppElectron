const { ipcRenderer } = require("electron");

document.getElementById("cancel-user-button").addEventListener("click", () => {
  ipcRenderer.send("cancel-add-user");
});

document.getElementById("accept-user-button").addEventListener("click", () => {
  let user = document.getElementById("name-input").value;
  let initialBalance =
    Number(document.getElementById("initial-balance-input").value) || 0;
  if (user != "") {
    ipcRenderer.send("accept-add-user", [{ user, initialBalance }]);
  }
});
