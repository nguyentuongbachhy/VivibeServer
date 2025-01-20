import * as newReleaseService from '../service/newRelease'

export const getLatestAlbumController = async (req, res) => {
    try {
        const response = await newReleaseService.getLatestAlbum()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getAlbumsAndSongsController = async (req, res) => {
    try {
        const response = await newReleaseService.getAlbumsAndSongs()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}