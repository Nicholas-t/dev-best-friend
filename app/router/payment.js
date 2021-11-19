require('dotenv').config();

var express = require('express')
var axios = require('axios')
var axios = require('axios')
var stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

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
    db.getXbyY("client_plan", "id", req.params.plan_id, async (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            //http://127.0.0.1:7000/p/faruse/choose-plan?info=choose_plan
            if (result.length == 0){
                res.json({
                    error : "Plan not found"
                })
            } else {
                const planDetail = result[0]
                const session = await stripe.checkout.sessions.create({
                    payment_method_types : ['card'],
                    mode : 'payment',
                    line_items : [
                        {
                            price_data : {
                                currency : 'eur',
                                product_data : {
                                    name : `${req.params.project_uid} - ${planDetail.label} Plan - 1 month`
                                },
                                unit_amount : planDetail.price * 100
                            },
                            quantity : 1
                        }
                    ],
                    success_url : `${process.env.DOMAIN}/payment/${req.params.project_uid}/plan/${req.params.plan_id}/success`,
                    cancel_url : `${process.env.DOMAIN}/p/${req.params.project_uid}/choose-plan?info=no_plan_selected`
                })
                res.json({
                    result,
                    url : session.url
                })
            }
        }
    })
})


router.get(`/:project_uid/plan/:plan_id/success`, function (req, res, next) {
    let planId = {
        plan_id : req.params.plan_id
    }
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
    
})


module.exports = router