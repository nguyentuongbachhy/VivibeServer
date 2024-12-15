import { getGenresController } from '../controller/genre'
const express = require('express')

const route = express.Router()

route.get('/get-genres', getGenresController)

export default route