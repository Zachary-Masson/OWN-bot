const dotenv = require("dotenv").config().parsed;
const mariadb = require("mariadb");

class Database {
  db;
  constructor() {}

  async init() {
    const connection = await mariadb.createConnection({
      host: dotenv.HOST,
      user: dotenv.USERNAME,
      password: dotenv.PASSWORD,
      database: dotenv.DATABASE,
    });
    this.db = connection;
    console.log("[\x1b[32mDEBUG\x1b[0m] Base de donnée initialiser !");
    return this;
  }

  get getDb() {
    return this.db;
  }
}
module.exports = Database;
