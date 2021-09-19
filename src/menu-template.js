const {
    BrowserWindow,
    MenuItem,
    dialog,
    shell,
}  = require('electron')

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Export database',
                click(_menuItem, browserWindow) {
                    exportDB(browserWindow)
                },
            },
            {
                label: 'Import database',
                click(_menuItem, browserWindow) {
                    importDB(browserWindow)
                },
            },
            { role: 'close' },
        ],
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { type: 'separator' },
            {
                label: 'Delete User',
                click(_menuItem, browserWindow) {
                    deleteUser(browserWindow)
                },
            },
        ],
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
        ],
    },
    { role: 'window', submenu: [{ role: 'minimize' }, { role: 'close' }] },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn more',
                click() {
                    handleLearnMore()
                },
            },
        ],
    },
]

const deleteUser = browserWindow => {
    const buttonIndex = dialog.showMessageBoxSync(browserWindow, {
        type: 'question',
        title: 'Delete Current User',
        message: 'Do you really wish to delete the current user permanently?',
        cancelId: 0,
        buttons: ['Cancel', 'Delete user'],
    })
    if (buttonIndex == 1) {
        browserWindow.webContents.send('delete-current-user')
    }
}

const exportDB = browserWindow => {
    const newDBPath = dialog.showSaveDialogSync({
        title: 'Export database as:',
        filters: [
            {
                name: 'Sqlite3 Database',
                extensions: ['db', 'sqlite3'],
            },
        ],
    })
    browserWindow.webContents.send('export-database', [{ newDBPath }])
}

const importDB = browserWindow => {
    const newDBPath = dialog.showSaveDialogSync({
        title: 'Import database:',
        filters: [
            {
                name: 'Sqlite3 Database',
                extensions: ['db', 'sqlite3'],
            },
        ],
    })
    browserWindow.webContents.send('import-database', [{ newDBPath }])
}

const handleLearnMore = () => {
    shell.openExternal('https://github.com/prOttonicFusion/tabAppelectron')
}

module.exports = menuTemplate
