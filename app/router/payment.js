require('dotenv').config();

var express = require('express')
const stripeHandler = require('../packages/stripeHandler/stripeHandler')

const stripe = new stripeHandler()

const {
    copySchema,
} = require('../packages/util')
const {
    clientCreditSchema,
} = require('../packages/schema')

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
  console.log("SUCCESS CONNECT TO DB FROM /payment for handling payments")
}catch(e){
  console.log(`FAILED TO LOAD DB`)
  console.log(e)
  process.exit()
}


var router = express.Router()
router.use('/', function (req, res, next){
    if (!req.user){
        res.redirect("/")
    } else {
        next()
    }
})

router.post(`/:project_uid/plan/:plan_id`, function (req, res, next) {
    stripe.createCheckoutSession(req.params.project_uid, req.params.plan_id, req.user.id, (err, session) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                url : session.url
            })
        }
    })
})


router.get(`/:project_uid/plan/:plan_id/:current_time/success`, function (req, res, next) {
    let planId = {
        plan_id : req.params.plan_id
    }
    db.getCheckout(req.params.current_time, req.user.id, (err, result) => {
        if (err){
            res.redirect(`/p/${req.params.project_uid}`)
        } else if (result.length == 0){
            res.redirect(`/p/${req.params.project_uid}`)
        } else {
            const checkoutStripe = result[0]
            stripe.handleCheckoutSession(checkoutStripe.session_id, req.user.id, (ok) => {
                if (ok){
                    db.modify("client", planId, "id", req.user.id, (err, result) => {
                        if (err){
                            res.redirect(`/p/${req.params.project_uid}`)
                        } else {
                            db.getXbyY("client_plan_item", "plan_id", planId.plan_id, async (err, result) => {
                                if (err){
                                    res.redirect(`/p/${req.params.project_uid}`)
                                } else {
                                    for (let i = 0 ; i < result.length ; i++){
                                        const clientCredit = copySchema(clientCreditSchema)
                                        clientCredit.client_id = req.user.id
                                        clientCredit.api_id = result[i].api_id
                                        clientCredit.credit = result[i].credit
                                        await db.add("client_credit", clientCredit, (err, result) => {
                                            if (err){
                                                console.log(err)
                                            }
                                        })
                                    }
                                    res.redirect(`/p/${req.params.project_uid}/home?success=plan_selected`)
                                }
                            })
                        }
                    })
                } else {
                    res.redirect(`/p/${req.params.project_uid}`)
                }
            })
        }
    })
})


module.exports = router