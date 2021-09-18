import translation from './translation-selector'

document.getElementById('add-user-title').innerHTML =
  translation['add-user-title']
document.getElementById('name-input-label').innerHTML =
  translation['name-input-label']
document.getElementById('initial-balance-input-label').innerHTML =
  translation['initial-balance-input-label']
document.getElementById('accept-user-button').innerHTML =
  translation['accept-button']
document.getElementById('cancel-user-button').innerHTML =
  translation['cancel-button']
Array.from(document.getElementsByClassName('currency-symbol')).forEach(
    element => {
        element.innerHTML = translation['currency-symbol']
    }
)
