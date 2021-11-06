require('dotenv').config();
var axios = require('axios')
const querystring = require('querystring');

var express = require('express')
var router = express.Router()

const {
    createMessage
} = require("../packages/util")

const dir = __dirname + '/../public/pages/dev/project/'

router.get('/', function (req, res){
    
    const toSend = createMessage(req.query)
    res.render(dir + 'project.html', toSend)
})


router.get('/create', function (req, res){
    const toSend = createMessage(req.query)
    res.render(dir + 'create.html', toSend)
})


module.exports = router