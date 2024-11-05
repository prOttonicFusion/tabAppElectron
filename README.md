# tabAppElectron
A simple bar tab desktop app, written in node.js, using [electron.js](https://www.electronjs.org/) for windowing and [SQLite](https://www.sqlite.org/) for storage

<img src="./docs/assets/screenshot.png" width="500">

## Installation
### Linux
#### Alt 1: AppImage
Download the `.AppImage` file from the latest [relase](https://github.com/prOttonicFusion/tabAppElectron/releases/latest) and save it in some convenient location. Installation completed!

#### Alt 2: Snap
Download the `.snap` file from the latest [relase](https://github.com/prOttonicFusion/tabAppElectron/releases/latest) and install it using
```
snap install ~/Downloads/tabapp_1.0.1_amd64.snap --dangerous
```

## Development

### Prerequisites

- [node](https://nodejs.org)

### Run in dev mode

1. Install packages using `npm i`
1. Launch app using `npm start` 

### Distribution

1. Install packages using `npm i`
1. Run `npm run dist` to package app in distributable format
1. Navigate to the `dist` folder and find the suitable executable for your OS