var fs = require('fs')
const path = require('path')

const getOldestFile = (files, rootPath) => {
    const out = []
    files.forEach((file) => {
        const stats = fs.statSync(path.join(rootPath, file))

        if (stats.isFile()) {
            out.push({ 'file': file, 'mtime': stats.mtime.getTime() })
        }
    })

    out.sort((a, b) => {
        return a.mtime - b.mtime
    })

    return out.length > 0 ? out[0].file : null
}

const getFilesWithExtension = (fileRootDir, extension) => {
    return fs.readdirSync(fileRootDir).filter((file) =>
        path.extname(file) === extension,
    )
}

module.exports = {
    getOldestFile,
    getFilesWithExtension,
}
