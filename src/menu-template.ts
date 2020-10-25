import {
  shell,
  dialog,
  BrowserWindow,
  MenuItemConstructorOptions,
} from "electron";

const menuTemplate: MenuItemConstructorOptions[] = [
  {
    label: "File",
    submenu: [
      {
        label: "Export database",
        click(menuItem, browserWindow) {
          exportDB(browserWindow);
        },
      },
      {
        label: "Import database",
        click() {
          importDB();
        },
      },
      { role: "close" },
    ],
  },
  {
    label: "Edit",
    submenu: [
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { type: "separator" },
      {
        label: "Delete User",
        click(menuItem, browserWindow) {
          deleteUser(browserWindow);
        },
      },
    ],
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  { role: "window", submenu: [{ role: "minimize" }, { role: "close" }] },
  {
    role: "help",
    submenu: [
      {
        label: "Learn more",
        click() {
          handleLearnMore();
        },
      },
    ],
  },
];

const deleteUser = (browserWindow: BrowserWindow) => {
  const buttonIndex = dialog.showMessageBoxSync(browserWindow, {
    type: "question",
    title: "Delete Current User",
    message: "Do you really wish to delete the current user permanently?",
    cancelId: 0,
    buttons: ["Cancel", "Delete user"],
  });
  if (buttonIndex == 1) {
    browserWindow.webContents.send("delete-current-user");
  }
};

const exportDB = (browserWindow: BrowserWindow) => {
  console.log(browserWindow);
  browserWindow.webContents.send("export-database");
};

const importDB = () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow.webContents.send("import-database");
};

const handleLearnMore = () => {
  shell.openExternal("https://github.com/prOttonicFusion/tabAppelectron");
};

export default menuTemplate;
