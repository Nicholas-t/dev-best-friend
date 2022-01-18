require('dotenv').config();
var axios = require('axios')
const fs = require('fs');
var express = require('express');
var router = express.Router()

const {
    createMessage, createRequest
} = require("../packages/util")
const dir = __dirname + '/../public/pages/dev/api/'
const swaggerDumpDir = __dirname + `/../packages/swaggerHandler/swaggerDump/`

router.get('/', function (req, res){
    const toSend = createMessage(req.query)
    res.render(dir + 'api.html', toSend)
})

router.get('/create', function (req, res){
    const toSend = createMessage(req.query)
    res.render(dir + 'create.html', toSend)
})

router.get('/view/:api_id', function (req, res){
    let toSend = {
        api_id : req.params.api_id
    }
    toSend = createMessage(req.query, toSend)
    res.render(dir + 'view.html', toSend)
})

router.get('/swagger', function (req, res){
    if (fs.existsSync(`${swaggerDumpDir}${req.user.id}.json`)){
        let toSend = {
            user_id : req.user.dir
        }
        toSend = createMessage(req.query, toSend)
        res.render(dir + 'swagger.html', toSend)
    } else {
        res.redirect('/dev/api')
    }
})


router.post('/send-user-webhook-test', function (req, res){
    let config = JSON.parse(Object.keys(req.body)[0])
    let userTest = {}
    userTest.id = "test-id-1234-1234"
    userTest.email = "test@test.test"
    userTest.name = "test"
    userTest.project_id = "test_project_id"
    userTest.time_stamp = new Date()
    axios({
        method: 'POST',
        url: config.url,
        data: userTest
    }).then((response) => {
        res.status(200).json({
            success: true
        })
    }).catch((e) => {
        if (e.response){
            res.status(e.response.status).json({
                success : false,
                error : e
            })
        } else {
            res.status(500).json({
                success : false,
                error : "NO RESPONSE GIVEN"
            })
        }
    })
})

router.post('/create-request', function (req, res){
    let config = {}
    try {
        config = JSON.parse(Object.keys(req.body)[0])
        // may need to change here for query string or not
        // https://axios-http.com/docs/req_config
        // to add :
        // - proxy
        createRequest(config, res)
    } catch(e) {
        res.json({
            error : e
        })
    }
})



module.exports = router