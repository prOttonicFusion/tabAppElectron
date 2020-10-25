import { shell, BrowserWindow, MenuItemConstructorOptions } from "electron";

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
      { role: "delete" },
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

const handleLearnMore = () => {
  shell.openExternal("https://github.com/prOttonicFusion/tabAppelectron");
};

const exportDB = (browserWindow: BrowserWindow) => {
  console.log(browserWindow);
  browserWindow.webContents.send("export-database");
};

const importDB = () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow.webContents.send("import-database");
};

export default menuTemplate;
