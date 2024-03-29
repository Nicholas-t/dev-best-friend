require('dotenv').config();
var express = require('express')
var router = express.Router()
const {
    createMessage, encrypt
} = require("../packages/util")


router.use('/', function (req, res, next){
    if (!req.user){
        res.redirect("/")
    } else {
        if (req.user.type === "dev"){
            next()
        } else {
            let path = req.originalUrl.split("?")[0].split("/")
            if (path[3] === "create-request"){
                next()
            } else {
                res.redirect(`/error/404`)
            }
        }
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