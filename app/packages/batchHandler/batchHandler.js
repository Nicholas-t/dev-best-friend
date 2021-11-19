require('dotenv').config();
const csv = require("csvtojson");
const { response } = require('express');
const fs = require("fs");
const converter = require('json-2-csv');

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
  console.log("SUCCESS CONNECT TO DB FROM batchHandler.js")
}catch(e){
  console.log(`FAILED TO LOAD DB`)
  console.log(e)
  process.exit()
}

uploadDirectory = './batch/uploads/';
resultDirectory = './batch/result/';


class batchHandler {
	/**
	 * @constructor
	 */
	constructor() {
        this.description = 'Helper for operation dealing with batch processes';
    }
    
    readUploadedBatchAsJson(processId, cb){
        if(fs.existsSync(`${uploadDirectory}${processId}.csv`)){
            csv().fromFile(`${uploadDirectory}${processId}.csv`).then( function(jsonArrayObj){
                cb(jsonArrayObj, this); 
            })
        } else {
            cb([], this)
        }
    }

    readResultBatchAsJson(processId, cb){
        if(fs.existsSync(`${resultDirectory}${processId}.csv`)){
            csv().fromFile(`${resultDirectory}${processId}.csv`).then(function(jsonArrayObj){
                cb(jsonArrayObj, this); 
            })
        } else {
            cb([], this)
        }
    }

    addResultBatch(processId, newRow, cb){
        if(fs.existsSync(`${resultDirectory}${processId}.csv`)){
            csv().fromFile(`${resultDirectory}${processId}.csv`).then(
                function(jsonArrayObj){
                    let newJson = jsonArrayObj
                    newJson.push(newRow)
                    converter.json2csv(newJson, (err, csv) => {
                        if (err) {
                            console.log(err);
                            cb(err)
                        } else {
                            fs.writeFileSync(`${resultDirectory}${processId}.csv`, csv);
                            cb(null)
                        }
                    });
                })
        } else {
            converter.json2csv([newRow], (err, csv) => {
                if (err) {
                    console.log(err);
                    cb(err)
                } else {
                    fs.writeFileSync(`${resultDirectory}${processId}.csv`, csv);
                    cb(null)
                }
            });
        }
    }
}

module.exports = batchHandler;
