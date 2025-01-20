import * as userController from '../controller/user'
const express = require('express')

const route = express.Router()

route.post('/toggle-like', userController.toggleLikeController)

route.post('/toggle-follow', userController.toggleFollowController)

route.get('/get-like-status', userController.getLikeStatusController)

route.get('/get-follow-status', userController.getFollowStatusController)

route.get('/get-playlists', userController.getPlaylistsController)

route.get('/get-liked-artists', userController.getLikedArtistsController)

route.post('/update-history', userController.updateHistoryController)

route.post('/upgrade-to-premium', userController.upgradeToPremiumController)

route.get('/get-histories', userController.getHistoriesController)

route.get('/search', userController.searchSongAndArtistController)

export default route