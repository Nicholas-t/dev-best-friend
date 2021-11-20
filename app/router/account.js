require('dotenv').config();

const {
    copySchema,
    getCurrentTime,
    createMessage
} = require('../packages/util')

const {
    clientSchema,
    devSchema,
    userPwSchema
} = require('../packages/schema')

const axios = require("axios")

const { v4: uuidv4 } = require('uuid');

var bcrypt = require('bcrypt');

  
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
  console.log("SUCCESS CONNECT TO DB FROM /account for account management")
}catch(e){
  console.log(`FAILED TO LOAD DB`)
  console.log(e)
  process.exit()
}
const passport = require('passport');


const initializePassport = require("../packages/passport-config")
initializePassport(
  passport, 
  (email, cb) => db.getUserByEmail(email, cb),
  (id, cb) => db.getUserById(id, cb)
)

var express = require('express');
const e = require('express');
var router = express.Router()

const dir = __dirname + '/../public/pages/'

router.use('/login', function (req, res, next) {
    if (req.user){
        res.redirect("/")
    } else {
        next()
    }
})
router.get('/login', function (req, res) {
    const toSend = createMessage(req.query)
    res.render(dir + 'login.html', toSend)
})

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, users, info) {
        if (err) {
            return next(err);
        }
        if (!users) {
            return res.redirect(`/account/login/?error=${info.message}`)
        }
        for (let i = 0 ; i < users.length ; i++){
            const user = users[i]
            if (user.type === "dev") {
                return req.login(user, loginErr => {
                    if (loginErr) {
                        return next(loginErr);
                    } else {
                        db.modify("dev", {
                            last_sign_in : getCurrentTime()
                        }, "id", user.id, () => {
                            res.redirect(`/dev?success=login`)
                        })
                    }
                }); 
            }
        }
        if (users.length != 0) {
            return res.redirect(`/finder?error=not_dev_login`)
        } else {
            return res.redirect(`/account/login/?error=internal_error`)
        }
    })(req, res, next);
});

router.post('/login/:project_uid', function(req, res, next) {
    passport.authenticate('local', function(err, users, info) {
        if (err) {
            return next(err);
        }
        if (!users) {
            return res.redirect(`/p/${req.params.project_uid}/login?error=${info.message}`)
        }
        for(let i = 0; i < users.length ;i++){
            const user = users[i]
            if ( user.type === "client" && user.project_id === req.params.project_uid) {
                return req.login(user, loginErr => {
                    if (loginErr) {
                        return next(loginErr);
                    } else {
                        return db.modify("client", {
                            last_sign_in : getCurrentTime()
                        }, "id", user.id, () => {
                            return res.redirect(`/p/${req.params.project_uid}/home?success=login`)
                        })
                    }
                }); 
            }
        }
        if (users.length != 0) {
            return res.redirect(`/p/${req.params.project_uid}/login?error=not_user_login`)
        } else {
            return res.redirect(`/p/${req.params.project_uid}/login/?error=internal_error`)
        }
    })(req, res, next);
});

router.get('/register', function (req, res) {
    const toSend = createMessage(req.query)
    res.render(dir + 'register.html', toSend)
})

router.get('/logout', function (req, res) {
    req.logOut()
    res.redirect('/finder?info=logout')
})

router.post('/register', async function(req, res, next) {
    let hashedPassword = await bcrypt.hash(req.body.password, 10)
    let userId = uuidv4()
    let userPw = copySchema(userPwSchema)
    userPw.user_id = userId
    userPw.type = "dev"
    userPw.hashed_password = hashedPassword
    db.add("pw", userPw, (err, result) => {
        if (err){
            res.redirect("/error/500?error=register")
        } else {
            let user = copySchema(devSchema)
            user.id = userId
            user.email = req.body.email
            user.name = req.body.name
            user.time_created = getCurrentTime()
            db.add("dev", user, (err, result) => {
                if (err){
                    res.redirect("/error/500?error=register")
                } else {
                    user.type = "dev"
                    console.log(user)
                    axios({
                        method: 'POST',
                        url: "https://hook.integromat.com/dgcy9x2pn9t8awxj495ds8e7rln2kg4x",
                        data: user
                    })
                    console.log("here")
                    res.redirect("/account/login?success=register")
                }
            })
        }
    })
});

router.post('/register/:project_uid', async function(req, res, next) {
    let hashedPassword = await bcrypt.hash(req.body.password, 10)
    let userId = uuidv4()
    let userPw = copySchema(userPwSchema)
    userPw.user_id = userId
    userPw.type = "client"
    userPw.hashed_password = hashedPassword
    db.add("pw", userPw, (err, result) => {
        if (err){
            console.log(err)
            res.redirect("/error/500?error=register")
        } else {
            let user = copySchema(clientSchema)
            user.id = userId
            user.email = req.body.email
            user.name = req.body.name
            user.project_id = req.params.project_uid
            user.time_created = getCurrentTime()
            db.add("client", user, (err, result) => {
                if (err){
                    console.log(err)
                    res.redirect("/error/500?error=register")
                } else {
                    let newUserToSend = {}
                    newUserToSend.id = userId
                    newUserToSend.email = req.body.email
                    newUserToSend.name = req.body.name
                    newUserToSend.project_id = req.params.project_uid
                    newUserToSend.time_stamp = Number(new Date())
                    db.getXbyY("project", "uid", req.params.project_uid, (err, result) => {
                        if (err){
                            res.redirect("/error/500?error=register")
                        } else {
                            axios({
                                method: 'POST',
                                url: result[0].new_user_webhook,
                                data: newUserToSend
                            })
                            newUserToSend.type = "client"
                            axios({
                                method: 'POST',
                                url: "https://hook.integromat.com/dgcy9x2pn9t8awxj495ds8e7rln2kg4x",
                                data: newUserToSend
                            })
                            res.redirect(`/p/${req.params.project_uid}/login?success=register`)
                        }
                    })
                }
            })
        }
    })
});

module.exports = router