import * as userService from '../service/user'

export const toggleLikeController = async (req, res) => {
    try {
        const { userId, songId } = req.body

        if (!userId || !songId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await userService.toggleLike(userId, songId)

        return res.status(200).json(response)

    } catch (error) {

        console.log(JSON.stringify(error))

        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const toggleFollowController = async (req, res) => {
    try {
        const { userId, artistId } = req.body

        if (!userId || !artistId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await userService.toggleFollow(userId, artistId)

        return res.status(200).json(response)

    } catch (error) {

        console.log(JSON.stringify(error))

        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getLikeStatusController = async (req, res) => {
    try {
        const { userId, songId } = req.query

        if (!userId || !songId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await userService.getLikeStatus(userId, songId)

        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getFollowStatusController = async (req, res) => {
    try {
        const { userId, artistId } = req.query

        if (!userId || !artistId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await userService.getFollowStatus(userId, artistId)

        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const updateHistoryController = async (req, res) => {
    try {
        const { userId, songId } = req.body

        if (!userId || !songId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await userService.updateHistory(userId, songId)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getPlaylistsController = async (req, res) => {
    try {
        const { userId } = req.query
        if (!userId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await userService.getPlaylists(userId)

        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getLikedArtistsController = async (req, res) => {
    try {
        const { userId } = req.query
        if (!userId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await userService.getLikedArtists(userId)

        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const upgradeToPremiumController = async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await userService.upgradeToPremium(userId)

        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getHistoriesController = async (req, res) => {
    try {
        const { userId } = req.query

        if (!userId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await userService.getHistories(userId)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server ${error}`
        })
    }
}

export const searchSongAndArtistController = async (req, res) => {
    try {
        const { keyword } = req.query

        if (!keyword) {
            return res.status(200).json({
                err: 0,
                msg: 'Searched successfully',
                data: []
            })
        }

        const response = await userService.searchSongAndArtist(keyword)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server ${error}`
        })
    }
}