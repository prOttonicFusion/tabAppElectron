document.getElementById('cancel-user-button').addEventListener('click', () => {
    window.api.send('cancel-add-user')
})

document.getElementById('accept-user-button').addEventListener('click', () => {
    const user = document.getElementById('name-input').value
    const initialBalance = Number(document.getElementById('initial-balance-input').value) || 0

    if (user != '') {
        window.api.send('accept-add-user', [{ user, initialBalance }])
    }
})
