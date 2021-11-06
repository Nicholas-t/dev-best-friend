require('dotenv').config();

const localStrategy = require('passport-local').Strategy
const axios = require('axios');
const bcrypt = require('bcrypt')
const { json } = require('express')
const { v4: uuidv4 } = require('uuid');

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        await getUserByEmail(email, async (err, user) => {
            try {
                if (user.length === 0){
                    return done(null, null, {message: 'user_not_found'})
                }
                const users = []
                for (let i = 0 ; i < user.length ; i++){
                    if (await bcrypt.compare(password, user[i].hashed_password)) {
                        users.push(user[i])
                    }
                }
                if (users.length !== 0) return done(null, users)
                return done(null, null, {message: 'incorrect_password'})
            } catch (e) {
                return done(e, null, {message: 'internal_error'})
            }
        })
    }

    passport.use(new localStrategy({usernameField : 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => getUserById(id, (err, result) => {
        done(err, result)
    }))
}

module.exports = initialize