const { Database } = require('sqlite3')

class DataBaseAccess {
    constructor(dbFilePath) {
        console.log(dbFilePath)
        this.db = new Database(dbFilePath, (err) => {
            if (err) {
                console.log('Could not connect to database', err)
            } else {
                console.log('Connected to database')
            }
        })
    }

    run(sqlQuery, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sqlQuery, params, (err) => {
                if (err) {
                    console.log(`Error running SQL query ${  sqlQuery}`)
                    console.log(err)
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
                    console.log(`Error running SQL query: ${  sqlQuery}`)
                    console.log(err)
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
                    console.log(`Error running SQL query: ${  sqlQuery}`)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
}

module.exports =  DataBaseAccess
