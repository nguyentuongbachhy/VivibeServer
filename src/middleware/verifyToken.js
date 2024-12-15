import jwt from 'jsonwebtoken'
require('dotenv').config()

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.slice(7)
    if (token && token.length > 0 && token !== 'ul') {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(401).json({
                    err: 1,
                    msg: `Failed to authenticate token: ${err}`
                })
            }
            req.userId = user.id
            next()
        })
    }
    else {
        next()
    }
}