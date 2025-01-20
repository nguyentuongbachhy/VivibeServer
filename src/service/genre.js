import db, { sequelize } from '../models'

export const getGenresService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Genre.findAll({
            attributes: ['id', 'name']
        })

        resolve({
            err: 0,
            msg: 'Got genres successfully',
            genres: response
        })

    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getGenreByIdsService = (genreIds) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Genre.findAll({
            where: {
                id: genreIds
            },
            attributes: ['id', 'name']
        })

        const sortedGenres = genreIds.map(id => response.find(genre => genre.id === id))

        resolve({
            err: 0,
            msg: 'Got genre by ids successfully',
            genres: sortedGenres
        })

    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})


export const getGenresSongService = (songId) => new Promise(async (resolve, reject) => {
    try {
        const sql = `
            SELECT g.id
            FROM genres g
            INNER JOIN songgenres sg ON sg.genreId = g.id AND sg.songId = :songId
        `

        const response = await sequelize.query(sql, {
            replacements: { songId },
            type: sequelize.QueryTypes.SELECT
        })

        resolve({
            err: 0,
            msg: 'Got genres of song successfully',
            genres: response
        })

    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})