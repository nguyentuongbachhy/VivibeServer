import { getGenreByIdsService, getGenresService, getGenresSongService } from '../service/genre'


export const getGenresController = async (req, res) => {
    try {
        const response = await getGenresService()
        return res.status(200).json({
            err: 0,
            msg: response["msg"],
            genres: response["genres"]
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server ${error}`
        })
    }
}


export const getGenreByIdsController = async (req, res) => {
    try {
        const { genreIds } = req.body
        const response = await getGenreByIdsService(genreIds)
        return res.status(200).json({
            err: 0,
            msg: response["msg"],
            genres: response["genres"]
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server ${error}`
        })
    }
}


export const getGenresSongController = async (req, res) => {
    try {
        const { songId } = req.query

        if (!songId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await getGenresSongService(songId)

        return res.status(200).json(response)

    } catch (error) {
        console.log(JSON.stringify(error))
        return res.status(500).json({
            err: -1,
            msg: `Interval server ${error}`
        })
    }
}