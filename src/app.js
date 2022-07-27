// Request main.ts to init balance display and user selector
window.api.send('request-init-data')

// If new user data is sent from main.ts
window.api.receive('render-balance', (args) => {
    const balanceDisplay = document.getElementById('balance-display')
    const balance = args[0].balance
    if (balance < 0) {
        balanceDisplay.classList.add('negative-balance')
    } else {
        balanceDisplay.classList.remove('negative-balance')
    }
    balanceDisplay.innerHTML = balance.toFixed(2)
})

window.api.receive('render-logs', (args) => {
    const logContainer = document.getElementById('log-container')
    logContainer.innerHTML = null
    const logs = args[0].logs.reverse()
    for (let i = 0; i < logs.length; i++) {
        const entry = `<div class="log-entry">
        <div class="log-timestamp">${logs[i].timestamp}</div>
        <div class="log-transaction">${logs[i].transact.toFixed(2)} ${window.api.i18n['currency-symbol']}</div>
    </div>`
        logContainer.innerHTML += entry
    }
})

// Generate user selector dropdown
window.api.receive('populate-user-selector', (args) => {
    populateUserDropdown(args[0])
})

window.api.receive('export-database', (args) => {
    window.api.send('export-database', args)
})

window.api.receive('export-database-as-csv', (args) => {
    window.api.send('export-database-as-csv', args)
})

window.api.receive('import-database', (args) => {
    window.api.send('import-database', args)
})

// Handle user deletion
window.api.receive('delete-current-user', () => {
    const user = getSelectedUser()
    if (user) {
        window.api.send('delete-current-user', { user })
    }
})

// Handle user selections
document.getElementById('user-selector').addEventListener('click', () => {
    const user = getSelectedUser()
    if (user) {
        requestUserData(user)
    }
})

// Handle clicks on add-user button
document.getElementById('add-user-button').addEventListener('click', () => {
    window.api.send('add-user')
})

// Handle clicks on button for accepting transactions
document
    .getElementById('accept-button')
    .addEventListener('click', () => handleTransactionSubmit())

// Register keyboard event listeners
document
    .getElementById('recharge-input')
    .addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleTransactionSubmit()
            return true
        }
    })

document
    .getElementById('price-input')
    .addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleTransactionSubmit()
            return true
        }
    })

const handleTransactionSubmit = () => {
    const transaction = getValidTransactionValueOrZero()
    const user = getSelectedUser()
    if (transaction && user) {
        window.api.send('accept-transaction', [{ user, transaction }])
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
    window.api.send('request-userdata', userName)
}
