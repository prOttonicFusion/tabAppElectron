// dao.js

import { Database } from "sqlite3";
// import Promise
// const Promise = require('bluebird')

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

}

module.exports = DataBaseAccess;
