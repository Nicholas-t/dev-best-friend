require('dotenv').config();

const nodemailer = require('nodemailer');

class mailHandler {
	/**
	 * @constructor
	 */
	constructor() {
        this.description = 'email Handler for DBF including managing questions, etc';
        this.con = null;
        this.recepients = [
            'nicholasbudiharsa@gmail.com'
        ]
        this.transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : process.env.EMAIL,
                pass : process.env.EMAIL_PW
            }
        })
    }
    
    async sendMailToTeam() {
        for (let i = 0;i<this.recepients.length;i++){
            const mailOptions = {
                from : process.env.EMAIL,
                to : this.recepients[i],
                subject : `<SUBJECT>`,
                text : `<EMAIL HERE>`
            }
            this.transporter.sendMail(mailOptions, function(error, info){
                if (error){
                    console.log(error)
                } else{
                    console.log(`Email send to ${this.recepients}`)
                }
            })
        }
    }
}

module.exports = mailHandler;
