import DataBaseAccess from "./data-access";
import { getFormattedDate } from "./date-formatter";

interface ILogEntry {
  name: string;
  timestamp: string;
  transact: number;
}

class TabDB {
  dataAccess: DataBaseAccess;

  constructor(dataAccess: DataBaseAccess) {
    this.dataAccess = dataAccess;
  }

  init(): Promise<boolean> {
    const sqlQuery1 = `
      CREATE TABLE IF NOT EXISTS tab (name TEXT type UNIQUE, balance REAL)`;
    const sqlQuery2 = `
      CREATE TABLE IF NOT EXISTS history (transacton_id INTEGER PRIMARY KEY, name TEXT, timestamp TEXT, transact REAL)`;

    return this.dataAccess.run(sqlQuery1) && this.dataAccess.run(sqlQuery2);
  }

  async addUser(name: string, initialBalance: number): Promise<boolean> {
    const row = await this.dataAccess.get(`SELECT * FROM tab WHERE name=?`, [
      name,
    ]);

    if (row) {
      const err = "User already exists in database!";
      throw Error(err);
    } else {
      return this.dataAccess.run(
        "INSERT INTO tab (name, balance) VALUES (?, ?)",
        [name, initialBalance]
      );
    }
  }

  deleteUser(name: string): Promise<boolean> {
    return (
      this.dataAccess.run(`DELETE FROM tab WHERE name=?`, [name]) &&
      this.dataAccess.run(`DELETE FROM history WHERE name=?`, [name])
    );
  }

  getUser(name: string): Promise<any> {
    return this.dataAccess.get(`SELECT * FROM tab WHERE name=?`, [name]);
  }

  updateUser(name: string, newBalance: number): Promise<boolean> {
    return this.dataAccess.run(`UPDATE tab SET balance=? WHERE name=?`, [
      newBalance,
      name,
    ]);
  }

  async addTransaction(user: string, transaction: number): Promise<boolean> {
    const userBalance = await this.getBalanceOfUser(user).catch(() => 0);
    const newBalance = userBalance + transaction;
    const timeStamp = getFormattedDate();

    return (
      this.updateUser(user, newBalance) &&
      this.updateHistory(user, timeStamp, transaction)
    );
  }

  trimUserHistory(name: string): Promise<boolean> {
    const maxHistoryItems = 50;
    return new Promise((resolve, reject) =>
      this.dataAccess
        .get(`SELECT COUNT(*) from history WHERE name=?`, [name])
        .then((result) => {
          const historyEntryCount = result["COUNT(*)"];
          if (historyEntryCount >= maxHistoryItems) {
            const itemRemovalCount = historyEntryCount - maxHistoryItems;
            this.dataAccess
              .run(
                `DELETE FROM history WHERE rowid IN (SELECT rowid FROM history WHERE name=? limit ?);`,
                [name, itemRemovalCount]
              )
              .catch((err) => reject(err));
          }
          resolve(true);
        })
    );
  }

  updateHistory(
    name: string,
    timeStamp: string,
    transaction: number
  ): Promise<boolean> {
    return (
      this.dataAccess.run(
        `INSERT INTO history (name, timestamp, transact) VALUES (?, ?, ?)`,
        [name, timeStamp, transaction]
      ) && this.trimUserHistory(name)
    );
  }

  getUserNames(): Promise<string[]> {
    return new Promise((resolve) =>
      this.dataAccess
        .getAll(`SELECT name FROM tab`)
        .then((rows) =>
          resolve(rows.map((r: { name: string }) => r.name).sort())
        )
    );
  }

  getBalanceOfUser(user: string): Promise<number> {
    return new Promise((resolve, reject) =>
      this.dataAccess
        .get(`SELECT balance FROM tab WHERE name=?`, [user])
        .then((row) => {
          if (row) {
            resolve(row.balance);
          } else {
            const err = "Could not get user balance";
            console.log(err);
            reject(err);
          }
        })
    );
  }

  getLogsOfUser(user: string): Promise<ILogEntry[]> {
    return new Promise((resolve, reject) =>
      this.dataAccess
        .getAll(`SELECT * FROM history WHERE name=?`, [user])
        .then((rows) => {
          if (rows) {
            resolve(rows);
          } else {
            const err = "Could not get user logs";
            console.log(err);
            reject(err);
          }
        })
    );
  }

  async exportDB(newDBPath: string): Promise<void> {
    const newDataAccess = new DataBaseAccess(newDBPath);
    await this.syncDBs(this.dataAccess, newDataAccess);
  }

  async importDB(newDBPath: string): Promise<void> {
    const newDataAccess = new DataBaseAccess(newDBPath);
    await this.syncDBs(newDataAccess, this.dataAccess);
  }

  private async syncDBs(
    source: DataBaseAccess,
    target: DataBaseAccess
  ): Promise<void> {
    const tables: string[] = ["tab", "history"];

    const sqlQuery1 = `CREATE TABLE IF NOT EXISTS tab (name TEXT type UNIQUE, balance REAL);`;
    const sqlQuery2 = `CREATE TABLE IF NOT EXISTS history (transacton_id INTEGER PRIMARY KEY, name TEXT, timestamp TEXT, transact REAL)`;
    (await target.run(sqlQuery1)) && target.run(sqlQuery2);

    let columns: string;
    let values = "";

    await tables.forEach((table) => {
      source.getAll(`SELECT * FROM ${table};`).then((rows) => {
        const row = rows[0];
        const keys = Object.keys(row); // ['column1', 'column2']
        columns = keys.toString(); // 'column1,column2'
        const rowValues: string[] = [];

        // Generate values and named parameters
        rows.forEach((row: any) => {
          const valuesList: any[] = Object.values(row);
          for (let i = 0; i < valuesList.length; i++) {
            if (typeof valuesList[i] == "string") {
              valuesList[i] = `"${valuesList[i]}"`;
            }
          }
          rowValues.push(`(${valuesList.join(",")})`);
        });
        values = rowValues.join(",");

        // SQL: insert into table (column1,column2) values ($column1,$column2)
        // Parameters: { $column1: 'foo', $column2: 'bar' }
        target.run(`REPLACE INTO ${table} (${columns}) VALUES ${values};`);
      });
    });
  }
}

export default TabDB;
