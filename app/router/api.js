require('dotenv').config();
var axios = require('axios')

const {
    decrypt,
    createRequest
} = require("../packages/util")

let db = null

try{
  const databaseHandler = require('../packages/db/db');
  db = new databaseHandler();
  const sqlConf = {
    "host" : process.env.MY_SQL_HOST || "localhost",
    "user" : process.env.MY_SQL_USER || "root",
    "password" : process.env.MY_SQL_PWD || "1717",
    connectTimeout: 30000
  }
  db.start(sqlConf)
  console.log("SUCCESS CONNECT TO DB FROM /api")
}catch(e){
  console.log(`FAILED TO LOAD DB`)
  console.log(e)
  process.exit()
}

var express = require('express');
var router = express.Router()

router.use('/', function (req, res, next){
    if (!req.headers.authorization){
        res.status(500).json({
            error : "Unauthorized"
        })
    } else {
        next()
    }
})

router.get('/available-api', function (req, res){
    try {
        const token = decrypt(req.headers.authorization.split(" ")[1])
        if (token.startsWith("user")){
            let userId = token.split("|")[1]
            db.getUserAvailableApi(userId, (err, result) => {
                if (err){
                    res.json({
                        error : err
                    })
                } else {
                    res.json({
                        result
                    })
                }
            })
        } else {
            let projectUid = token.split("|")[1]
            db.getAvailableApiInProject(projectUid, (err, result) => {
                if (err){
                    res.json({
                        error : err
                    })
                } else {
                    res.json({
                        result : result
                    })
                }
            })
        }
    } catch (e) {
        res.json({
            error : e
        })
    }
})

router.get('/fields/input/:api_id', function (req, res){
    try {
        const token = decrypt(req.headers.authorization.split(" ")[1])
        let fields = []
        db.getXbyY("default_input", "api_id", req.params.api_id, (err, fields) => {
            if (err){
                res.json({
                    error : err
                })
            } else {
                res.json({
                    fields
                })
            }
        })
    } catch (e) {
        res.json({
            error : e
        })
    }
})

router.get('/fields/headers/:api_id', function (req, res){
    try {
        const token = decrypt(req.headers.authorization.split(" ")[1])
        db.getXbyY("default_headers", "api_id", req.params.api_id, (err, fields) => {
            if (err){
                res.json({
                    error : err
                })
            } else {
                res.json({
                    fields
                })
            }
        })
    } catch (e) {
        res.json({
            error : e
        })
    }
})

router.post('/request/:api_id', async function (req, res){
    const token = decrypt(req.headers.authorization.split(" ")[1])
    if (token.startsWith("user")){
        let userId = token.split("|")[1]
        db.checkUserAvailableCredit(req.params.api_id, userId, (err, result) => {
            if (err){
                res.json({
                    error : err
                })
            } else if (result.length == 0){
                res.json({
                    error : "No available credit"
                })
            } else if (result[0].credit <= 0){
                res.json({
                    error : "You are out of credit"
                })
            } else {
                db.getXbyY("client", "id", userId, (err, result) => {
                    if (err){
                        res.json({
                            error : err
                        })
                    } else if (result.length != 0) {
                        let userData = result[0]
                        if (userData.activated == 0){
                            res.status(501).json({
                                error : "Plase activate your account"
                            })
                        } else {
                            db.getXbyY("api", "id", req.params.api_id, (err, result)=>{
                                if (err){
                                    res.json({
                                        error : err
                                    })
                                } else  if (result.length == 0){
                                    res.json({
                                        error : "API Not Found"
                                    })
                                } else {
                                    const apiData = result[0]
                                    let config = {
                                        method : apiData.method,
                                        endpoint : apiData.endpoint,
                                        params : req.body,
                                        headers : {}
                                    }
                                    createRequest(config, res)
                                    db.decrementCreditUser(userId, req.params.api_id, () => {})
                                }
                            })
                        }
                    }
                })
            }
        })
    } else {
        db.getXbyY("api", "id", req.params.api_id, (err, result)=>{
            if (err){
                res.json({
                    error : err
                })
            } else  if (result.length == 0){
                res.json({
                    error : "API Not Found"
                })
            } else {
                const apiData = result[0]
                let config = {
                    method : apiData.method,
                    endpoint : apiData.endpoint,
                    params : req.body,
                    headers : {}
                }
                createRequest(config, res)
            }
        })
    }
})

module.exports = router