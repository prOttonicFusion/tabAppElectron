const { BrowserWindow, dialog, ipcMain }  = require('electron')
const path  = require('path')

class AddUserHandler {
    configure(
        mainWindow,
        tabDB,
        rerenderUserList,
    ) {
        let addUserWindow

        ipcMain.on('add-user', () => {
            console.log('Pressed: add user')

            if (!addUserWindow) {
                addUserWindow = new BrowserWindow({
                    width: 400,
                    height: 400,
                    // close with the main window
                    parent: mainWindow,
                    webPreferences: {
                        nodeIntegration: true,
                    },
                })

                addUserWindow.loadFile(path.join(__dirname, '../add-user.html'))

                // cleanup
                addUserWindow.on('closed', () => {
                    addUserWindow = null
                })
            }
        })

        ipcMain.on('cancel-add-user', () => {
            console.log('cancel')
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
                .catch(err => console.log(dialog.showErrorBox('Error', err)))
        })
    }
}

module.exports = AddUserHandler
