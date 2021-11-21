require('dotenv').config();
var axios = require('axios')
const querystring = require('querystring');
var path = require('path');

const {
    apiSchema,
    projectSchema,
    pageSchema,
    inputSchema,
    logSchema,
    dashboardItemSchema,
    itemInputSchema,
    itemLocationSchema,
    headersSchema,
    itemHeadersSchema,
    clientPlanSchema,
    clientPlanItemSchema,
    clientCreditSchema,
    batchConfigSchema,
    batchInputSchema,
    batchHeaderSchema
  } = require('../packages/schema')
  
const {
    copySchema,
    getCurrentTime,
    delay
} = require('../packages/util')

const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const mdDir = __dirname + `/../public/pages/client/md/`
const resultBatchDir = __dirname + `/../batch/result/`
const batchHandler = require('../packages/batchHandler/batchHandler')
const bh = new batchHandler()

const stripeHandler = require('../packages/stripeHandler/stripeHandler')

const stripe = new stripeHandler()

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
  console.log("SUCCESS CONNECT TO DB FROM /db")
}catch(e){
  console.log(`FAILED TO LOAD DB`)
  console.log(e)
  process.exit()
}

var express = require('express');
const { whiteListedProjectPath } = require('../packages/constant');
var router = express.Router()

router.use('/', function (req, res, next){
    if (!req.user){
        res.redirect("/")
    } else {
        next()
    }
})


router.post('/dev/add/api', function (req, res){
    const api = copySchema(apiSchema)
    api.id = uuidv4()
    api.name = req.body.name
    api.endpoint = req.body.endpoint
    api.dev_id = req.user.id
    api.method = req.body.method
    api.output_type = req.body.output_type
    db.add("api", api, (err, result) => {
        if (err){
            console.error(err)
            res.redirect('/error/500')
        } else {
            api.type = "api"
            axios({
                method: 'POST',
                url: "https://hook.integromat.com/dgcy9x2pn9t8awxj495ds8e7rln2kg4x",
                data: api
            })
            res.redirect('/dev/api?success=create_api')
        }
    })
})

router.post('/dev/add/log', function (req, res){
    let input = {}
    try {
        input = JSON.parse(Object.keys(req.body)[0])
        const log = copySchema(logSchema)
        log.id = uuidv4()
        log.client_id = input.client_id
        log.api_id = input.api_id
        log.dev_id = input.dev_id
        log.project_id = input.project_id
        log.timestamp = Math.round(Number(new Date) / 1000)
        log.status = input.status
        if (input.client_id && (log.status == 200 || log.status == 300)){
            db.decrementCreditUser(input.client_id, input.api_id, (err, result) => {
                if (err){
                    console.error(err)
                }
            })
        }
        db.add("log", log, (err, result) => {
            if (err){
                console.error(err)
            }
        })
    } catch (e){
        console.error(e)
    }
})

router.post('/dev/add/project', function (req, res){
    const project = copySchema(projectSchema)
    if (req.body.uid == ""){
        res.redirect('/error/500?error=internal_error')
    } else {
        project.uid = req.body.uid
        project.name = req.body.name
        project.description = req.body.description
        project.new_user_webhook = req.body.new_user_webhook
        project.icon = req.body.icon
        project.time_created = getCurrentTime()
        project.dev_id = req.user.id
        db.add("project", project, (err, result) => {
            if (err){
                console.error(err)
                res.redirect('/error/500')
            } else {
                project.type = "project"
                axios({
                    method: 'POST',
                    url: "https://hook.integromat.com/dgcy9x2pn9t8awxj495ds8e7rln2kg4x",
                    data: project
                })
                res.redirect('/dev/project?success=create_project')
            }
        })
    }
})

router.post('/dev/add/plan/:project_uid', function (req, res){
    const plan = copySchema(clientPlanSchema)
    plan.id = uuidv4()
    plan.label = req.body.label
    plan.price = req.body.price
    plan.description = req.body.description
    plan.project_id = req.params.project_uid
    db.add("client_plan", plan, (err, result) => {
        if (err){
            console.error(err)
            res.redirect('/error/500?error=internal_error')
        } else {
            stripe.addPlanAsStripeProduct(plan, (err) => {
                if (err) {
                    res.redirect('/error/500?error=internal_error')
                } else {
                    res.redirect(`/p/${req.params.project_uid}/manage/modify/plan/${plan.id}?success=create_plan`)
                }
            })
        }
    })
})

router.post('/dev/edit/plan/:project_uid', function (req, res){
    const plan = copySchema(clientPlanSchema)
    plan.id = req.body.id
    plan.label = req.body.label
    plan.price = req.body.price
    plan.description = req.body.description
    plan.project_id = req.params.project_uid
    db.modify("client_plan", plan, "id", plan.id, (err, result) => {
        if (err){
            console.error(err)
            res.redirect('/error/500?error=internal_error')
        } else {
            stripe.modifyPlan(plan, (err) => {
                if (err) {
                    res.redirect('/error/500?error=internal_error')
                } else {
                    res.redirect(`/p/${req.params.project_uid}/manage?success=modify_plan`)
                }
            })
        }
    })
})

router.post('/dev/add/plan/:project_uid/:plan_id/api', function (req, res){
    db.remove("client_plan_item", "plan_id", req.params.plan_id, (err, result) => {
        const api = Object.keys(req.body)
        for (let i = 0 ; i < api.length ; i++){
            if (api[i].includes("api")){
                const n = api[i].replace("api-", "")
                const clientPlanItem = copySchema(clientPlanItemSchema)
                clientPlanItem.id = req.body[`id-${n}`]
                    ? req.body[`id-${n}`]
                    : uuidv4()
                clientPlanItem.plan_id = req.params.plan_id
                clientPlanItem.description = req.body[`description-${n}`]
                clientPlanItem.credit = req.body[`limit-${n}`]
                clientPlanItem.api_id = req.body[api[i]]
                db.add("client_plan_item", clientPlanItem, (err, result) => {
                    if (err){
                        console.log(err)
                        res.redirect('/error/500?error=internal_error')
                    }
                })
            }
        }
        res.redirect(`/p/${req.params.project_uid}/manage?success=modify_plan`)
    })
})


router.post('/dev/delete/plan/:project_uid/:plan_id', function (req, res){
    db.remove("client_plan", "id", req.params.plan_id, (err, result) => {
        if (err){
            res.redirect(`/error/500?error=internal_error`)
        } else {
            res.redirect(`/p/${req.params.project_uid}/manage?success=delete_plan`)
        }
    })
})

router.get('/dev/get/plan/:project_uid', function (req, res){
    db.getProjectPlan(req.params.project_uid, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/process/:page_id', function (req, res){
    db.getAllProcessesOfPage(req.params.page_id, req.user.id, (err, result) => {
        res.json(result)
    })
})

router.get('/dev/get/batch/:process_id/config', function (req, res){
    db.getBatchProcessDetail(req.params.process_id, (err, result)=>{
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/batch/:process_id/content', function (req, res){
    bh.readUploadedBatchAsJson(req.params.process_id, (result) => {
        res.json({
            result
        })
    })
})

router.post('/dev/modify/batch/:process_id/status/:new_status', function (req, res){
    const modifyProcess = {
        status : req.params.new_status
    }
    if (req.params.new_status == 2){
        modifyProcess.time_finished = getCurrentTime()
    }
    db.modify("batch_process", modifyProcess, "id", req.params.process_id, (err, result) => {
        if (err){
            console.log(err)
        }
    })
})

router.get('/dev/get/batch/:process_id', function (req, res){
    db.getXbyY("batch_process", "id", req.params.process_id, (err, result)=>{
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.post('/dev/process/batch/:process_id', function (req, res){
    bh.readUploadedBatchAsJson(req.params.process_id, (uploadedData) => {
        db.getBatchProcessDetail(req.params.process_id, (err, batchDetail)=>{
            db.getXbyY("api", "id", batchDetail.api_id, async (err, result) => {
                const apiDetail = result[0]
                for(let i = 0 ; i < uploadedData.length ; i++){
                    let curParams = {}
                    let curHeader = {}
                    for (let j = 0 ; j < batchDetail.input.length ; j++){
                        const keyItem = batchDetail.input[j].key_item
                        curParams[`${keyItem}`] = uploadedData[i][keyItem] 
                            ? uploadedData[i][keyItem]
                            : batchDetail.input[j].default_value
                    }
                    for (let j = 0 ; j < batchDetail.header.length ; j++){
                        const keyItem = batchDetail.header[j].key_item
                        curHeader[`${keyItem}`] = uploadedData[i][keyItem] 
                            ? uploadedData[i][keyItem]
                            : batchDetail.header[j].default_value
                    }
                    await delay(3000)
                    let newRow = {}
                    if (apiDetail.method === "POST") {
                        newRow = await axios({
                            method: apiDetail.method,
                            url: apiDetail.endpoint,
                            data: curParams,
                            headers: curHeader
                        }).then((response) => {
                            return response.data
                        })
                    } else if (apiDetail.method === "GET"){
                        newRow = await axios({
                            method: apiDetail.method,
                            url: apiDetail.endpoint,
                            params: curParams,
                            headers: curHeader
                        }).then((response) => {
                            return response.data
                        })
                    }
                    await db.decrementCreditUser(req.user.id, apiDetail.id, () => {})
                    bh.addResultBatch(req.params.process_id, newRow, (err) => {
                        if (err){
                            console.log(err)
                            res.json({success:false})
                        }
                    })
                }
                res.json({success:true})
            })
        })
    })
})

router.get('/dev/get/batch/:process_id/download', function (req, res){
    res.sendFile(path.resolve(`${resultBatchDir}${req.params.process_id}.csv`))
})


router.get('/dev/get/plan/:project_uid/:plan_id', function (req, res){
    db.getXbyY("client_plan", "id", req.params.plan_id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/plan/:project_uid/:plan_id/api', function (req, res){
    db.getXbyY("client_plan_item", "plan_id", req.params.plan_id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.post('/dev/add/page/:project_uid', function (req, res){
    const page = copySchema(pageSchema)
    if (req.body.path == ""){
        res.redirect('/error/500?error=internal_error')
    } else {
        page.id = uuidv4()
        page.project_id = req.params.project_uid
        page.path = req.body.path
        page.name = req.body.name
        page.icon = req.body.icon
        page.time_created = getCurrentTime()
        page.type = req.body.type
        db.add("page", page, (err, result) => {
            if (err){
                console.error(err)
                res.redirect('/error/500')
            } else {
                res.redirect(`/p/${req.params.project_uid}/admin/modify/${page.id}?success=create_page`)
            }
        })
    }
})

router.get('/dev/check/is-project-uid-available', function (req, res){
    if (whiteListedProjectPath.includes(req.query.uid)){
        res.json({
            available : false
        })
    } else {
        db.getXbyY("project", "uid", req.query.uid, (err, result) => {
            if (err){
                res.json({
                    error : err
                })
            } else {
                if (result.length == 0){
                    res.json({
                        available : true
                    })
                } else {
                    res.json({
                        available : false
                    })
                }
            }
        })
    }
})
router.get('/dev/check-available-credit/:api_id/:user_id', function (req, res){
    db.checkUserAvailableCredit( req.params.api_id, req.params.user_id, req.user.plan_id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json(result)
        }
    })
})


router.get('/dev/check/is-page-path-available', function (req, res){
    if (whiteListedProjectPath.includes(req.query.uid)){
        res.json({
            available : false
        })
    } else {
        db.getXbyY("page", "project_id", req.query.project_uid, (err, result) => {
            if (err){
                res.json({
                    error : err
                })
            } else {
                if (result.length == 0){
                    res.json({
                        available : true
                    })
                } else {
                    let available = true
                    for (let i = 0 ; i< result.length ; i++){
                        if (result[i].path == req.query.path){
                            available = false
                        }
                    }
                    res.json({
                        available
                    })
                }
            }
        })
    }
})

router.get('/dev/get/:project_uid/page', function (req, res){
    db.getXbyY("page", "project_id", req.params.project_uid, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})


router.post('/client/edit/plan', function (req, res){
    let planId = JSON.parse(Object.keys(req.body)[0])
    db.modify("client", planId, "id", req.user.id, (err, result) => {
        if (err) {
            res.json({
                success : false
            })
        } else {
            db.getXbyY("client_plan_item", "plan_id", planId.plan_id, (err, result) => {
                if (err){
                    res.json({
                        success : false
                    })
                } else {
                    for (let i = 0 ; i < result.length ; i++){
                        const clientCredit = copySchema(clientCreditSchema)
                        clientCredit.client_id = req.user.id
                        clientCredit.api_id = result[i].api_id
                        clientCredit.credit = result[i].credit
                        db.add("client_credit", clientCredit, (err, result) => {
                            if (err){
                                console.log(err)
                            }
                        })
                    }
                    res.json({
                        success : true
                    })
                }
            })
        }
    })
})

router.post('/dev/edit/page/:project_uid/:page_id', function (req, res){
    db.modify("page", req.body, "id", req.body.id, (err, result) => {
        if (err) {
            res.redirect("/error/500?error=internal_error")
        } else {
            res.redirect(`/p/${req.params.project_uid}/admin?success=modify_page_detail`)
        }
    })
})

router.post('/dev/edit/new_user_webhook/:project_uid', function (req, res){
    db.modify("project", req.body, "uid", req.params.project_uid, (err, result) => {
        if (err) {
            res.redirect("/error/500?error=modify_page_webhook")
        } else {
            res.redirect(`/p/${req.params.project_uid}/manage?success=modify_page_webhook`)
        }
    })
})

router.post('/dev/edit/page/:project_uid/:page_id/playground', function (req, res){
    let keys = Object.keys(req.body)
    db.remove("input", "page_id", req.params.page_id, (err, result) => {
        db.remove("headers", "page_id", req.params.page_id, (err, result) => {
            for (let i = 0; i < keys.length ; i++){
                if (keys[i].includes("key-")){
                    if (keys[i].includes("header")){
                        const headers = copySchema(headersSchema)
                        headers.page_id = req.params.page_id
                        headers.key_header = req.body[keys[i]]
                        db.add("headers", headers, (err, result) => {
                            if(err){
                                res.redirect("/error/500?error=modify_error_header")
                            }
                        })
                    } else {
                        let n_keys = keys[i].replace("key-", "")
                        const input = copySchema(inputSchema)
                        input.page_id = req.params.page_id
                        input.name = req.body[`key-${n_keys}`]
                        input.label = req.body[`label-${n_keys}`]
                        input.type = req.body[`type-of-value-${n_keys}`]
                        db.add("input", input, (err, result) => {
                            if(err){
                                res.redirect("/error/500?error=modify_error_input")
                            }
                        })
                    }
                }
            }
            db.remove("playground", "page_id", req.params.page_id, (err, result) => {
                db.add("playground", {
                    page_id : req.params.page_id,
                    api_id : req.body.api
                }, (err, result) => {
                    res.redirect(`/p/${req.params.project_uid}/admin?success=modify_playground_content`)
                })
            })
        })
    })
})


router.post('/dev/edit/page/:project_uid/:page_id/batch', function (req, res){
    db.remove("batch_config", "page_id", req.params.page_id, (err, result) => {
        const batchConfig = copySchema(batchConfigSchema)
        batchConfig.id = uuidv4()
        batchConfig.page_id = req.params.page_id
        batchConfig.api_id = req.body.api
        batchConfig.heading = req.body.heading
        batchConfig.subheading = req.body.subheading
        batchConfig.check_credit_before_run = req.body.check_credit_before_run === 'on'
            ? true
            : false
        db.add("batch_config", batchConfig, (err, result) => {
            db.remove("batch_input", "page_id", req.params.page_id, (err, result) => {
                db.remove("batch_header", "page_id", req.params.page_id, (err, result) => {
                    let keys = Object.keys(req.body)
                    for (let i = 0 ; i < keys.length ; i++){
                        if (keys[i].includes("key-")){
                            const type = keys[i].includes("input-")
                                ? "input"
                                : "header"
                            const itemSchema = keys[i].includes("input-")
                                ? batchInputSchema
                                : batchHeaderSchema
                            const n = keys[i].replace(`key-${type}-`, "")
                            itemSchema.page_id = req.params.page_id
                            itemSchema.default_value = req.body[`default-value-${type}-${n}`]
                            itemSchema.key_item = req.body[`key-${type}-${n}`]
                            itemSchema.label = req.body[`label-${type}-${n}`]
                            db.add(`batch_${type}`, itemSchema, (err, result) => {
                                if(err){
                                    console.log(err)
                                }
                            })
                        }
                    }
                    res.redirect(`/p/${req.params.project_uid}/admin?success=modify_batch`)
                })
            })
        })
    })
})

router.post('/dev/edit/page/:project_uid/:page_id/dashboard-item', function (req, res){
    const dashboardItemId = {}
    const itemInputKeys = []
    let keys = Object.keys(req.body)
    db.remove("dashboard_item", "page_id", req.params.page_id, (err, result) => {
        for (let i = 0; i < keys.length ; i++){
            if (keys[i].includes("name-")){
                let n_keys = keys[i].replace("name-", "")
                const dashboardItem = copySchema(dashboardItemSchema)
                const id = uuidv4()
                dashboardItemId[n_keys] = id
                dashboardItem.id = id
                dashboardItem.page_id = req.params.page_id
                dashboardItem.name = req.body[`name-${n_keys}`]
                dashboardItem.description = req.body[`description-${n_keys}`]
                dashboardItem.api_id = req.body[`api-${n_keys}`]
                dashboardItem.color = req.body[`color-${n_keys}`]
                dashboardItem.row_id = req.body[`row-${n_keys}`]
                dashboardItem.width_in_percentage = req.body[`width-${n_keys}`]
                if (keys[i].includes(`id-${n_keys}`)) {
                    dashboardItem.id = req.body[`id-${n_keys}`]
                    dashboardItemId[n_keys] = dashboardItem.id
                    db.modify("dashboard_item", 
                        dashboardItem ,
                        "id", dashboardItem.id, (err, result) => {
                        if (err){
                            res.redirect("/error/500?error=modify_error_dashboard_item")
                        }
                    })
                } else {
                    db.add("dashboard_item", dashboardItem, (err, result) => {
                        if(err){
                            console.error(err)
                            res.redirect("/error/500?error=create_error_dashboard_item")
                        }
                    })
                }
            } else if (keys[i].includes("key-")){
                itemInputKeys.push(keys[i])
            }
        }
        db.remove("item_input", "page_id", req.params.page_id, (err, result) => {
            db.remove("item_headers", "page_id", req.params.page_id, (err, result) => {
                for (let i = 0 ; i < itemInputKeys.length ; i++){
                    if (itemInputKeys[i].includes("headers-")){
                        let n_keys = itemInputKeys[i].replace("key-headers-", "").split("-")[0]
                        const itemHeaders = copySchema(itemHeadersSchema)
                        itemHeaders.page_id = req.params.page_id
                        itemHeaders.item_id = dashboardItemId[n_keys]
                        itemHeaders.key_item = req.body[itemInputKeys[i]]
                        itemHeaders.value = req.body[`value-headers-${n_keys}-${itemInputKeys[i].replace("key-headers-").split("-")[1]}`]
                        db.add("item_headers", itemHeaders, (err, result) => {
                            if(err){
                                console.log(err)
                                res.redirect("/error/500?error=create_error_dashboard_item_headers")
                            }
                        })
                    } else {
                        let n_keys = itemInputKeys[i].replace("key-", "").split("-")[0]
                        const itemInput = copySchema(itemInputSchema)
                        itemInput.page_id = req.params.page_id
                        itemInput.item_id = dashboardItemId[n_keys]
                        itemInput.key_item = req.body[itemInputKeys[i]]
                        itemInput.value = req.body[`value-${n_keys}-${itemInputKeys[i].replace("key-").split("-")[1]}`]
                        db.add("item_input", itemInput, (err, result) => {
                            if(err){
                                console.log(err)
                                res.redirect("/error/500?error=create_error_dashboard_item_inputs")
                            }
                        })
                    }
                }
                res.redirect(`/p/${req.params.project_uid}/admin?success=modify_dashboard`)
            })
        })
    })
})


router.post('/dev/edit/page/:project_uid/:page_id/dashboard-item/location', function (req, res){
    db.remove("item_location", "page_id", req.params.page_id, (err, result) => {
        const config = JSON.parse(req.body.config)
        for (let i = 0 ; i< config.length; i++){
            db.add("item_location", config[i], (err, result) => {
                if(err){
                    console.log(err)
                    res.redirect("/error/500?error=modify_error_dashboard_item")
                }
            })
        }
        res.redirect(`/p/${req.params.project_uid}/${req.body.path}?success=modify_dashboard_content`)
    })
})
router.post('/dev/edit/page/:project_uid/:page_id/external-url', function (req, res){
    db.modify("page", {
        "external_url" : req.body.external_url
    },"id", req.params.page_id, (err, result) => {
        if (err){
            res.redirect("/error/500?error=modify_page_url")
        } else {
            res.redirect(`/p/${req.params.project_uid}/admin?success=modify_page_url`)
        }
    })
})

router.post('/dev/edit/page/:project_uid/:page_id/md', function (req, res){
    fs.writeFileSync(mdDir + `${req.params.page_id}.md`, req.body.md)
    res.redirect(`/p/${req.params.project_uid}/admin?success=modify_page_doc`)
})

router.post('/dev/edit/api/:api_id', function (req, res){
    db.modify("api",req.body, "id", req.params.api_id, (err, result) => {
        if (err){
            res.redirect(`/error/500?error=modify_api`)
        } else {
            res.redirect(`/dev/api?success=modify_api`)
        }
    })
})

router.get('/dev/get/api', function (req, res){
    db.getXbyY("api", "dev_id", req.user.id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/page/:project_uid', function (req, res){
    db.getXbyY("page", "project_id", req.params.project_uid, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})


router.get('/dev/get/page/:project_uid/:page_id', function (req, res){
    db.getXbyY("page", "id", req.params.page_id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/page/:project_uid/:page_id/md', function (req, res){
    try {
        const content = fs.readFileSync(mdDir + `${req.params.page_id}.md`).toString()
        if (content){
            res.json({
                content
            })
        } else {
            res.json({
                content : ""
            })
        }
    } catch (e) {
        res.json({
            error: e,
            content : ""
        })
    }
})

router.get('/dev/get/page/:project_uid/:page_id/api', function (req, res){
    try {
        db.getXbyY("playground", "page_id", req.params.page_id, (err, result) => {
            res.json({
                result
            })
        })
    } catch (e) {
        console.error(e)
        res.json({
            error: e
        })
    }
})

router.get('/dev/get/page/:project_uid/:page_id/batch-config', function (req, res){
    try {
        db.getXbyY("batch_config", "page_id", req.params.page_id, (err, result) => {
            res.json({
                result
            })
        })
    } catch (e) {
        console.error(e)
        res.json({
            error: e
        })
    }
})

router.get('/dev/get/page/:project_uid/:page_id/batch-input', function (req, res){
    try {
        db.getXbyY("batch_input", "page_id", req.params.page_id, (err, result) => {
            res.json({
                result
            })
        })
    } catch (e) {
        console.error(e)
        res.json({
            error: e
        })
    }
})

router.get('/dev/get/page/:project_uid/:page_id/batch-header', function (req, res){
    try {
        db.getXbyY("batch_header", "page_id", req.params.page_id, (err, result) => {
            res.json({
                result
            })
        })
    } catch (e) {
        console.error(e)
        res.json({
            error: e
        })
    }
})



router.get('/dev/get/page/:project_uid/:page_id/dashboard-item', function (req, res){
    try {
        db.getXbyY("dashboard_item", "page_id", req.params.page_id, (err, result) => {
            res.json({
                result
            })
        })
    } catch (e) {
        res.json({
            error: e
        })
    }
})

router.get('/dev/get/page/:project_uid/:page_id/dashboard-item-location', function (req, res){
    try {
        db.getXbyY("item_location", "page_id", req.params.page_id, (err, result) => {
            res.json({
                result
            })
        })
    } catch (e) {
        res.json({
            error: e
        })
    }
})

router.get('/dev/get/page/:project_uid/:page_id/dashboard-item/:item_id/input', function (req, res){
    try {
        db.getXbyY("item_input", "item_id", req.params.item_id, (err, result) => {
            res.json({
                result
            })
        })
    } catch (e) {
        console.error(e)
        res.json({
            error: e
        })
    }
})

router.get('/dev/get/page/:project_uid/:page_id/dashboard-item/:item_id/headers', function (req, res){
    try {
        db.getXbyY("item_headers", "item_id", req.params.item_id, (err, result) => {
            res.json({
                result
            })
        })
    } catch (e) {
        console.error(e)
        res.json({
            error: e
        })
    }
})

router.get('/dev/get/page/:project_uid/:page_id/input', function (req, res){
    try {
        db.getXbyY("input", "page_id", req.params.page_id, (err, result) => {
            res.json({
                result
            })
        })
    } catch (e) {
        console.error(e)
        res.json({
            error: e
        })
    }
})

router.get('/dev/get/page/:project_uid/:page_id/headers', function (req, res){
    try {
        db.getXbyY("headers", "page_id", req.params.page_id, (err, result) => {
            res.json({
                result
            })
        })
    } catch (e) {
        console.error(e)
        res.json({
            error: e
        })
    }
})


router.get('/dev/get/project', function (req, res){
    db.getXbyY("project", "dev_id", req.user.id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/project/:project_uid/dashboard/log', function (req, res){
    db.getAllLogByProjectUid(req.params.project_uid, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})
router.get('/dev/get/project/:project_uid/available-api', function (req, res){
    db.getAvailableApiInProject(req.params.project_uid, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            //TODO to fetch unique api id in every plan
            res.json({
                available_api : result
            })
        }
    })
})

router.post('/dev/delete/api/:api_id', function (req, res){
    db.remove("api", "id", req.params.api_id, (err, result) => {
        if (err){
            res.redirect(`/error/500?error=delete_api`)
        } else {
            res.redirect(`/dev/api?success=delete_api`)
        }
    })
})
router.post('/dev/delete/page/:project_uid/:page_id', function (req, res){
    db.remove("page", "id", req.params.page_id, (err, result) => {
        if (err){
            res.redirect(`/error/500?error=delete_page`)
        } else {
            res.redirect(`/p/${req.params.project_uid}/admin?success=delete_page`)
        }
    })
})

router.post('/dev/delete/project/:project_uid', function (req, res){
    db.remove("project", "uid", req.params.project_uid, (err, result) => {
        if (err){
            res.redirect(`/error/500?error=delete_project`)
        } else {
            res.redirect(`/dev?success=delete_project`)
        }
    })
})

router.get('/dev/get/api/:api_id', function (req, res){
    db.getXbyY("api", "id", req.params.api_id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})


router.get('/dev/get/log', function (req, res){
    let n = req.query.n ? req.query.n : 10
    let offset = req.query.offset ? req.query.offset : 0
    db.getAllLogByDevId(req.user.id, n, offset, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/users', function (req, res){
    db.getUsersOfDevProject(req.user.id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/users/log/:user_id', function (req, res){
    db.getXbyY("log", "client_id", req.params.user_id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/users/log/:user_id/:api_id', function (req, res){
    db.getUserLog(req.params.user_id, req.params.api_id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/users/credit', function (req, res){
    db.getXbyY("client_credit", "client_id", req.user.id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/users-summary/:project_uid', function (req, res){
    db.getUsersOfProjectLog(req.params.project_uid, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            db.getRowCountWhereY("client", "project_id", req.params.project_uid, (err, count) => {
                if (err){
                    res.json({
                        error : err
                    })
                } else {
                    res.json({
                        result,
                        count : count[0].count
                    })
                }
            })
                
        }
    })
})

router.get('/dev/get/users/:project_uid', function (req, res){
    db.getUsersOfProject(req.params.project_uid, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})


router.get('/dev/get/log/:api_id', function (req, res){
    db.getXbyY("log", "api_id", req.params.api_id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})

router.get('/dev/get/log/:api_id/n', function (req, res){
    db.getRowCountWhereY("log", "api_id", req.params.api_id, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})


router.get('/dev/get/page/:project_uid', function (req, res){
    db.getXbyY("page", "project_id", req.params.project_uid, (err, result) => {
        if (err){
            res.json({
                error : err
            })
        } else {
            res.json({
                result
            })
        }
    })
})


module.exports = router