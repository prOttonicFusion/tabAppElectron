import { app, BrowserWindow, ipcMain, Menu, dialog } from "electron";
import * as path from "path";
import DataBaseAccess from "./data-access";
import TabDB from "./tab-database";
import menuTemplate from "./menu-template";
import AddUserHandler from "./handlers/main/add-user-handler";

let mainWindow: BrowserWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 670,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    width: 900,
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

// Set up app menu
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// Connect to database
const dataAccess = new DataBaseAccess(
  `${app.getPath("userData")}/database.sqlite3`
);
const tabDB = new TabDB(dataAccess);
tabDB.init();

ipcMain.on("accept-transaction", (event, args) => {
  console.log("Pressed: accept", args);
  const { user, transaction } = args[0];
  tabDB
    .addTransaction(user, transaction)
    .then(() => sendUserdataForRendering(user));
});

ipcMain.on("request-userdata", (event, username) => {
  sendUserdataForRendering(username);
});

ipcMain.on("request-init-data", () => {
  sendUserSelectorContents();
});

ipcMain.on("export-database", (event, args) => {
  const { newDBPath } = args[0];
  if (newDBPath) {
    console.log("Export path set!");
    tabDB
      .exportDB(newDBPath)
      .then(() => console.log("Exported!"))
      .catch((err) => console.log(err));
  }
});

ipcMain.on("import-database", (event, args) => {
  const { newDBPath } = args[0];
  if (newDBPath) {
    tabDB
      .importDB(newDBPath)
      .then(() => sendUserSelectorContents())
      .catch((err) => console.log(err));
  }
});

ipcMain.on("delete-current-user", (event, args) => {
  const { user } = args[0];
  tabDB
    .deleteUser(user)
    .then(() => sendUserSelectorContents())
    .catch(() =>
      console.log(dialog.showErrorBox("Error", `Unable to delete user ${user}`))
    );
});

const sendUserdataForRendering = (username: string): void => {
  tabDB
    .getBalanceOfUser(username)
    .then((balance) => {
      mainWindow.webContents.send("render-balance", [{ balance }]);
    })
    .catch(() => mainWindow.webContents.send("render-balance", 0));

  tabDB.getLogsOfUser(username).then((logs) => {
    mainWindow.webContents.send("render-logs", [{ logs }]);
  });
};

const sendUserSelectorContents = (currentUser?: string): void => {
  tabDB.getUserNames().then((userList) => {
    console.log(userList);
    mainWindow.webContents.send("populate-user-selector", [
      { userList, currentUser },
    ]);
    if (currentUser) {
      tabDB
        .getBalanceOfUser(currentUser)
        .then((balance) =>
          mainWindow.webContents.send("render-balance", [{ balance }])
        );
    }
  });
};

// Set up handlers
new AddUserHandler().configure(
  mainWindow,
  tabDB,
  sendUserSelectorContents
);
