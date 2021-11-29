require('dotenv').config();
var axios = require('axios')

const {
    decrypt
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
    //TODO
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

router.post('/request/:api_id', function (req, res){
    let config = {}
    try {
        config = JSON.parse(Object.keys(req.body)[0])
        if (config.method === "POST") {
            axios({
                method: config.method,
                url: config.endpoint,
                data: config.params,
                headers: config.headers
            }).then((response) => {
                res.status(response.status).json(response.data)
            }).catch((e) => {
                if (e.response){
                    res.status(e.response.status).json({
                        error : e
                    })
                } else {
                    res.status(500).json({
                        error : "NO RESPONSE GIVEN"
                    })
                }
            })
        } else if (config.method === "GET"){
            axios({
                method: config.method,
                url: config.endpoint,
                params: config.params,
                headers: config.headers
            }).then((response) => {
                res.status(response.status).json(response.data)
            }).catch((e) => {
                if (e.response){
                    res.status(e.response.status).json({
                        error : e
                    })
                } else {
                    res.status(500).json({
                        error : "NO RESPONSE GIVEN"
                    })
                }
            })
        } else {
            res.json({
                error : "INVALID METHOD"
            })
        }
    } catch(e) {
        res.json({
            error : e
        })
    }
})

module.exports = router