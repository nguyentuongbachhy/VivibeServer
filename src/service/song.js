import { Op } from 'sequelize'
import db, { sequelize } from '../models'

export const getSpeedDialService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Song.findAll({
            attributes: ['id', 'title', 'thumbnailUrl', 'artistId'],
            order: [['createdAt', 'DESC']],
            limit: 36
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


export const getNewReleases = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Song.findAll({
            include: [
                { model: db.Artist, as: 'artist', attributes: ['id', 'name'] }
            ],
            attributes: ['id', 'title', 'thumbnailUrl', 'views'],
            order: [['createdAt', 'DESC']],
            limit: 10
        })

        resolve({
            err: 0,
            msg: "Get new releases successfully",
            data: response
        })
    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getAlbums = (artistIds) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Album.findAll({
            where: {
                artistId: artistIds
            },
            include: [
                { model: db.Artist, as: 'artist', attributes: ['id', 'name', 'thumbnail'] },
                { model: db.Song, as: 'songs', attributes: ['id', 'title', 'thumbnailUrl'] }
            ],
            attributes: ['createdAt'],
            order: [['createdAt', 'DESC']]
        })
        resolve({
            err: 0,
            msg: "Get albums successfully",
            data: response
        })
    } catch (error) {
        console.log(JSON.stringify(error))

        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getArtistAndAlbums = (artistId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Album.findOne({
            where: {
                artistId
            },
            include: [
                { model: db.Artist, as: 'artist', attributes: ['id', 'name', 'thumbnail', 'description'] },
                { model: db.Song, as: 'songs', attributes: ['id', 'title', 'thumbnailUrl', 'duration', 'views'] }
            ],
            attributes: ['title', 'likes', 'createdAt'],
        })
        resolve({
            err: 0,
            msg: "Get new releases successfully",
            data: response
        })

    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getPlayAllService = (songIds) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Song.findAll({
            where: {
                id: songIds
            },
            include: [
                { model: db.Artist, as: 'artist', attributes: ["id", "name"] }
            ],
            attributes: {
                exclude: ["albumId", "artistId", "createdAt", "updatedAt"]
            }
        })

        const sortedResponse = songIds.map(id => response.find(song => song.id === id));

        resolve({
            err: 0,
            msg: "Get play all successfully",
            data: sortedResponse
        })
    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const updateLikedCountService = (songId, isLiked) => new Promise(async (resolve, reject) => {
    try {
        if (isLiked) {
            await db.Song.increment('likes', { where: { id: songId } })
        } else {
            await db.Song.decrement('likes', { where: { id: songId } })
        }
        resolve({
            err: 0,
            msg: `Update ${isLiked} count successfully`
        })
    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getSongsByGenreService = (genreId) => new Promise(async (resolve, reject) => {
    try {
        const query = `
            WITH RECURSIVE songs_of_genre AS (
            SELECT DISTINCT s.*
            FROM Songs s
            JOIN SongGenres sg ON s.id = sg.SongId
            WHERE sg.GenreId = :genreId
            )
            SELECT
            g.id as genreId,
            g.name as genreName,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', s.id,
                    'title', s.title,
                    'thumbnailUrl', s.thumbnailUrl,
                    'duration', s.duration,
                    'views', s.views,
                    'artist', JSON_OBJECT(
                        'id', a.id,
                        'name', a.name
                    )
                )
            ) as songs
            FROM songs_of_genre s
            JOIN SongGenres sg ON s.id = sg.SongId
            JOIN Genres g ON sg.GenreId = g.id
            JOIN Artists a ON s.artistId = a.id
            WHERE sg.GenreId != :genreId
            GROUP BY g.id, g.name;
        `


        const response = await sequelize.query(query, {
            replacements: { genreId },
            type: sequelize.QueryTypes.SELECT
        })

        resolve({
            err: 0,
            msg: "Get songs by genre successfully",
            data: response
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

        const genres = await db.SongGenre.findAll({
            where: {
                songId
            },
            attributes: ["genreId"],
            raw: true
        })

        if (!genres.length) {
            resolve({
                err: 0,
                msg: 'Get song successfully',
                data: [response]
            })
        } else {
            const limits = [5, 3, 2]
            const genreGroups = []

            for (let i = 0; i < genres.length; ++i) {
                if (i > 2) {
                    break
                }
                genreGroups.push({
                    genreId: genres[i].genreId,
                    limit: limits[i]
                })
            }
            const relatedSongsPromises = genreGroups.map(async ({ genreId, limit }) => {
                return await db.Song.findAll({
                    where: {
                        id: {
                            [Op.ne]: songId,
                            [Op.in]: db.Sequelize.literal(`(
                                SELECT songId FROM songgenres WHERE genreId = ${genreId}
                            )`)
                        }
                    },
                    include: [
                        { model: db.Artist, as: 'artist', attributes: ["id", "name"] }
                    ],
                    attributes: {
                        exclude: ["albumId", "artistId", "createdAt", "updatedAt"]
                    },
                    order: [['views', 'DESC']],
                    limit
                })
            })

            const relatedSongsGroups = await Promise.all(relatedSongsPromises);

            const relatedSongs = Array.from(
                new Set(relatedSongsGroups.flat().map(song => JSON.stringify(song)))
            ).map(song => JSON.parse(song));


            resolve({
                err: 0,
                msg: 'Get song successfully',
                data: [
                    response,
                    ...relatedSongs
                ]
            });
        }

    } catch (error) {
        console.log(error)
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})