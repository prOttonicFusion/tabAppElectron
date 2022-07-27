
document.getElementById('more-details').addEventListener('click', () => {
    window.api.send('navigate-in-browser', ['https://github.com/prOttonicFusion/tabAppElectron#readme'])
})

document.getElementById('app-version').innerHTML = `v${window.api.version}`

document.getElementById('author-name').innerHTML = `v${window.api.author}`
