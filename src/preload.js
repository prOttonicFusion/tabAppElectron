// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const {
    contextBridge,
    ipcRenderer,
} = require('electron')

const i18n = require('./localization/translation-selector')

// Expose methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
        send: (channel, data) => {
            ipcRenderer.send(channel, data)
        },
        receive: (channel, func) => {
            ipcRenderer.on(channel, (event, args) => func(args))
        },
        i18n,
    },
)
