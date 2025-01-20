import db from '../models';


export const toggleLike = (userId, songId) => new Promise(async (resolve, reject) => {
    try {
        const existingLike = await db.UserSongLike.findOne({
            where: {
                userId,
                songId
            }
        })

        if (existingLike) {
            // Nếu đã like thì xóa (unlike)
            await existingLike.destroy();
            resolve({
                err: 0,
                msg: 'Unliked successfully',
                liked: false
            });
            await db.Song.decrement('likes', { where: { id: songId } })
        } else {
            await db.UserSongLike.create({
                userId,
                songId
            });
            await db.Song.increment('likes', { where: { id: songId } })
            resolve({
                err: 0,
                msg: 'Liked successfully',
                liked: true
            });
        }

    } catch (error) {
        console.log(JSON.stringify(error))
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const toggleFollow = (userId, artistId) => new Promise(async (resolve, reject) => {
    try {
        const existingLike = await db.UserFollow.findOne({
            where: {
                userId,
                artistId
            }
        })

        if (existingLike) {
            // Nếu đã follow thì xóa (unfollow)
            await existingLike.destroy();
            resolve({
                err: 0,
                msg: 'Unfollow successfully',
                followed: false
            });
            await db.Artist.decrement('followers', { where: { id: artistId } })
        } else {
            await db.UserFollow.create({
                userId,
                artistId
            });
            await db.Artist.increment('followers', { where: { id: artistId } })
            resolve({
                err: 0,
                msg: 'Followed successfully',
                followed: true
            });
        }
    } catch (error) {
        console.log(JSON.stringify(error))
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getLikeStatus = (userId, songId) => new Promise(async (resolve, reject) => {
    try {
        const like = await db.UserSongLike.findOne({
            where: {
                userId,
                songId
            }
        });

        resolve({
            err: 0,
            msg: 'Got like status successfully',
            liked: !!like
        });
    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getFollowStatus = (userId, artistId) => new Promise(async (resolve, reject) => {
    try {
        const follow = await db.UserFollow.findOne({
            where: {
                userId,
                artistId
            }
        });

        resolve({
            err: 0,
            msg: 'Got follow status successfully',
            followed: !!follow
        });
    } catch (error) {
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const updateHistory = (userId, songId) => new Promise(async (resolve, reject) => {
    try {
        const [record, created] = await db.ListeningHistory.findOrCreate({
            where: {
                userId,
                songId
            },
            defaults: {
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        await db.ListeningHistory.update(
            {
                lastPlayedAt: new Date()
            },
            {
                where: {
                    userId,
                    songId
                }
            }
        );

        resolve({
            err: 0,
            msg: 'Updated history successfully',
            updated: true
        });
    } catch (error) {
        console.error('Error:', error);
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});

export const upgradeToPremium = (userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.update(
            {
                premium: 1,
                updatedAt: new Date()
            },
            {
                where: { id: userId }
            }
        );

        if (response[0] > 0) {
            resolve({
                err: 0,
                msg: 'Upgraded to premium successfully',
                premium: 1
            });
        } else {
            reject({
                err: 1,
                msg: 'User not found or already premium'
            });
        }

    } catch (error) {
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});

export const getPlaylists = (userId) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
        const [playlistsData] = await db.sequelize.query(`
            WITH user_playlists AS (
                SELECT id, name
                FROM Playlists
                WHERE userId = :userId
            ),
            playlist_songs AS (
                SELECT s.thumbnailUrl, ps.playlistId
                FROM Songs s
                JOIN PlaylistSongs ps ON s.id = ps.songId
                JOIN user_playlists p ON ps.playlistId = p.id
                WHERE (
                    SELECT COUNT(*)
                    FROM PlaylistSongs ps2
                    WHERE ps2.playlistId = ps.playlistId
                    AND ps2.id <= ps.id
                ) <= 4
            )
            SELECT 
                p.id as playlist_id,
                p.name as playlist_name,
                u.name as user_name,
                ps.thumbnailUrl
            FROM user_playlists p
            LEFT JOIN Users u ON u.id = :userId
            LEFT JOIN playlist_songs ps ON ps.playlistId = p.id
            ORDER BY p.id;
        `, {
            replacements: { userId },
            transaction
        });

        const playlistsMap = new Map();

        playlistsData.forEach(row => {
            if (!playlistsMap.has(row.playlist_id)) {
                playlistsMap.set(row.playlist_id, {
                    id: row.playlist_id,
                    name: row.playlist_name,
                    userName: row.user_name,
                    thumbnails: new Set()
                });
            }

            const playlist = playlistsMap.get(row.playlist_id);
            if (row.thumbnailUrl) playlist.thumbnails.add(row.thumbnailUrl);
        });

        const formattedPlaylists = Array.from(playlistsMap.values()).map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            userName: playlist.userName,
            thumbnails: Array.from(playlist.thumbnails)
        }));

        await transaction.commit();
        resolve({
            err: 0,
            msg: 'Got playlists successfully',
            playlists: formattedPlaylists
        });
    } catch (error) {
        console.log(JSON.stringify(error));
        await transaction.rollback();
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});

export const getLikedArtists = (userId) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
        const sql = `
            SELECT a.id, a.name, a.thumbnail, a.followers
            FROM Artists as a
            INNER JOIN UserFollows as uf ON uf.userId = :userId AND uf.artistId = a.id
        `;

        const [data] = await db.sequelize.query(sql, {
            replacements: { userId },
            transaction
        });

        await transaction.commit();

        resolve({
            err: 0,
            msg: 'Got liked artists successfully',
            artists: data // Sửa từ playlists thành artists
        });

    } catch (error) {
        await transaction.rollback();
        reject({
            err: -1,
            msg: `Internal server error: ${error}` // Sửa Interval thành Internal
        });
    }
});

export const getHistories = (userId) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
        const sql = `
            SELECT
                s.id,
                s.title,
                s.thumbnailUrl,
                s.duration,
                s.views,
                a.id as artistId,
                a.name as artistName,
                h.lastPlayedAt
            FROM ListeningHistories h
            INNER JOIN Songs s ON h.songId = s.id
            INNER JOIN Artists a ON s.artistId = a.id
            WHERE h.userId = :userId
            ORDER BY h.lastPlayedAt DESC
            LIMIT 20
        `;

        const [histories] = await db.sequelize.query(sql, {
            replacements: { userId },
            transaction
        });

        await transaction.commit();

        const formattedHistories = histories.map(history => ({
            id: history.id,
            title: history.title,
            thumbnailUrl: history.thumbnailUrl,
            duration: history.duration,
            views: history.views,
            artist: {
                id: history.artistId,
                name: history.artistName
            },
            lastPlayedAt: history.lastPlayedAt
        }));

        resolve({
            err: 0,
            msg: 'Got histories successfully',
            histories: formattedHistories
        });

    } catch (error) {
        await transaction.rollback();
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});

export const searchSongAndArtist = (keyword) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
        const searchQuery = `%${keyword}%`;
        const sql = `
            SELECT DISTINCT
                s.id,
                s.title,
                s.thumbnailUrl,
                s.duration,
                s.views,
                a.id as artistId,
                a.name as artistName
            FROM Songs s
            INNER JOIN Artists a ON s.artistId = a.id
            WHERE
                LOWER(s.title) LIKE LOWER(:searchQuery)
                OR LOWER(a.name) LIKE LOWER(:searchQuery)
            ORDER BY
                CASE
                    WHEN LOWER(s.title) LIKE LOWER(:exactMatch) THEN 1
                    WHEN LOWER(a.name) LIKE LOWER(:exactMatch) THEN 2
                    ELSE 3
                END,
                s.views DESC
            LIMIT 20
        `;

        const [results] = await db.sequelize.query(sql, {
            replacements: {
                searchQuery: searchQuery,
                exactMatch: `%${keyword}%`
            },
            transaction
        });

        await transaction.commit();

        const formattedResults = results.map(song => ({
            id: song.id,
            title: song.title,
            thumbnailUrl: song.thumbnailUrl,
            duration: song.duration,
            views: song.views,
            artist: {
                id: song.artistId,
                name: song.artistName
            }
        }));

        resolve({
            err: 0,
            msg: 'Search completed successfully',
            songs: formattedResults
        });

    } catch (error) {
        await transaction.rollback();
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});