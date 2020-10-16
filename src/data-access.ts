import { Database } from "sqlite3";

class DataBaseAccess {
  dbFilePath: string;
  db: Database;

  constructor(dbFilePath: string) {
    this.db = new Database(dbFilePath, (err) => {
      if (err) {
        console.log("Could not connect to database", err);
      } else {
        console.log("Connected to database");
      }
    });
  }

  run(sqlQuery: string, params = []): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(sqlQuery, params, function (err) {
        if (err) {
          console.log("Error running SQL query " + sqlQuery);
          console.log(err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

export default DataBaseAccess;
