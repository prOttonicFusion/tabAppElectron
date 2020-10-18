import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import DataBaseAccess from "./data-access";
import TabDB from "./tab-database";
import TabService from "./tab-service";

let mainWindow: BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Connect to database
const dataAccess = new DataBaseAccess(
  `${app.getPath("userData")}/database.sqlite3`
);
const tabDB = new TabDB(dataAccess);
tabDB.init();
const tabService = new TabService(tabDB);

// Add event managers
let addUserWindow: BrowserWindow;

ipcMain.on("add-user", () => {
  console.log("Pressed: add user");

  if (!addUserWindow) {
    addUserWindow = new BrowserWindow({
      width: 400,
      height: 400,
      // close with the main window
      parent: mainWindow,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    addUserWindow.loadFile(path.join(__dirname, "../add-user.html"));

    // cleanup
    addUserWindow.on("closed", () => {
      addUserWindow = null;
    });
  }
});

ipcMain.on("cancel-add-user", () => {
  console.log("cancel");
  addUserWindow.close();
  addUserWindow = null;
});

ipcMain.on("accept-add-user", (event, args) => {
  const { user, initialBalance } = args[0];
  tabService.addUser(user, initialBalance).then(() => {
    addUserWindow.close();
  });
});

ipcMain.on("accept-transaction", (event, args) => {
  console.log("Pressed: accept", args);
  const { user, transaction } = args[0];
  tabService
    .addTransaction(user, transaction)
    .then(() => setBalanceDisplay(user));
});

ipcMain.on("request-balance", (event, username) => {
  setBalanceDisplay(username);
});

ipcMain.on("request-init-data", () => {
  setBalanceDisplay("Otto");
  setUserSelectorContents();
});

const setBalanceDisplay = (username: string): void => {
  tabDB.getBalanceOfUser(username).then((balance) => {
    mainWindow.webContents.send("set-balance", balance);
  });
};

const setUserSelectorContents = (): void => {
  tabDB.getUserNames().then((userList) => {
    console.log(userList);
    mainWindow.webContents.send("populate-user-selector", userList);
  });
};
