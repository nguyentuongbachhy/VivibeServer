import * as songController from '../controller/song'
const express = require('express')

const route = express.Router()

route.get('/get-speed-dial', songController.getSpeedDialController)

route.post('/get-quick-picks', songController.getQuickPicksController)

export default route