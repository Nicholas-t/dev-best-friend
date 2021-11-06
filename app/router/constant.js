const constants = require("../packages/constant");

require('dotenv').config();

var express = require('express')
var router = express.Router()

router.use('/', function (req, res, next){
    if (!req.user){
        res.redirect("/")
    } else {
        next()
    }
})
router.get('/:objectName', function (req, res){
    res.json(constants[req.params.objectName])
})


module.exports = router