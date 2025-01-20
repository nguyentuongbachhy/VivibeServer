import * as newReleaseController from '../controller/newRelease'
const express = require('express')


const route = express.Router()

route.get('/get-latest-album', newReleaseController.getLatestAlbumController)

route.get('/get-albums-artists', newReleaseController.getAlbumsAndSongsController)

export default route