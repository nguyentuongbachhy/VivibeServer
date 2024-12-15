import * as authController from '../controller/auth'
const express = require('express')

const route = express.Router()

route.post('/google', authController.loginOrRegisterController)

export default route