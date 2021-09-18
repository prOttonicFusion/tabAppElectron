/* eslint-disable @typescript-eslint/no-var-requires */

const settings = require('../../settings.json')

const languageFilePath = `./${  settings.language  }.json`
var translation

try {
    translation = require(languageFilePath)
} catch (ex) {
    console.log('Unable to load selected language. Falling back to default')
    translation = require('./en.json')
}

exports.translation = translation
