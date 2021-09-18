// eslint-disable-next-line @typescript-eslint/no-var-requires
const settings = require('../../settings.json')

const languageFilePath = `./${  settings.language  }.json`
let translation

try {
    translation = require(languageFilePath)
} catch (ex) {
    console.log('Unable to load selected language. Falling back to default')
    translation = require('./en.json')
}

export default translation as any
