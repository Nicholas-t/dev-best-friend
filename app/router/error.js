require('dotenv').config();
var axios = require('axios')
const querystring = require('querystring');

var express = require('express')
var router = express.Router()

const {
    createMessage
} = require("../packages/util")

router.get('/', function (req, res){
    res.redirect('/error/404')
})

router.get('/404', function (req, res){
    const toSend = createMessage(req.query)
    res.render(__dirname + '/../public/pages/error-404.html', toSend)
})

router.get('/500', function (req, res){
    const toSend = createMessage(req.query)
    res.render(__dirname + '/../public/pages/error-500.html', toSend)
})


module.exports = router