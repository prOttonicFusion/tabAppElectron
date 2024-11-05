const { dialog, BrowserWindow }  = require('electron')
const formatToISO = require('./utils/date-formatter').formatToISO
const path = require('path')

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Export user balances',
                click: (_menuItem, browserWindow) => {
                    exportDBAsCSV(browserWindow)
                },
            },
            {
                label: 'Export database',
                click: (_menuItem, browserWindow) => {
                    exportDB(browserWindow)
                },
            },
            {
                label: 'Import database (requires restart)',
                click: (_menuItem, browserWindow) => {
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
                click: (_menuItem, browserWindow) => {
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
                label: 'About',
                click: () => {
                    handleAbout()
                },
            },
        ],
    },
]

const deleteUser = (browserWindow) => {
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

const exportDB = (browserWindow) => {
    const currentDate = new Date()
    const newDBPath = dialog.showSaveDialogSync({
        title: 'Export database as:',
        defaultPath: `tabApp-database-${formatToISO(currentDate)}.db`,
        filters: [
            {
                name: 'Sqlite3 Database',
                extensions: ['db', 'sqlite3'],
            },
        ],
    })
    browserWindow.webContents.send('export-database', [{ newDBPath }])
}

const exportDBAsCSV = (browserWindow) => {
    const currentDate = new Date()
    const csvFilePath = dialog.showSaveDialogSync({
        title: 'Export user balances as a CSV table:',
        defaultPath: `tabApp-${formatToISO(currentDate)}.csv`,
        filters: [
            {
                name: 'CSV File',
                extensions: ['csv'],
            },
        ],
    })
    browserWindow.webContents.send('export-database-as-csv', [{ csvFilePath }])
}

const importDB = async (browserWindow) => {
    const filePaths = dialog.showOpenDialogSync({
        title: 'Import database:',
        filters: [
            {
                name: 'Sqlite3 Database',
                extensions: ['db', 'sqlite3'],
            },
        ],
    })

    if (filePaths) {
        const newDBPath = filePaths[0]
        browserWindow.webContents.send('import-database', [{ newDBPath }])
    }
}

const handleAbout = () => {
    let aboutWindow

    if (aboutWindow) {
        aboutWindow.focus()
        return
    }

    aboutWindow = new BrowserWindow({
        width: 400,
        height: 280,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        minimizable: false,
        fullscreenable: false,
    })

    aboutWindow.loadFile(path.join(__dirname, 'about.html'))

    aboutWindow.setMenu(null)

    // cleanup
    aboutWindow.on('closed', () => {
        aboutWindow = null
    })
}

module.exports = menuTemplate
