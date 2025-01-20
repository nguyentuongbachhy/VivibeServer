import { getGenreByIdsController, getGenresController, getGenresSongController } from '../controller/genre'
const express = require('express')

const route = express.Router()

route.get('/get-genres', getGenresController)

route.get('/get-genres-song', getGenresSongController)

route.post('/get-genre-by-ids', getGenreByIdsController)

export default route