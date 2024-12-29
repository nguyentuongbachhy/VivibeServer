import db from '../models'

export const getSpeedDialService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Song.findAll({
            attributes: ['id', 'title', 'thumbnailUrl'],
            order: [['createdAt', 'DESC']]
        })

        resolve({
            err: 0,
            msg: "Get songs successfully",
            data: response
        })

    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getQuickPicksService = (songIds) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Song.findAll({
            where: {
                id: songIds
            },
            include: [
                { model: db.Artist, as: 'artist', attributes: ['id', 'name'] }
            ],
            attributes: ['id', 'title', 'thumbnailUrl', 'views']
        })

        const sortedResponse = songIds.map(id => response.find(song => song.id === id));

        resolve({
            err: 0,
            msg: "Get top songs successfully",
            data: sortedResponse
        })
    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getDetailSongService = (songId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Song.findByPk(songId, {
            include: [
                { model: db.Artist, as: 'artist', attributes: ["id", "name"] }
            ],
            attributes: {
                exclude: ["albumId", "artistId", "createdAt", "updatedAt"]
            }
        })

        resolve({
            err: 0,
            msg: 'Get song successfully',
            data: response
        })

    } catch (error) {
        console.log(error)
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})