const settings = require('../../settings.json')

const languageFilePath = `./${  settings.language  }.json`

let translation

try {
    translation = require(languageFilePath)
} catch (err) {
    console.warn('Unable to load selected language. Falling back to default')
    translation = require('./en.json')
}

module.exports = translation
