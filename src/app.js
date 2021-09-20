const { ipcRenderer }  = require('electron')
const i18n = require('./localization/translation-selector')

// Request main.ts to init balance display and user selector
ipcRenderer.send('request-init-data')

// If new user data is sent from main.ts
ipcRenderer.on('render-balance', (event, args) => {
    const balanceDisplay = document.getElementById('balance-display')
    const balance = args[0].balance
    if (balance < 0) {
        balanceDisplay.classList.add('negative-balance')
    } else {
        balanceDisplay.classList.remove('negative-balance')
    }
    balanceDisplay.innerHTML = balance.toFixed(2)
})

ipcRenderer.on('render-logs', (event, args) => {
    const logContainer = document.getElementById('log-container')
    logContainer.innerHTML = null
    const logs = args[0].logs.reverse()
    for (let i = 0; i < logs.length; i++) {
        const entry = `<div class="log-entry">
        <span class="log-timestamp">${logs[i].timestamp}</span>
        <span class="log-transaction">${logs[i].transact.toFixed(2)} ${i18n['currency-symbol']}</span>
    </div>`
        logContainer.innerHTML += entry
    }
})

// Generate user selector dropdown
ipcRenderer.on('populate-user-selector', (event, args) => {
    populateUserDropdown(args[0])
})

ipcRenderer.on('export-database', (event, args) => {
    ipcRenderer.send('export-database', args)
})

ipcRenderer.on('import-database', (event, args) => {
    ipcRenderer.send('import-database', args)
})

// Handle user deletion
ipcRenderer.on('delete-current-user', () => {
    const user = getSelectedUser()
    if (user) {
        ipcRenderer.send('delete-current-user', [{ user }])
    }
})

// Handle user selections
document.getElementById('user-selector').addEventListener('click', () => {
    const user = getSelectedUser()
    console.log('Selected: ', user)
    if (user) {
        requestUserData(user)
    }
})

// Handle clicks on add-user button
document.getElementById('add-user-button').addEventListener('click', () => {
    ipcRenderer.send('add-user')
})

// Handle clicks on button for accepting transactions
document
    .getElementById('accept-button')
    .addEventListener('click', () => handleTransactionSubmit())

// Register keyboard event listeners
document
    .getElementById('recharge-input')
    .addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            handleTransactionSubmit()
            return true
        }
    })

document
    .getElementById('price-input')
    .addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            handleTransactionSubmit()
            return true
        }
    })

const handleTransactionSubmit = () => {
    const transaction = getValidTransactionValueOrZero()
    const user = getSelectedUser()
    if (transaction && user) {
        ipcRenderer.send('accept-transaction', [{ user, transaction }])
    }
    resetInputFields()
}

const populateUserDropdown = (usersData) => {
    const userList = usersData.userList
    const dropdown = document.getElementById('user-selector')
    for (let i = dropdown.options.length - 1; i >= 1; i--) {
        dropdown.remove(i)
    }
    for (let j = 1; j <= userList.length; j++) {
        dropdown.options.add(new Option(userList[j - 1]))
    }
    if (usersData.currentUser) {
        console.log(usersData)
        dropdown.value = usersData.currentUser
    }
}

const getValidTransactionValueOrZero = () => {
    const price = Number(
        document.getElementById('price-input').value.replace(',', '.'),
    )
    const deposit = Number(
        document.getElementById('recharge-input').value.replace(',', '.'),
    )
    let value = 0.0
    if (price) {
        value -= price
    }
    if (deposit) {
        value += deposit
    }
    return value
}

const getSelectedUser = () => {
    const selector = document.getElementById('user-selector')
    const selected = selector.options[selector.selectedIndex]
    if (selected.id == 'disabled-list-option') {
        return null
    }
    return selected.text
}

const resetInputFields = () => {
    document.getElementById('recharge-input').value = ''
    document.getElementById('price-input').value = ''
}

const requestUserData = (userName) => {
    ipcRenderer.send('request-userdata', userName)
}
