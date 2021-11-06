require('dotenv').config();
var axios = require('axios')
const querystring = require('querystring');

var express = require('express')
var router = express.Router()
const {
    createMessage
} = require("../packages/util")


router.use('/', function (req, res, next){
    if (!req.user){
        res.redirect("/")
    } else {
        next()
    }
})

router.use('/api', require("./devApi"))
router.use('/log', require("./devLog"))
router.use('/project', require("./devProject"))
router.use('/users', require("./devUsers"))

router.get('/', function (req, res){
    const toSend = createMessage(req.query)
    res.render(__dirname + '/../public/pages/dev/index.html', toSend)
})


module.exports = router