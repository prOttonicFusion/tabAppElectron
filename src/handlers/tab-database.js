const DataBaseAccess = require('../services/data-access')
const getFormattedDate  = require('../utils/date-formatter')

class TabDB {
    constructor(dataAccess) {
        this.dataAccess = dataAccess
    }

    init() {
        const sqlQuery1 = `
      CREATE TABLE IF NOT EXISTS tab (name TEXT type UNIQUE, balance REAL)`
        const sqlQuery2 = `
      CREATE TABLE IF NOT EXISTS history (transacton_id INTEGER PRIMARY KEY, name TEXT, timestamp TEXT, transact REAL)`

        return this.dataAccess.run(sqlQuery1) && this.dataAccess.run(sqlQuery2)
    }

    async addUser(name, initialBalance) {
        const row = await this.dataAccess.get('SELECT * FROM tab WHERE name=?', [
            name,
        ])

        if (row) {
            const err = 'User already exists in database!'
            throw Error(err)
        } else {
            return this.dataAccess.run(
                'INSERT INTO tab (name, balance) VALUES (?, ?)',
                [name, initialBalance],
            )
        }
    }

    deleteUser(name) {
        return (
            this.dataAccess.run('DELETE FROM tab WHERE name=?', [name]) &&
      this.dataAccess.run('DELETE FROM history WHERE name=?', [name])
        )
    }

    getUser(name){
        return this.dataAccess.get('SELECT * FROM tab WHERE name=?', [name])
    }

    updateUser(name, newBalance) {
        return this.dataAccess.run('UPDATE tab SET balance=? WHERE name=?', [
            newBalance,
            name,
        ])
    }

    async addTransaction(user, transaction) {
        const userBalance = await this.getBalanceOfUser(user).catch(() => 0)
        const newBalance = userBalance + transaction
        const timeStamp = getFormattedDate()

        return (
            this.updateUser(user, newBalance) &&
      this.updateHistory(user, timeStamp, transaction)
        )
    }

    async trimUserHistory(name) {
        const maxHistoryItems = 50
        const result = await this.dataAccess.get(
            'SELECT COUNT(*) from history WHERE name=?',
            [name],
        )
        const historyEntryCount = result['COUNT(*)']
        if (historyEntryCount >= maxHistoryItems) {
            const itemRemovalCount = historyEntryCount - maxHistoryItems
            return this.dataAccess.run(
                'DELETE FROM history WHERE rowid IN (SELECT rowid FROM history WHERE name=? limit ?);',
                [name, itemRemovalCount],
            )
        }
    }

    updateHistory(name, timeStamp, transaction) {
        return (
            this.dataAccess.run(
                'INSERT INTO history (name, timestamp, transact) VALUES (?, ?, ?)',
                [name, timeStamp, transaction],
            ) && this.trimUserHistory(name)
        )
    }

    async getUserNames() {
        const rows = await this.dataAccess.getAll('SELECT name FROM tab')
        return rows.map(r => r.name).sort()
    }

    async getBalanceOfUser(user) {
        const row = await this.dataAccess.get(
            'SELECT balance FROM tab WHERE name=?',
            [user],
        )

        if (row) {
            return row.balance
        } else {
            const err = 'Could not get user balance'
            console.log(err)
            throw Error(err)
        }
    }

    async getLogsOfUser(user) {
        const rows = await this.dataAccess.getAll(
            'SELECT * FROM history WHERE name=?',
            [user],
        )
        if (rows) {
            return rows
        } else {
            const err = 'Could not get user logs'
            console.log(err)
            throw Error(err)
        }
    }

    async exportDB(newDBPath) {
        const newDataAccess = new DataBaseAccess(newDBPath)
        await this.syncDBs(this.dataAccess, newDataAccess)
    }

    async importDB(newDBPath) {
        const newDataAccess = new DataBaseAccess(newDBPath)
        await this.syncDBs(newDataAccess, this.dataAccess)
    }

    async syncDBs(source, target) {
        const tables = ['tab', 'history']

        const sqlQuery1 = 'CREATE TABLE IF NOT EXISTS tab (name TEXT type UNIQUE, balance REAL);'
        const sqlQuery2 = 'CREATE TABLE IF NOT EXISTS history (transacton_id INTEGER PRIMARY KEY, name TEXT, timestamp TEXT, transact REAL)'
        await target.run(sqlQuery1) && target.run(sqlQuery2)

        let columns
        let values = ''

        await tables.forEach(table => {
            source.getAll(`SELECT * FROM ${table};`).then(rows => {
                const row = rows[0]
                const keys = Object.keys(row) // ['column1', 'column2']
                columns = keys.toString() // 'column1,column2'
                const rowValues = []

                // Generate values and named parameters
                rows.forEach(row => {
                    const valuesList = Object.values(row)
                    for (let i = 0; i < valuesList.length; i++) {
                        if (typeof valuesList[i] == 'string') {
                            valuesList[i] = `"${valuesList[i]}"`
                        }
                    }
                    rowValues.push(`(${valuesList.join(',')})`)
                })
                values = rowValues.join(',')

                // SQL: insert into table (column1,column2) values ($column1,$column2)
                // Parameters: { $column1: 'foo', $column2: 'bar' }
                target.run(`REPLACE INTO ${table} (${columns}) VALUES ${values};`)
            })
        })
    }
}

module.exports = TabDB
