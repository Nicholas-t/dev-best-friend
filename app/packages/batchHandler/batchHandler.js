require('dotenv').config();
const csv = require("csvtojson");
const fs = require("fs");
const converter = require('json-2-csv');
const {cleanObject, copySchema, delay, getCurrentTime} = require('../util')
const {
    logSchema
} = require('../schema')
const { v4: uuidv4 } = require('uuid');
let db = null
const axios = require("axios")

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

const uploadDirectory = './batch/uploads/';
const resultDirectory = './batch/result/';


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

    addResultBatch(processId, _newRow, cb){
        const newRow = cleanObject(_newRow)
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

    startProcess(params, uploadedData, batchDetail, userId, cb){
        try {
            db.getXbyY("api", "id", batchDetail.api_id, async (err, result) => {
                const apiDetail = result[0]
                for(let i = 0 ; i < uploadedData.length ; i++){
                    //console.log(`PROCESSING ${i}/${uploadedData.length} ROWS OF ${params.process_id}`)
                    let curParams = {}
                    let curHeader = {}
                    let curPathParameter = {}
                    for (let j = 0 ; j < batchDetail.input.length ; j++){
                        const keyItem = batchDetail.input[j].key_item
                        curParams[`${keyItem}`] = uploadedData[i][keyItem] 
                            ? uploadedData[i][keyItem]
                            : batchDetail.input[j].default_value
                    }
                    for (let j = 0 ; j < batchDetail.header.length ; j++){
                        const keyItem = batchDetail.header[j].key_item
                        curHeader[`${keyItem}`] = uploadedData[i][keyItem] 
                            ? uploadedData[i][keyItem]
                            : batchDetail.header[j].default_value
                    }
                    for (let j = 0 ; j < batchDetail.pathParameter.length ; j++){
                        const keyItem = batchDetail.pathParameter[j].key_item
                        curPathParameter[`${keyItem}`] = uploadedData[i][keyItem] 
                            ? uploadedData[i][keyItem]
                            : batchDetail.pathParameter[j].default_value
                    }
                    Object.keys(curPathParameter).forEach((key) => {
                        apiDetail.endpoint = apiDetail.endpoint.split(`{${key}}`).join(curPathParameter[key])
                    })
                    await delay(300)
                    let newRow = {}
                    let status = 200
                    if (apiDetail.method === "POST") {
                        [newRow, status] = await axios({
                            method: apiDetail.method,
                            url: apiDetail.endpoint,
                            data: curParams,
                            headers: curHeader
                        }).then((response) => {
                            return [response.data, response.status]
                        })
                    } else if (apiDetail.method === "GET"){
                        [newRow, status] = await axios({
                            method: apiDetail.method,
                            url: apiDetail.endpoint,
                            params: curParams,
                            headers: curHeader
                        }).then((response) => {
                            return [response.data, response.status]
                        })
                    }
                    await db.decrementCreditUser(userId, apiDetail.id, () => {})
                    const log = copySchema(logSchema)
                    log.id = uuidv4()
                    log.client_id = userId
                    log.api_id = batchDetail.api_id
                    log.dev_id = apiDetail.dev_id
                    log.project_id = params.project_uid
                    log.timestamp = getCurrentTime()
                    log.status = status
                    await db.add("log", log, (err, result) => {
                        if (err){
                            console.error(err)
                        }
                    })
                    cb(params.process_id, newRow)
                }
                const modifyProcess = {
                    status : 2,
                    time_finished : getCurrentTime()
                }
                db.modify("batch_process", modifyProcess, "id", params.process_id, (err, result) => {
                    if (err){
                        console.log(err)
                    }
                })
            })
        } catch (e) {
            const modifyProcess = {
                status : 3,
                time_finished : getCurrentTime()
            }
            db.modify("batch_process", modifyProcess, "id", params.process_id, (err, result) => {
                if (err){
                    console.log(err)
                }
            })
        } 
    }
}

module.exports = batchHandler;
