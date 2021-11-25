
require('dotenv').config();

const nodemailer = require('nodemailer');
const fs = require('fs')

const {
    emailMotives
} = require('../constant')

const emailsDir = __dirname + `/emails/`

class mailHandler {
	/**
	 * @constructor
	 */
	constructor() {
        this.Description = 'email handler for Dev Best Friend';
        this.transporter = nodemailer.createTransport( {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PW
            }
        })
    }

    _getHtml(motive, data){
        let motiveData = emailMotives[motive]
        let htmlContent = fs.readFileSync(`${emailsDir}${motiveData.file_content}`).toString()
        let subject = motiveData.subject
        for (let i = 0 ; i < motiveData.fields.length ; i ++){
            const field = motiveData.fields[i]
            htmlContent = htmlContent.split(`{${field}}`).join(data[field])
            subject = subject.split(`{${field}}`).join(data[field])
        }
        let html = fs.readFileSync(`${emailsDir}frame.html`).toString()
        html = html.split("{content}").join(htmlContent)
        return {
            html, subject
        }
    }

    sendMail(to, motive, data){
        let {
            html, subject
        } = this._getHtml(motive, data)
        const mailOptions = {
            from : process.env.EMAIL,
            to: to,
            subject : subject,
            html: html
        }
        this.transporter.sendMail(mailOptions, function(error, info){
            if (error){
                console.log(error)
            }
        })
    }
}

module.exports = mailHandler;