import DataBaseAccess from "./data-access";

class TabDB {
  dataAccess: DataBaseAccess;

  constructor(dataAccess: DataBaseAccess) {
    this.dataAccess = dataAccess;
  }

  init(): Promise<boolean> {
    const sqlQuery1 = `
      CREATE TABLE IF NOT EXISTS tab (name TEXT, balance REAL)`;
    const sqlQuery2 = `
      CREATE TABLE IF NOT EXISTS history (name TEXT, timestamp TEXT, transact REAL)`;

    return this.dataAccess.run(sqlQuery1) && this.dataAccess.run(sqlQuery2);
  }

  addUser(name: string, initialBalance: number): Promise<boolean> {
    return (
      this.dataAccess.run("INSERT INTO tab (name, balance) VALUES (?, ?)", [
        name,
        initialBalance,
      ]) && this.dataAccess.run("INSERT INTO history (name) VALUES (?)", [name])
    );
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

  updateHistory(
    name: string,
    timeStamp: string,
    transaction: number
  ): Promise<boolean> {
    return this.dataAccess.run(
      `INSERT INTO history (name, timestamp, transact) VALUES (?, ?, ?)`,
      [name, timeStamp, transaction]
    );
  }

  getUserNames(): Promise<any> {
    return this.dataAccess.getAll(`SELECT name FROM tab`);
  }

  getBalanceOfUser(user: string): Promise<number> {
    return this.dataAccess.get(`SELECT balance FROM tab WHERE name=?`, [user]);
  }
}

export default TabDB;
