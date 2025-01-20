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

export const getDetailAlbum = (albumId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Album.findOne({
            where: {
                id: albumId
            },
            include: [
                {
                    model: db.Song, as: 'songs',
                    attributes: ['id', 'title', 'thumbnailUrl', 'duration', 'views'],
                    include: [
                        { model: db.Artist, as: 'artist', attributes: ['id', 'name', 'thumbnail'] }
                    ]
                }
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

export const getLikedSongs = (userId) => new Promise(async (resolve, reject) => {
    try {
        const [response] = await db.sequelize.query(`
            SELECT 
                s.id,
                s.title,
                s.thumbnailUrl,
                s.duration,
                s.views,
                a.id as artist_id,
                a.name as artist_name,
                a.thumbnail as artist_thumbnail,
                ul.createdAt as liked_at
            FROM Songs s
            INNER JOIN UserSongLikes ul ON s.id = ul.songId
            INNER JOIN Artists a ON s.artistId = a.id
            WHERE ul.userId = :userId
            ORDER BY ul.createdAt DESC
        `, {
            replacements: { userId }
        });

        // Format lại data theo cấu trúc mong muốn
        const formattedResponse = response.map(song => ({
            id: song.id,
            title: song.title,
            thumbnailUrl: song.thumbnailUrl,
            duration: song.duration,
            views: song.views,
            artist: {
                id: song.artist_id,
                name: song.artist_name,
                thumbnail: song.artist_thumbnail
            }
        }));

        resolve({
            err: 0,
            msg: "Get liked songs successfully",
            data: formattedResponse
        });

    } catch (error) {
        console.error('Error in getLikedSongs:', error);
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});

export const getDetailPlaylist = (playlistId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Playlist.findOne({
            where: {
                id: playlistId
            },
            include: [
                {
                    model: db.Song,
                    as: 'songs',
                    attributes: ['id', 'title', 'thumbnailUrl', 'duration', 'views'],
                    through: {
                        attributes: [] // Bỏ qua các attributes của bảng trung gian PlaylistSong
                    },
                    include: [
                        {
                            model: db.Artist,
                            as: 'artist',
                            attributes: ['id', 'name', 'thumbnail']
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'name']
                }
            ],
            attributes: ['id', 'name', 'description', 'createdAt'],
        });

        resolve({
            err: 0,
            msg: "Get playlist detail successfully",
            data: response
        });

    } catch (error) {
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});

export const getArtistAndAlbums = (artistId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Album.findOne({
            where: {
                artistId
            },
            include: [
                { model: db.Artist, as: 'artist', attributes: ['id', 'name', 'thumbnail', 'description', 'followers'] },
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
        // Lấy thông tin bài hát
        const songs = await db.Song.findAll({
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

        // Sắp xếp theo thứ tự songIds
        const sortedResponse = songIds.map(id =>
            songs.find(song => song.id === id)
        );

        resolve({
            err: 0,
            msg: "Get play all successfully",
            data: sortedResponse
        })
    } catch (error) {
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        })
    }
})

export const getSongsByGenreService = (genreId) => new Promise(async (resolve, reject) => {
    try {
        const query = `
            WITH RECURSIVE songs_of_genre AS (
                SELECT DISTINCT s.id, s.title, s.thumbnailUrl, s.views, s.artistId, s.duration
                FROM songs s
                JOIN songgenres sg ON s.id = sg.songId
                WHERE sg.genreId = :genreId
            )
            SELECT
                JSON_OBJECT(
                    'id', g.id,
                    'name', g.name
                ) as genre,
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
            JOIN songgenres sg ON s.id = sg.songId
            JOIN genres g ON sg.genreId = g.id
            JOIN artists a ON s.artistId = a.id
            GROUP BY g.id, g.name
            HAVING g.id != :genreId;
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
        console.log(JSON.stringify(error))
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getDetailSongService = (songId) => new Promise(async (resolve, reject) => {
    try {
        // Lấy thông tin bài hát chính
        const song = await db.Song.findByPk(songId, {
            include: [
                { model: db.Artist, as: 'artist', attributes: ["id", "name"] }
            ],
            attributes: {
                exclude: ["albumId", "artistId", "createdAt", "updatedAt"]
            }
        })

        const songDetails = song.toJSON();

        const genres = await db.SongGenre.findAll({
            where: { songId },
            attributes: ["genreId"],
            raw: true
        })

        if (!genres.length) {
            resolve({
                err: 0,
                msg: 'Get song successfully',
                data: [songDetails]
            })
            return;
        }

        // Xử lý bài hát liên quan
        const limits = [5, 3, 2]
        const genreGroups = genres.slice(0, 3).map((genre, index) => ({
            genreId: genre.genreId,
            limit: limits[index]
        }));

        const relatedSongsPromises = genreGroups.map(async ({ genreId, limit }) => {
            const relatedSongs = await db.Song.findAll({
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
            });

            return relatedSongs.map(song => song.toJSON());
        });

        const relatedSongsGroups = await Promise.all(relatedSongsPromises);
        const relatedSongs = Array.from(
            new Set(relatedSongsGroups.flat().map(song => JSON.stringify(song)))
        ).map(song => JSON.parse(song));

        resolve({
            err: 0,
            msg: 'Get song successfully',
            data: [songDetails, ...relatedSongs]
        });

    } catch (error) {
        console.log(error);
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        })
    }
})

export const getDownloadedSongService = (songId) => new Promise(async (resolve, reject) => {
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
            msg: 'Get downloaded song successfully',
            data: response
        })

    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getSwipeSongs = (genreIds) => new Promise(async (resolve, reject) => {
    try {
        if (!genreIds || genreIds.length === 0) {
            const latestSongsQuery = `
                SELECT DISTINCT
                    s.id,
                    s.title,
                    s.thumbnailUrl, 
                    s.audio,
                    s.views,
                    s.likes,
                    s.climaxStart,
                    s.climaxEnd,
                    s.createdAt,
                    a.id as artistId,
                    a.name as artistName,
                    a.thumbnail as artistThumbnail
                FROM Songs s
                JOIN Artists a ON s.artistId = a.id
                ORDER BY s.createdAt DESC
                LIMIT 15
            `;

            const latestSongs = await db.sequelize.query(latestSongsQuery, {
                type: db.sequelize.QueryTypes.SELECT
            });

            const formattedSongs = latestSongs.map(song => ({
                id: song.id,
                title: song.title,
                thumbnailUrl: song.thumbnailUrl,
                audio: song.audio,
                views: song.views,
                likes: song.likes,
                climaxStart: song.climaxStart || 30,
                climaxEnd: song.climaxEnd || 60,
                artist: {
                    id: song.artistId,
                    name: song.artistName,
                    thumbnail: song.artistThumbnail
                }
            }));

            resolve({
                err: 0,
                msg: 'Get latest songs successfully',
                data: formattedSongs
            });
            return;
        }

        const songsByGenrePromises = genreIds.map(async (genreId) => {
            const query = `
                SELECT 
                    s.id,
                    s.title,
                    s.thumbnailUrl,
                    s.audio,
                    s.views,
                    s.likes,
                    s.climaxStart,
                    s.climaxEnd,
                    s.createdAt,
                    a.id as artistId,
                    a.name as artistName,
                    a.thumbnail as artistThumbnail
                FROM Songs s
                JOIN SongGenres sg ON s.id = sg.songId 
                JOIN Artists a ON s.artistId = a.id
                WHERE sg.genreId = ?
                ORDER BY s.views DESC
                LIMIT 15
            `;

            const songs = await db.sequelize.query(query, {
                replacements: [genreId],
                type: db.sequelize.QueryTypes.SELECT
            });

            return songs;
        });

        const getNewReleasesQuery = `
            SELECT 
                s.id,
                s.title,
                s.thumbnailUrl,
                s.audio,
                s.views,
                s.likes,
                s.climaxStart,
                s.climaxEnd,
                s.createdAt,
                a.id as artistId,
                a.name as artistName,
                a.thumbnail as artistThumbnail
            FROM Songs s
            JOIN SongGenres sg ON s.id = sg.songId 
            JOIN Artists a ON s.artistId = a.id
            WHERE sg.genreId = ?
            ORDER BY s.createdAt DESC
            LIMIT 5
        `;

        const [songsByGenre, newReleases] = await Promise.all([
            Promise.all(songsByGenrePromises),
            db.sequelize.query(getNewReleasesQuery, {
                replacements: [genreIds[0]], // Get new releases from top genre
                type: db.sequelize.QueryTypes.SELECT
            })
        ]);

        const distribution = calculateDistribution(songsByGenre);

        const swipeSongs = [];

        swipeSongs.push(...newReleases.slice(0, 2));

        distribution.forEach(({ genreIndex, count }) => {
            if (genreIndex === 0) {
                const songsFromGenre = songsByGenre[genreIndex]
                    .filter(song => !newReleases.find(nr => nr.id === song.id))
                    .slice(0, count - 2);
                swipeSongs.push(...songsFromGenre);
            } else {
                const songsFromGenre = songsByGenre[genreIndex].slice(0, count);
                swipeSongs.push(...songsFromGenre);
            }
        });

        const response = swipeSongs.map(song => ({
            id: song.id,
            title: song.title,
            thumbnailUrl: song.thumbnailUrl,
            audio: song.audio,
            views: song.views,
            likes: song.likes,
            climaxStart: song.climaxStart || 30,
            climaxEnd: song.climaxEnd || 50,
            artist: {
                id: song.artistId,
                name: song.artistName,
                thumbnail: song.artistThumbnail
            }
        }));

        resolve({
            err: 0,
            msg: 'Get swipe songs successfully',
            data: response
        });
    } catch (error) {
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
})

function calculateDistribution(songsByGenre) {
    const totalSongs = 15;
    const newReleasesCount = 2;
    const remainingSongs = totalSongs - newReleasesCount;

    const distribution = [];

    distribution.push({
        genreIndex: 0,
        count: Math.floor(remainingSongs * 0.5) + newReleasesCount // 50% from top genre + space for new releases
    });

    if (songsByGenre.length > 1) {
        distribution.push({
            genreIndex: 1,
            count: Math.floor(remainingSongs * 0.3) // 30% from second genre
        });
    }

    const remaining = totalSongs - distribution.reduce((acc, curr) => acc + curr.count, 0);
    if (remaining > 0 && songsByGenre.length > 2) {
        for (let i = 2; i < songsByGenre.length; i++) {
            distribution.push({
                genreIndex: i,
                count: Math.floor(remaining / (songsByGenre.length - 2))
            });
        }
    }

    return distribution;
}

export const getTopSongs = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Song.findAll({
            include: [
                { model: db.Artist, as: 'artist', attributes: ['id', 'name'] }
            ],
            attributes: ['id', 'title', 'thumbnailUrl'],
            order: [['views', 'DESC']],
            limit: 8
        })

        resolve({
            err: 0,
            msg: 'Got top songs successfully',
            data: response
        })
    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getTopArtists = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Artist.findAll({
            attributes: ['id', 'name', 'thumbnail', 'followers'],
            order: [['followers', 'DESC']],
            limit: 8
        })

        resolve({
            err: 0,
            msg: 'Got top artists successfully',
            data: response
        })
    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getNameAndSongsByGenre = (genreId) => new Promise(async (resolve, reject) => {
    try {
        const query = `
            SELECT s.id, s.title, s.thumbnailUrl, s.views, 
                a.id as artistId, a.name as artistName, a.thumbnail as artistThumbnail,
                g.name as genreName
            FROM songs s
            INNER JOIN songgenres sg ON s.id = sg.songId
            INNER JOIN genres g ON g.id = sg.genreId
            INNER JOIN artists a ON a.id = s.artistId
            WHERE g.id = :genreId
        `



        const response = await db.sequelize.query(query, {
            replacements: { genreId },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (response.length > 0) {
            const formattedResponse = {
                name: response[0].genreName,
                songs: response.map(song => ({
                    id: song.id,
                    title: song.title,
                    thumbnailUrl: song.thumbnailUrl,
                    views: song.views,
                    artist: {
                        id: song.artistId,
                        name: song.artistName,
                        thumbnail: song.artistThumbnail
                    }
                }))
            };

            resolve({
                err: 0,
                msg: 'Got songs by genre successfully',
                data: formattedResponse
            });
        } else {
            resolve({
                err: 0,
                msg: 'No songs found for this genre',
                data: {
                    name: '',
                    songs: []
                }
            });
        }
    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server error: ${error}`
        })
    }
})