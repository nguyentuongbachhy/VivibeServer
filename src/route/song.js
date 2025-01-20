import * as songController from '../controller/song'
const express = require('express')

const route = express.Router()

route.get('/get-speed-dial', songController.getSpeedDialController)

route.post('/get-quick-picks', songController.getQuickPicksController)

route.get('/get-new-releases', songController.getNewReleasesController)

route.post('/get-albums', songController.getAlbumsController)

route.get('/get-detail-album', songController.getDetailAlbumController)

route.get('/get-detail-playlist', songController.getDetailPlaylistController)

route.get('/get-artist-and-album', songController.getArtistAndAlbumsController)

route.get('/get-songs-by-genre', songController.getSongsByGenreController)

route.post('/get-play-all', songController.getPlayAllController)

route.get('/get-detail-song', songController.getDetailSongController)

route.get('/get-liked-songs', songController.getLikedSongsController)

route.get('/get-downloaded-song', songController.getDownloadedSongController)

route.post('/get-swipe-songs', songController.getSwipeSongsController)

route.get('/get-top-songs', songController.getTopSongsController)

route.get('/get-top-artists', songController.getTopArtistsController)

route.get('/get-name-and-songs', songController.getNameAndSongsByGenreController)
export default route