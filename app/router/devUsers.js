require('dotenv').config();
var axios = require('axios')
const querystring = require('querystring');

var express = require('express')
var router = express.Router()

const {
    createMessage
} = require("../packages/util")

router.get('/', function (req, res){
    const toSend = createMessage(req.query)
    res.render(__dirname + '/../public/pages/dev/users/users.html', toSend)
})

module.exports = router