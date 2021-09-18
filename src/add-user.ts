import { ipcRenderer } from 'electron'

document.getElementById('cancel-user-button').addEventListener('click', () => {
    ipcRenderer.send('cancel-add-user')
})

document.getElementById('accept-user-button').addEventListener('click', () => {
    const user = (document.getElementById('name-input') as HTMLInputElement).value
    const initialBalance =
    Number((document.getElementById('initial-balance-input') as HTMLInputElement).value) || 0
    if (user != '') {
        ipcRenderer.send('accept-add-user', [{ user, initialBalance }])
    }
})
