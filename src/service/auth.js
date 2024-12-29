import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import db from '../models'
require('dotenv').config()


export const loginOrRegisterService = (googleId, email, name, profileUrl, premium) => new Promise(async (resolve, reject) => {
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
                profileUrl,
                premium: +premium
            },
            raw: true
        })

        const serverToken = jwt.sign({
            id: response[0].id,
            googleId: response[0].googleId,
            email: response[0].email,
            name: response[0].name,
            premium: response[0].premium,
        }, process.env.SECRET_KEY, { expiresIn: '6m' })

        if (response[1]) {
            resolve({
                err: 0,
                msg: "Register successfully",
                token: serverToken,
                premium: +response[0].premium
            })
        } else {
            resolve({
                err: 0,
                msg: 'Login successfully',
                token: serverToken,
                premium: +response[0].premium
            })
        }

    } catch (error) {
        reject({
            err: -1,
            msg: `Server interval: ${error}`
        })
    }
})