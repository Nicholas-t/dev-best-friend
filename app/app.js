require('dotenv').config();

var express = require('express');
var bodyparser = require('body-parser');
const passport = require('passport');
const session =  require('express-session');
const fileUpload = require('express-fileupload');
var fs = require('fs');


const {
  createMessage
} = require('./packages/util')
const mailHandler = require('./packages/mailer/mailer');
const mail = new mailHandler();



var app = express()



app.engine('html', require('ejs').renderFile);
const urlencodedParser = bodyparser.urlencoded({ extended: true })

app.use(fileUpload({
  createParentPath: true
}));

app.use('/static', express.static(__dirname + '/public'));
app.use('/project-logo', express.static(__dirname + '/logos'));
app.use(urlencodedParser)
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret : process.env.SESSION_SECRET
    ? process.env.SESSION_SECRET
    : "secret",
  resave : false,
  saveUninitialized : false
}))


app.use(passport.initialize())
app.use(passport.session())


app.use((req, res, next) => {
  console.log(`[${(new Date()).toISOString()}] ${req.path}  ${req.user ? `(${req.user.name} - ${req.user.type})` : ""}`)
  next()
})

app.use('/error', require("./router/error"))
app.use('/dev', require("./router/dev"))
app.use('/internal-test', require("./router/internalTest"))
app.use('/db', require("./router/db"))
app.use('/constant', require("./router/constant"))
app.use('/p', require("./router/project"))
app.use('/account', require("./router/account"))
app.use('/payment', require("./router/payment"))

app.get('/', function (req, res) {
  if (!req.user){
    res.redirect("/finder/")
  } else {
    if (req.user.type == "dev"){
      res.redirect('/dev')
    } else {
      res.redirect('/error')
    }
  }
})

app.get('/finder', function (req, res) {
  const toSend = createMessage(req.query)
  res.render(__dirname + '/public/pages/client/projectFinder.html', toSend)
})

app.post('/finder', function (req, res){
  res.redirect(`/p/${req.body.project_uid}/login`)
})

app.get('/frame', function (req, res) {
  const toSend = createMessage(req.query)
  res.render(__dirname + '/public/pages/frame.html', toSend)
})

app.get('/check-is-logo-exist/:project_id', function (req, res) {
  res.json({
      exist : fs.existsSync(`./logos/${req.params.project_id}.png`)
  })
})

app.get('*', function(req, res){
  res.redirect('/error')
});


const server = app.listen(7000, () => {
    console.log('Express listening at ', 7000);
})

