// import { ipcRenderer } from "electron";
const { ipcRenderer } = require('electron');

document.getElementById("add-user-button").addEventListener("click", () => {
  ipcRenderer.send("add-user");
});

document.getElementById("accept-button").addEventListener("click", () => {
    ipcRenderer.send("accept-transaction");
  });