require('dotenv').config();
var axios = require('axios')
const querystring = require('querystring');

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
    clientPlanSchema
  } = require('../packages/schema')
  
const {
    encrypt,
    decrypt,
    copySchema,
    getCurrentTime
} = require('../packages/util')

const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const mdDir = __dirname + `/../public/pages/client/md/`

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
        db.add("log", log, (err, result) => {
            res.json({
                error : err
            })
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
                res.redirect('/dev/project?success=create_project')
            }
        })
    }
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


router.post('/dev/edit/page/:project_uid/:page_id', function (req, res){
    db.modify("page", req.body, "id", req.body.id, (err, result) => {
        if (err) {
            res.redirect("/error/500")
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