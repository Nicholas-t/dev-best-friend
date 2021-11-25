require('dotenv').config();

const {
    copySchema,
    getCurrentTime,
    createMessage,
    encrypt,
    decrypt
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

const mailHandler = require('../packages/mailer/mailer');
const mail = new mailHandler();

var express = require('express');
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

router.get('/forgot-password', function (req, res) {
    const toSend = createMessage(req.query)
    res.render(dir + 'forgotPassword.html', toSend)
})

router.get('/reset-password/:token', function (req, res) {
    try {
        const toSend = createMessage(req.query)
        const timestamp = Number(decrypt(req.params.token).split("|||||||")[1])
        if ((Math.round(Number(new Date()) / 1000)) - timestamp < 3600) {
            toSend.token = req.params.token
            res.render(dir + 'resetPassword.html', toSend)
        } else {
            res.redirect("/account/login?error=token_expired")    
        }
    } catch (e) {
        console.log(e)
        res.redirect("/account/login?error=internal_error")   
    }
})

router.get('/resend-activation', function (req, res) {
    const toSend = createMessage(req.query)
    res.render(dir + 'resendActivation.html', toSend)
})


router.post('/resend-activation', function (req, res) {
    db.getXbyY("dev", "email", req.body.email, (err, result) => {
        if (err){
            res.redirect("/account/login?error=internal_error")
        } else if (result.length == 0){
            res.redirect("/account/login?error=user_not_found")
        } else {
            const user = result[0]
            mail.sendMail(user.email, "resend_activation_link_dev", {
                email : user.email,
                id : user.id,
                name : user.name,
                domain : process.env.DOMAIN
            })
            res.redirect("/account/login?success=resend_activation")
        }
    })
})



router.post('/reset-password', function (req, res) {
    try {
        const token = decrypt(req.body.token)
        const timestamp = Number(token.split("|||||||")[1])
        if ((Math.round(Number(new Date()) / 1000)) - timestamp < 3600) {
            let email = token.split("|||||||")[0]
            db.getXbyY("dev", "email", email, async (err, result) => {
                if (err){
                    res.redirect("/account/login?error=internal_error")
                } else if (result.length == 0) {
                    res.redirect("/account/login?error=user_not_found")
                } else {
                    const dev = result[0]
                    const newPassword = await bcrypt.hash(req.body.new_password, 10)
                    db.modify("pw", {
                        hashed_password : newPassword
                    }, "user_id", dev.id, (err, result) => {
                        if (err){
                            res.redirect("/account/login?error=internal_error")
                        } else {
                            res.redirect("/account/login?success=reset_password_done")  
                        }
                    })
                }
            })
        } else {
            res.redirect("/account/login?error=token_expired")
        }
    } catch (e) {
        console.log(e)
        res.redirect("/account/login?error=internal_error")
    }
})


router.post('/reset-password/:project_id', function (req, res) {
    try {
        const token = decrypt(req.body.token)
        const timestamp = Number(token.split("|||||||")[1])
        if ((Math.round(Number(new Date()) / 1000)) - timestamp < 3600) {
            let email = token.split("|||||||")[0]
            db.getXbyY("client", "email", email, async (err, result) => {
                if (err){
                    res.redirect(`/p/${req.params.project_id}/login?error=internal_error`)    
                } else if (result.length == 0) {
                    res.redirect(`/p/${req.params.project_id}/login?error=user_not_found`)      
                } else {
                    for (let i = 0 ; i < result.length ; i ++){
                        const client = result[i]
                        const newPassword = await bcrypt.hash(req.body.new_password, 10)
                        if (client.project_id === req.params.project_id){
                            db.modify("pw", {
                                hashed_password : newPassword
                            }, "user_id", client.id, (err, result) => {
                                if (err){
                                    res.redirect(`/p/${req.params.project_id}/login?error=internal_error`)    
                                } else {
                                    res.redirect(`/p/${req.params.project_id}/login?success=reset_password_done`)     
                                }
                            })
                        }
                    }
                }
            })
        } else {
            res.redirect("/account/login?error=token_expired")    
        }
    } catch (e) {
        console.log(e)
        res.redirect("/account/login?error=internal_error")   
    }
})

router.get('/activate/:user_type/:user_id', function (req, res) {
    if (req.params.user_type == "dev" || req.params.user_type == "client"){
        db.modify(req.params.user_type, {
            activated : 1
        }, "id", req.params.user_id, (err, result) => {
            if (err){
                res.redirect("/finder?error=internal_error")
            } else {
                res.redirect("/finder?success=activate")
            }
        })
    } else {
        res.redirect("/finder?error=internal_error")
    }
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
                if (user.activated !== 0){
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
                } else {
                    return res.redirect(`/account/login/?error=not_activated`)
                }
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
                if (user.activated !== 0){
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
                } else {
                    return res.redirect(`/p/${req.params.project_uid}/login?error=not_activated`)
                }
            }
        }
        if (users.length != 0) {
            return res.redirect(`/p/${req.params.project_uid}/login?error=not_user_login`)
        } else {
            return res.redirect(`/p/${req.params.project_uid}/login/?error=internal_error`)
        }
    })(req, res, next);
});


router.post('/forgot-password', function (req, res) {
    db.getXbyY("dev", "email", req.body.email, (err, result) => {
        if (err) {
            res.redirect("/account/login?error=internal_error")
        } else if (result.length == 0) {
            res.redirect("/account/login?error=user_not_found")
        } else {
            const dev = result[0]
            const timestamp = Math.round(Number(new Date()) / 1000)
            const token = encrypt(`${dev.email}|||||||${timestamp}`)
            mail.sendMail(dev.email, "reset_password_dev", {
                token,
                email : dev.email,
                name : dev.name,
                domain : process.env.DOMAIN
            })
            res.redirect("/account/login?success=reset_password")
        }
    })
})

router.post('/forgot-password/:project_id', function (req, res) {
    db.getXbyY("client", "email", req.body.email, (err, result) => {
        if (err) {
            res.redirect("/account/login?error=internal_error")
        } else if (result.length == 0) {
            res.redirect("/account/login?error=user_not_found")
        } else {
            for (let i = 0 ; i < result.length ; i ++){
                const client = result[i]
                if (client.project_id === req.params.project_id){
                    const timestamp = Math.round(Number(new Date()) / 1000)
                    const token = encrypt(`${client.email}|||||||${timestamp}`)
                    mail.sendMail(client.email, "reset_password_client", {
                        token,
                        email : client.email,
                        name : client.name,
                        project_id : client.project_id,
                        domain : process.env.DOMAIN
                    })
                    res.redirect("/account/login?success=reset_password")
                }
            }
        }
    })
})


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
                    axios({
                        method: 'POST',
                        url: "https://hook.integromat.com/dgcy9x2pn9t8awxj495ds8e7rln2kg4x",
                        data: user
                    })
                    mail.sendMail(user.email, "activate_post_register_dev", {
                        email : user.email,
                        id : user.id,
                        name : user.name,
                        domain : process.env.DOMAIN
                    })
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
                            if (result[0].new_user_webhook !== ""){
                                axios({
                                    method: 'POST',
                                    url: result[0].new_user_webhook,
                                    data: newUserToSend
                                })
                            }
                            newUserToSend.type = "client"
                            axios({
                                method: 'POST',
                                url: "https://hook.integromat.com/dgcy9x2pn9t8awxj495ds8e7rln2kg4x",
                                data: newUserToSend
                            })
                            mail.sendMail(newUserToSend.email, "activate_post_register_client", {
                                email : newUserToSend.email,
                                id : newUserToSend.id,
                                name : newUserToSend.name,
                                project_name : result[0].name,
                                domain : process.env.DOMAIN
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