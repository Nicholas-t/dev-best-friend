require('dotenv').config();

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios')
const path = require('path')
const crypto = require('crypto');
const { messages } = require('./constant');

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}adhabidbauwd${encrypted.toString('hex')}`;
};

const decrypt = (hash) => {
    const iv_content = hash.split('adhabidbauwd')
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv_content[0], 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(iv_content[1], 'hex')), decipher.final()]);
    return decrpyted.toString();
};

const Month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function convertDate(ts){
	let k = new Date(ts * 1000);
	return `${k.getDate()} ${Month[k.getMonth()]}`;
}

function copySchema(o){
    return JSON.parse(JSON.stringify(o));
}

function getCurrentTime(){
    return Math.round((new Date()) / 1000);
}

function createMessage(query, originalSend = {}){
    if (query.error){
        originalSend.message = messages.error[query.error]
        originalSend.messageType = "error"
    } else if (query.success){
        originalSend.message = messages.success[query.success]
        originalSend.messageType = "success"
    } else if (query.info){
        originalSend.message = messages.info[query.info]
        originalSend.messageType = "info"
    } else {
        originalSend.message = ""
        originalSend.messageType = ""
    }
    return originalSend
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function createRequest(config, res) {
    console.log("Request created with the following config ", config)
    try {
        if (config.method === "POST") {
            axios({
                method: config.method,
                url: config.endpoint,
                data: config.params,
                headers: config.headers
            }).then((response) => {
                res.status(response.status).json(response.data)
            }).catch((e) => {
                if (e.response){
                    res.status(e.response.status).json({
                        error : e
                    })
                } else {
                    res.status(500).json({
                        error : "NO RESPONSE GIVEN"
                    })
                }
            })
        } else if (config.method === "GET"){
            axios({
                method: config.method,
                url: config.endpoint,
                params: config.params,
                headers: config.headers
            }).then((response) => {
                res.status(response.status).json(response.data)
            }).catch((e) => {
                if (e.response){
                    res.status(e.response.status).json({
                        error : e
                    })
                } else {
                    res.status(500).json({
                        error : "NO RESPONSE GIVEN"
                    })
                }
            })
        } else {
            res.json({
                error : "INVALID METHOD"
            })
        }
    } catch(e) {
        res.json({
            error : e
        })
    }
}

module.exports = {
    encrypt,
    decrypt,
	convertDate,
    copySchema,
    getCurrentTime,
    createMessage,
    delay,
    createRequest
}