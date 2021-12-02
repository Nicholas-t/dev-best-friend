const { apiSchema, defaultHeadersSchema, defaultInputSchema } = require('../schema');
const { copySchema } = require('../util');

require('dotenv').config();

let db = null

try{
  const databaseHandler = require('../db/db');
  db = new databaseHandler();
  const sqlConf = {
    "host" : process.env.MY_SQL_HOST || "localhost",
    "user" : process.env.MY_SQL_USER || "root",
    "password" : process.env.MY_SQL_PWD || "1717",
    connectTimeout: 30000
  }
  db.start(sqlConf)
  console.log("SUCCESS CONNECT TO DB FROM swaggerHandler.js")
}catch(e){
  console.log(`FAILED TO LOAD DB`)
  console.log(e)
  process.exit()
}

class swaggerHandler {
	/**
	 * @constructor
	 */
	constructor() {
    this.description = 'Helper for operation dealing with swagger API Documentation';
  }   
  
    //TODO
}

module.exports = swaggerHandler;
