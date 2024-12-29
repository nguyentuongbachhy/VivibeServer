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
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getDetailSongController = async (req, res) => {
    try {
        const { songId } = req.query
        if (!songId || songId.length == 0) {
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