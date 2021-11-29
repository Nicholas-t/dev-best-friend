require('dotenv').config();
const fs = require('fs');
const {
    copySchema,
    createMessage,
    getCurrentTime,
    decrypt,
    encrypt
} = require('../packages/util')

const { v4: uuidv4 } = require('uuid');

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
  console.log("SUCCESS CONNECT TO DB FROM /p for fetching project data")
}catch(e){
  console.log(`FAILED TO LOAD DB`)
  console.log(e)
  process.exit()
}
const dir = __dirname + '/../public/pages/client/'
var express = require('express');
const { batchProcessSchema } = require('../packages/schema');
var router = express.Router()

router.use('/', function (req, res, next){
    let path = req.originalUrl.split("?")[0].split("/")
    if (!req.user && !path.includes("login") && !path.includes("register")
     && !path.includes("forgot-password") && !path.includes("reset-password")){
        if (path[2] !== "" && path[2]){
            res.redirect(`/p/${path[2]}/login`)
        } else {
            res.redirect('/finder')
        }
    } else {
        if (!res.locals.project && path[2] !== ""){
            let toChoosePlan = false
            if (req.user) {
                if (req.user.type == "client"){
                    toChoosePlan = req.user.plan_id == "" && path[3] !== "choose-plan"
                }
            }
            if (toChoosePlan) {
                res.redirect(`/p/${path[2]}/choose-plan?info=choose_plan`)
            } else {
                db.getXbyY("project", "uid", path[2], (err, result) => {
                    if (result.length == 0){
                        res.redirect("/error?error=internal_error")
                    } else {
                        res.locals.project = result[0]
                        next()
                    }
                })
            }
        } else {
            next()
        }
    }
})


router.get('/:project_uid', function (req, res){
    if (req.user){
        db.getXbyY("page", "project_id", req.params.project_uid, (err, result) => {
            if (result.length == 0) {
                res.redirect(`/error/500?error=internal_error`)
            } else {
                res.redirect(`/p/${req.params.project_uid}/home`)
            }
        })
    } else {
        res.redirect(`/p/${req.params.project_uid}/login`)
    }
})

router.get('/:project_uid/login', function (req, res){
    if (req.user){
        res.redirect(`/p/${req.params.project_uid}/home?success=login`)
    } else {
        let toSend = copySchema(res.locals.project)
        toSend = createMessage(req.query, toSend)
        res.render(dir + 'login.html', toSend)
    }
})


router.get('/:project_uid/forgot-password', function (req, res){
    if (req.user){
        res.redirect(`/p/${req.params.project_uid}/home`)
    } else {
        let toSend = copySchema(res.locals.project)
        toSend = createMessage(req.query, toSend)
        res.render(dir + 'forgotPassword.html', toSend)
    }
})

router.get('/:project_uid/reset-password/:token', function (req, res){
    try {
        let toSend = copySchema(res.locals.project)
        toSend = createMessage(req.query, toSend)
        const timestamp = Number(decrypt(req.params.token).split("|||||||")[1])
        if ((Math.round(Number(new Date()) / 1000)) - timestamp < 3600) {
            toSend.token = req.params.token
            res.render(dir + 'resetPassword.html', toSend)
        } else {
            res.redirect(`/p/${req.params.project_uid}/login?error=token_expired`)    
        }
    } catch (e) {
        console.log(e)
        res.redirect(`/p/${req.params.project_uid}/login?error=internal_error`)
    }
})

router.get('/:project_uid/choose-plan', function (req, res){
    let toSend = copySchema(res.locals.project)
    toSend = createMessage(req.query, toSend)
    toSend.user_id = req.user.id
    res.render(dir + 'choosePlan.html', toSend)
})


router.get('/:project_uid/home', function (req, res){
    let toSend = copySchema(res.locals.project)
    toSend = createMessage(req.query, toSend)
    toSend.user_id = req.user.id
    toSend.user_plan_id = req.user.plan_id
    toSend.user_email = req.user.email
    toSend.user_name = req.user.name
    toSend.apiKey = encrypt(`user|${req.user.id}`)
    res.render(dir + 'home.html', toSend)
})

router.get('/:project_uid/register', function (req, res){
    if (req.user){
        res.redirect(`/p/${req.params.project_uid}/home`)
    } else {
        let toSend = copySchema(res.locals.project)
        toSend = createMessage(req.query, toSend)
        res.render(dir + 'register.html', toSend)
    }
})

router.get('/:project_uid/admin', function (req, res){
    if (res.locals.project.dev_id == req.user.id){
        let toSend = copySchema(res.locals.project)
        toSend = createMessage(req.query, toSend)
        toSend.user_id = req.user.id
        res.render(dir + 'adminViewPages.html', toSend)
    } else {
        res.redirect(`/p/${req.params.project_uid}/home?error=unauthorized`)
    }
})

router.get('/:project_uid/admin/create', function (req, res){
    if (res.locals.project.dev_id == req.user.id){
        let toSend = copySchema(res.locals.project)
        toSend = createMessage(req.query, toSend)
        toSend.user_id = req.user.id
        res.render(dir + 'adminCreatePage.html', toSend)
    } else {
        res.redirect(`/p/${req.params.project_uid}/home?error=unauthorized`)
    }
})

router.get('/:project_uid/manage', function (req, res){
    if (res.locals.project.dev_id == req.user.id){
        let toSend = copySchema(res.locals.project)
        toSend = createMessage(req.query, toSend)
        toSend.user_id = req.user.id
        toSend.apiKey = encrypt(`dev|${req.params.project_uid}|${req.user.id}`)
        res.render(dir + 'adminManageProject.html', toSend)
    } else {
        res.redirect(`/p/${req.params.project_uid}/home?error=unauthorized`)
    }
})


router.post('/:project_uid/manage/logo', function (req, res){
    if (res.locals.project.dev_id == req.user.id){
        let file = req.files.file;
        if (file.size > 4000000){
            res.redirect(`/p/${req.params.project_uid}/manage?error=size_too_big`)
        } else {
            file.mv('./logos/' + req.params.project_uid + '.png', () => {
                res.redirect(`/p/${req.params.project_uid}/manage`)
            });
        }
    } else {
        res.redirect(`/p/${req.params.project_uid}/home?error=unauthorized`)
    }
})


router.get('/:project_uid/manage/create/plans', function (req, res){
    if (res.locals.project.dev_id == req.user.id){
        let toSend = copySchema(res.locals.project)
        toSend = createMessage(req.query, toSend)
        toSend.user_id = req.user.id
        res.render(dir + 'adminCreatePlan.html', toSend)
    } else {
        res.redirect(`/p/${req.params.project_uid}/home?error=unauthorized`)
    }
})

router.get('/:project_uid/manage/modify/plan/:plan_id', function (req, res){
    if (res.locals.project.dev_id == req.user.id){
        let toSend = copySchema(res.locals.project)
        toSend = createMessage(req.query, toSend)
        toSend.user_id = req.user.id
        db.getXbyY("client_plan", "id", req.params.plan_id, (err, result) => {
            if (err || result.length == 0){
                res.redirect("/error/500")
            } else {
                toSend.plan_id = req.params.plan_id
                toSend.plan_label = result[0].label
                toSend.plan_price = result[0].price
                toSend.plan_description = result[0].description
                res.render(dir + 'adminModifyPlan.html', toSend)
            }
        })
    } else {
        res.redirect(`/p/${req.params.project_uid}/home?error=unauthorized`)
    }
})

router.get('/:project_uid/manage/plan/create', function (req, res){
    if (res.locals.project.dev_id == req.user.id){
        let toSend = copySchema(res.locals.project)
        toSend = createMessage(req.query, toSend)
        toSend.user_id = req.user.id
        res.render(dir + 'adminManagePleanCreate.html', toSend)
    } else {
        res.redirect(`/p/${req.params.project_uid}/home?error=unauthorized`)
    }
})

router.get('/:project_uid/admin/modify/:page_id', function (req, res){
    if (res.locals.project.dev_id == req.user.id){
        let toSend = copySchema(res.locals.project)
        toSend = createMessage(req.query, toSend)
        toSend.user_id = req.user.id
        toSend.page_id = req.params.page_id
        toSend.newly_created = req.query.created
        res.render(dir + 'adminModifyPage.html', toSend)
    } else {
        res.redirect(`/p/${req.params.project_uid}/home?error=unauthorized`)
    }
})

router.post('/:project_uid/admin/modify/:page_id/batch-sample', function (req, res){
    if (res.locals.project.dev_id == req.user.id){
        let file = req.files.file;
        if (file.size > 4000000){
            res.redirect(`/p/${req.params.project_uid}/admin/modify/${req.params.page_id}?error=size_too_big`)
        } else {
            file.mv('./batch/sample/' + req.params.page_id + '.csv', () => {
                res.redirect(`/p/${req.params.project_uid}/admin/modify/${req.params.page_id}?success=sample_upload`)
            });
        }
    } else {
        res.redirect(`/p/${req.params.project_uid}/home?error=unauthorized`)
    }
})

router.get('/:project_uid/admin/modify/:page_id/batch-sample/remove', function (req, res){
    if (res.locals.project.dev_id == req.user.id){
        fs.unlinkSync('./batch/sample/' + req.params.page_id + '.csv')
        res.redirect(`/p/${req.params.project_uid}/admin/modify/${req.params.page_id}?success=sample_remove`)
    } else {
        res.redirect(`/p/${req.params.project_uid}/home?error=unauthorized`)
    }
})

router.get('/:project_uid/:path', function (req, res){
    db.getXbyY("page", "project_id", res.locals.project.uid, (err, result) => {
        if (result.length == 0){
            res.redirect("/error?error=page_not_found")
        } else {
            let toSend = copySchema(res.locals.project)
            toSend = createMessage(req.query, toSend)
            toSend.user_id = req.user.id
            for (let i = 0; i < result.length ; i++){
                if (result[i].path === req.params.path){
                    toSend.page_id = result[i].id
                    toSend.page_name = result[i].name
                    toSend.page_path = result[i].path
                    toSend.type = result[i].type
                    toSend.page_icon = result[i].icon
                }
            }
            res.render(dir + 'content.html', toSend)
        }
    })
})

router.post('/:project_uid/:path/:page_id/batch', function (req, res){
    let file = req.files.file;
    if (file.size > 4000000){
        res.redirect(`/p/${req.params.project_uid}/${req.params.path}?error=size_too_big`)
    } else {
        const processId = uuidv4()
        file.mv('./batch/uploads/' + processId + '.csv', () => {
            const batchProcess = copySchema(batchProcessSchema)
            batchProcess.id = processId
            batchProcess.page_id = req.params.page_id
            batchProcess.client_id = req.user.id
            batchProcess.time_created = getCurrentTime()
            db.add("batch_process", batchProcess, (err, result) => {
                if(err){
                    res.redirect(`/p/${req.params.project_uid}/${req.params.path}?error=create_batch`)
                } else {
                    res.redirect(`/p/${req.params.project_uid}/${req.params.path}/batch/${processId}?success=create_batch`)
                }
            })
        });
    }
})

router.get('/:project_uid/:path/batch/:process_id', function (req, res){
    let toSend = copySchema(res.locals.project)
    toSend = createMessage(req.query, toSend)
    toSend.user_id = req.user.id
    toSend.page_id = req.params.page_id
    toSend.page_path = req.params.path
    toSend.process_id = req.params.process_id
    res.render(dir + 'batchView.html', toSend)
})

module.exports = router