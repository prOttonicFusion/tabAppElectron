const { Database } = require('sqlite3')

class DataBaseAccess {
    constructor(dbFilePath) {
        this.db = new Database(dbFilePath, (err) => {
            if (err) {
                console.warn('Could not connect to database', err)
            }
        })
    }

    run(sqlQuery, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sqlQuery, params, (err) => {
                if (err) {
                    console.warn(`Error running SQL query ${  sqlQuery}`)
                    console.warn(err)
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    }

    get(sqlQuery, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sqlQuery, params, (err, result) => {
                if (err) {
                    console.warn(`Error running SQL query: ${  sqlQuery}`)
                    console.warn(err)
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    getAll(sqlQuery, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sqlQuery, params, (err, rows) => {
                if (err) {
                    console.warn(`Error running SQL query: ${  sqlQuery}`)
                    console.warn(err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
}

module.exports =  DataBaseAccess
