require('dotenv').config();
var axios = require('axios')
const querystring = require('querystring');

const {
    createMessage
} = require("../packages/util")

var express = require('express')
var router = express.Router()

router.get('/', function (req, res){
    const toSend = createMessage(req.query)
    res.render(__dirname + '/../public/pages/dev/log/log.html', toSend)
})

module.exports = router