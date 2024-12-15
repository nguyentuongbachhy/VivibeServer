import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import db from '../models'
require('dotenv').config()


export const loginOrRegisterService = (googleId, email, name, profileUrl) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOrCreate({
            where: {
                googleId,
                email
            },
            defaults: {
                id: v4(),
                googleId,
                email,
                name,
                profileUrl
            }
        })

        const serverToken = jwt.sign({
            id: response[0].id,
            googleId: response[0].googleId,
            email: response[0].email,
            name: response[0].name
        }, process.env.SECRET_KEY, { expiresIn: '6m' })

        if (response[1]) {

            resolve({
                err: 0,
                msg: "Register successfully",
                token: serverToken
            })
        } else {
            resolve({
                err: 0,
                msg: 'Login successfully',
                token: serverToken
            })
        }

    } catch (error) {
        reject({
            err: -1,
            msg: `Server interval: ${error}`
        })
    }
})