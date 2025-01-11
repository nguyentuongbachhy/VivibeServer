import * as songController from '../controller/song'
const express = require('express')

const route = express.Router()

route.get('/get-speed-dial', songController.getSpeedDialController)

route.post('/get-quick-picks', songController.getQuickPicksController)

route.get('/get-new-releases', songController.getNewReleasesController)

route.post('/get-albums', songController.getAlbumsController)

route.get('/get-artist-and-album', songController.getArtistAndAlbumsController)

route.get('/get-songs-by-genre', songController.getSongsByGenreController)

route.post('/get-play-all', songController.getPlayAllController)

route.put('/update-likes/:id', songController.updateLikedCountController)

route.get('/get-detail-song', songController.getDetailSongController)

export default route