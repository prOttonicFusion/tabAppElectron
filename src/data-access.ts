import { Database, OPEN_CREATE } from "sqlite3";

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

  run(sqlQuery: string, params: any[] = []): Promise<boolean> {
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

  get(sqlQuery: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sqlQuery, params, (err, result) => {
        if (err) {
          console.log("Error running SQL query: " + sqlQuery);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getAll(sqlQuery: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.all(sqlQuery, params, (err, rows) => {
        if (err) {
          console.log("Error running SQL query: " + sqlQuery);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

export default DataBaseAccess;
