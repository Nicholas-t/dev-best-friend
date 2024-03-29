const { planPriceStripeSchema, checkoutStripeSchema, userSubscriptionStripeSchema } = require('../schema');
const { copySchema, getCurrentTime } = require('../util');
const schedule = require('node-schedule');

require('dotenv').config();

let db = null

try{
  const databaseHandler = require('../db/db');
  db = new databaseHandler();
  const sqlConf = {
    "host" : process.env.MY_SQL_HOST || "localhost",
    "user" : process.env.MY_SQL_USER || "root",
    "password" : process.env.MY_SQL_PWD || "1717",
    connectTimeout: 30000
  }
  db.start(sqlConf)
  console.log("SUCCESS CONNECT TO DB FROM stripeHandler.js")
}catch(e){
  console.log(`FAILED TO LOAD DB`)
  console.log(e)
  process.exit()
}

var stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

class stripeHandler {
	/**
	 * @constructor
	 */
	constructor() {
        this.description = 'Helper for operation dealing with stripe processes';
    }

    async initializeSchedule(){
        db.getAllUserSubscription(async (err, result)=>{
            if (err){
                console.log(err)
            } else {
                for (let i = 0 ; i < result.length ; i++){
                    if (result[i].subscription_id !== ""){
                        const subscription = await stripe.subscriptions.retrieve(
                            result[i].subscription_id
                        );
                        if (subscription.status === "active") {
                            let date = new Date((subscription.current_period_end + 60 * 60 * 2)* 1000)
                            let cron = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate() === 31 
                                ? 30
                                : date.getDate()} * *`
                            schedule.scheduleJob(cron, function(){
                                db.refreshUsersCredit(result[i].user_id)
                            });
                        }
                    }
                }
            }
        })
    }

    async addPlanAsStripeProduct(planItem, cb) {
        try {
            const product = await stripe.products.create({
                name: `${planItem.project_id} - ${planItem.label}`,
                description : planItem.description
            });
            const price = await stripe.prices.create({
                unit_amount: planItem.price * 100,
                currency: 'eur',
                recurring: {interval: 'month'},
                product: product.id,
            });
            const planPrice = copySchema(planPriceStripeSchema)
            planPrice.plan_id = planItem.id
            planPrice.product_stripe_id = product.id
            planPrice.price_stripe_id = price.id
            db.add("plan_price_stripe", planPrice, cb)
        } catch (e){
            cb(e)
        }
    }

    modifyPlan(planItem, cb) {
        try {
            db.getXbyY("plan_price_stripe", "plan_id", planItem.id, async (err, result) => {
                if (err){
                    cb(err)
                } else if (result.length == 0) {
                    cb("Cannot find plan in stripe")
                } else {
                    const planPriceStripe = result[0]
                    const product = await stripe.products.update(
                        planPriceStripe.product_stripe_id,
                        {
                            name: `${planItem.project_id} - ${planItem.label}`,
                            description : planItem.description
                        }
                    );
                    const price = await stripe.prices.create({
                        unit_amount: planItem.price * 100,
                        currency: 'eur',
                        recurring: {interval: 'month'},
                        product: product.id,
                    });
                    db.modify("plan_price_stripe", {
                        price_stripe_id : price.id
                    }, "plan_id", planItem.id, cb)
                }
            })
        } catch(e){
            cb(e)
        }
    }

    createCheckoutSession(projectUid, planId, userId, cb) {
        db.getXbyY("plan_price_stripe", "plan_id", planId, async (err, result) => {
            if (err){
                cb(err, null)
            } else {
                if (result.length == 0){
                    cb("Plan not found", null)
                } else {
                    const planPriceStripe = result[0]
                    let currentTime = getCurrentTime()
                    const session = await stripe.checkout.sessions.create({
                        payment_method_types : ['card'],
                        mode : 'subscription',
                        line_items : [
                            {
                                price : planPriceStripe.price_stripe_id,
                                quantity : 1
                            }
                        ],
                        success_url : `${process.env.DOMAIN}/payment/${projectUid}/plan/${planId}/${currentTime}/success`,
                        cancel_url : `${process.env.DOMAIN}/p/${projectUid}/choose-plan?info=no_plan_selected`
                    })
                    const checkoutStripe = copySchema(checkoutStripeSchema);
                    checkoutStripe.time_created = currentTime
                    checkoutStripe.session_id = session.id
                    checkoutStripe.user_id = userId
                    db.add("checkout_stripe",checkoutStripe, (err, result) => {
                        if (err){
                            cb(err, null)
                        } else {
                            cb(null, session)
                        }
                    } )
                }
            }
        })
    }

    createChangePlanSession(projectUid, planId, userId, cb) {
        db.getXbyY("plan_price_stripe", "plan_id", planId, async (err, result) => {
            if (err){
                cb(err, null)
            } else {
                if (result.length == 0){
                    cb("Plan not found", null)
                } else {
                    const planPriceStripe = result[0]
                    let currentTime = getCurrentTime()
                    const session = await stripe.checkout.sessions.create({
                        payment_method_types : ['card'],
                        mode : 'subscription',
                        line_items : [
                            {
                                price : planPriceStripe.price_stripe_id,
                                quantity : 1
                            }
                        ],
                        success_url : `${process.env.DOMAIN}/payment/${projectUid}/plan/change/${planId}/${currentTime}/success`,
                        cancel_url : `${process.env.DOMAIN}/p/${projectUid}/home`
                    })
                    const checkoutStripe = copySchema(checkoutStripeSchema);
                    checkoutStripe.time_created = currentTime
                    checkoutStripe.session_id = session.id
                    checkoutStripe.user_id = userId
                    db.add("checkout_stripe",checkoutStripe, (err, result) => {
                        if (err){
                            cb(err, null)
                        } else {
                            cb(null, session)
                        }
                    } )
                }
            }
        })
    }

    
    async handleCheckoutSession(sessionId, userId, cb){
        try {
            const session = await stripe.checkout.sessions.retrieve(
                sessionId
            );
            if(session.payment_status == 'paid'){
                const userSubscriptionStripe = copySchema(userSubscriptionStripeSchema)
                userSubscriptionStripe.user_id = userId
                userSubscriptionStripe.subscription_id = session.subscription
                db.add("user_subscription_stripe", userSubscriptionStripe, (err, result) => {
                    if (err){
                        console.log(err)
                        cb(false)
                    } else {
                        cb(true)
                    }
                })
            } else {
                console.log("UNPAID")
                cb(false)
            }
        } catch (e) {
            console.log(e)
            cb(false)
        }
    }

    async changeUserPlan(sessionId, userId, cb){
        try {
            const session = await stripe.checkout.sessions.retrieve(
                sessionId
            );
            if(session.payment_status == 'paid'){
                db.getXbyY("user_subscription_stripe", "user_id", userId, async (err, result) => {
                    if (err){
                        console.log(err)
                        cb(false)
                    } else {
                        if (result.length > 0){
                            const oldSubscriptionId = result[0].subscription_id
                            if (oldSubscriptionId !== ""){
                                await stripe.subscriptions.del(
                                    oldSubscriptionId
                                );
                            }
                            db.modify("user_subscription_stripe", {subscription_id: session.subscription},
                            "user_id",userId, (err, result) => {
                                if (err){
                                    console.log(err)
                                    cb(false)
                                } else {
                                    cb(true)
                                }
                            })
                        } else {
                            const userSubscriptionStripe = copySchema(userSubscriptionStripeSchema)
                            userSubscriptionStripe.user_id = userId
                            userSubscriptionStripe.subscription_id = session.subscription
                            db.add("user_subscription_stripe", userSubscriptionStripe, (err, result) => {
                                if (err){
                                    console.log(err)
                                    cb(false)
                                } else {
                                    cb(true)
                                }
                            })
                        }
                    }
                })
            } else {
                console.log("UNPAID")
                cb(false)
            }
        } catch (e) {
            console.log(e)
            cb(false)
        }
    }

    async userUnsubscribe(userId, cb){
        db.getXbyY("user_subscription_stripe", "user_id", userId, async (err, result) => {
            if (err){
                console.log(err)
                cb(false)
            } else {
                if (result.length > 0){
                    const oldSubscriptionId = result[0].subscription_id
                    await stripe.subscriptions.del(
                        oldSubscriptionId
                    );
                    db.modify("user_subscription_stripe", {subscription_id : ""}, "user_id", userId, (err, result) => {
                        if (err){
                            console.log(err)
                            cb(false)
                        } else {
                            cb(true)
                        }
                    })
                } else {
                    cb(false)
                }
            }
        })
    }
}

module.exports = stripeHandler;
