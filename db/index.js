const mysql = require('mysql');
const config = require('./config');

function connect () {
  return mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
  })
}

function querySql(sql) {
  // console.log("sql",sql);
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, result) => {
        if(err) {
          reject(err)
        } else {
          resolve(result);
        }
      })
    } catch (error) {
      reject(error);
    } finally {
      conn.end();
    }
  })
}

module.exports = {
  querySql
}