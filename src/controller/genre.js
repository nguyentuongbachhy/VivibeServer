import { getGenresService } from '../service/genre'


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