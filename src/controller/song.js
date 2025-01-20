import * as songService from '../service/song'

export const getSpeedDialController = async (req, res) => {
    try {
        const response = await songService.getSpeedDialService()
        return res.status(200).json({
            err: 0,
            msg: response["msg"],
            data: response["data"]
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getQuickPicksController = async (req, res) => {
    try {
        const { songIds } = req.body

        if (!songIds || songIds.length === 0) {
            return res.status(200).json({
                err: 0,
                msg: 'Got quick picks successfully',
                data: []
            })
        }

        const response = await songService.getQuickPicksService(songIds)

        return res.status(200).json({
            err: 0,
            msg: response["msg"],
            data: response["data"]
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getNewReleasesController = async (req, res) => {
    try {
        const response = await songService.getNewReleases()
        return res.status(200).json({
            err: 0,
            msg: response["msg"],
            data: response["data"]
        })
    } catch (error) {
        console.log(JSON.stringify(error))
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getAlbumsController = async (req, res) => {
    try {
        const { artistIds } = req.body

        if (!artistIds || !artistIds.length) {
            return res.status(200).json({
                err: 0,
                msg: 'Got albums successfully',
                data: []
            })
        }


        const response = await songService.getAlbums(artistIds)
        return res.status(200).json({
            err: 0,
            msg: response["msg"],
            data: response["data"]
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getDetailAlbumController = async (req, res) => {
    try {
        const { albumId } = req.query
        if (!albumId) {
            return res.status(400).json({
                err: 0,
                msg: 'Missing album ID'
            })
        }

        const response = await songService.getDetailAlbum(+albumId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getDetailPlaylistController = async (req, res) => {
    try {
        const { playlistId } = req.query
        if (!playlistId) {
            return res.status(400).json({
                err: 0,
                msg: 'Missing album ID'
            })
        }

        const response = await songService.getDetailPlaylist(+playlistId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getLikedSongsController = async (req, res) => {
    try {
        const { userId } = req.query
        if (!userId) {
            return res.status(400).json({
                err: 0,
                msg: 'Missing album ID'
            })
        }

        const response = await songService.getLikedSongs(userId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}


export const getArtistAndAlbumsController = async (req, res) => {
    try {
        const { artistId } = req.query
        if (!artistId) {
            return res.status(400).json({
                err: 0,
                msg: 'Missing artist ID'
            })
        }

        const response = await songService.getArtistAndAlbums(+artistId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getSongsByGenreController = async (req, res) => {
    try {
        const { genreId } = req.query
        if (!genreId) {
            return res.status(400).json({
                err: 0,
                msg: 'Missing genre ID'
            })
        }
        const response = await songService.getSongsByGenreService(+genreId)
        return res.status(200).json({
            err: 0,
            msg: response["msg"],
            data: response["data"]
        })
    } catch (error) {
        console.log(JSON.stringify(error))
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}


export const getPlayAllController = async (req, res) => {
    try {
        const { songIds } = req.body
        if (!songIds || songIds.length == 0) {
            return res.status(200).json({
                err: 0,
                msg: 'Get play all successfully',
                data: []
            })
        }
        const response = await songService.getPlayAllService(songIds)
        return res.status(200).json({
            err: 0,
            msg: response["msg"],
            data: response["data"]
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getDetailSongController = async (req, res) => {
    try {
        const { songId } = req.query
        if (!songId || songId.length === 0) {
            return res.status(400).json({
                err: 0,
                msg: 'Missing song ID'
            })
        }
        const response = await songService.getDetailSongService(+songId)
        return res.status(200).json({
            err: 0,
            msg: response["msg"],
            data: response["data"]
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getDownloadedSongController = async (req, res) => {
    try {
        const { songId } = req.query
        if (!songId || songId.length === 0) {
            return res.status(400).json({
                err: 0,
                msg: 'Missing song ID'
            })
        }
        const response = await songService.getDownloadedSongService(+songId)
        return res.status(200).json({
            err: 0,
            msg: response["msg"],
            data: response["data"]
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}
export const getSwipeSongsController = async (req, res) => {
    try {
        const { genreIds } = req.body

        if (!genreIds) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await songService.getSwipeSongs(genreIds)

        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getTopSongsController = async (req, res) => {
    try {
        const response = await songService.getTopSongs()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getTopArtistsController = async (req, res) => {
    try {
        const response = await songService.getTopArtists()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getNameAndSongsByGenreController = async (req, res) => {
    try {
        const { genreId } = req.query
        if (!genreId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await songService.getNameAndSongsByGenre(genreId)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}