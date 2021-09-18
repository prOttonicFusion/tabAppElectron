import {
    BrowserWindow,
    MenuItem,
    MenuItemConstructorOptions,
    dialog,
    shell,
} from 'electron'

const menuTemplate: MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Export database',
                click(_menuItem: MenuItem, browserWindow: BrowserWindow): void {
                    exportDB(browserWindow)
                },
            },
            {
                label: 'Import database',
                click(_menuItem: MenuItem, browserWindow: BrowserWindow): void {
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
                click(_menuItem: MenuItem, browserWindow: BrowserWindow): void {
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
                click(): void {
                    handleLearnMore()
                },
            },
        ],
    },
]

const deleteUser = (browserWindow: BrowserWindow) => {
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

const exportDB = (browserWindow: BrowserWindow) => {
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

const importDB = (browserWindow: BrowserWindow) => {
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

export default menuTemplate
