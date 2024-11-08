const { BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')

class AddUserHandler {
    configure(mainWindow, tabDB, rerenderUserList) {
        let addUserWindow

        ipcMain.on('add-user', () => {

            if (addUserWindow) {
                addUserWindow.focus()
                return
            }

            addUserWindow = new BrowserWindow({
                width: 400,
                height: 280,
                // close with the main window
                parent: mainWindow,
                webPreferences: {
                    nodeIntegration: true,
                    preload: path.join(__dirname, '..', 'preload.js'),
                },
                minimizable: false,
                fullscreenable: false,
            })

            addUserWindow.loadFile(path.join(__dirname, '..', 'add-user.html'))

            addUserWindow.setMenu(null)

            // cleanup
            addUserWindow.on('closed', () => {
                addUserWindow = null
            })
        })

        ipcMain.on('cancel-add-user', () => {
            addUserWindow.close()
            addUserWindow = null
        })

        ipcMain.on('accept-add-user', (event, args) => {
            const { user, initialBalance } = args[0]
            tabDB
                .addUser(user, initialBalance)
                .then(() => {
                    addUserWindow.close()
                    rerenderUserList(user)
                })
                .catch((err) => dialog.showErrorBox('Error', err.message))
        })
    }
}

module.exports = AddUserHandler
