import db from '../models';

export const getLatestAlbum = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Album.findOne({
            include: [
                {
                    model: db.Song, as: 'songs',
                    attributes: ['thumbnailUrl'],
                    include: [
                        { model: db.Artist, as: 'artist', attributes: ['name'] }
                    ],
                    limit: 4
                }
            ],
            attributes: ['id', 'title'],
            order: [['createdAt', 'DESC']]
        })

        if (!response) {
            resolve({
                err: 1,
                msg: 'No album found',
                data: null
            })
            return
        }

        const thumbnailSet = new Set(response.songs.map(song => song.thumbnailUrl));
        const namesSet = new Set(response.songs.map(song => song.artist.name));

        const formattedAlbums = {
            id: response?.id,
            title: response?.title,
            thumbnails: Array.from(thumbnailSet), // Convert Set back to Array
            names: Array.from(namesSet) // Convert Set back to Array
        };

        resolve({
            err: 0,
            msg: 'Got latest album successfully',
            data: formattedAlbums
        })

    } catch (error) {
        console.log(JSON.stringify(error))
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

export const getAlbumsAndSongs = () => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
        const [albumsData] = await db.sequelize.query(`
            WITH top_albums AS (
                SELECT id, title 
                FROM Albums 
                ORDER BY createdAt DESC 
                LIMIT 5
            ),
            album_songs AS (
                SELECT s.*, a.title as album_title, a.id as album_id
                FROM Songs s
                JOIN top_albums a ON s.albumId = a.id
                WHERE (
                    SELECT COUNT(*) 
                    FROM Songs s2 
                    WHERE s2.albumId = s.albumId 
                    AND s2.id <= s.id
                ) <= 4
            )
            SELECT 
                as2.album_id,
                as2.album_title,
                as2.thumbnailUrl,
                art.name as artist_name
            FROM album_songs as2
            LEFT JOIN Artists art ON as2.artistId = art.id
            ORDER BY as2.albumId;
        `, { transaction });

        const artists = await db.Artist.findAll({
            attributes: ['id', 'name', 'thumbnail'],
            limit: 5
        }, { transaction });

        const albumsMap = new Map();

        albumsData.forEach(row => {
            if (!albumsMap.has(row.album_id)) {
                albumsMap.set(row.album_id, {
                    id: row.album_id,
                    title: row.album_title,
                    thumbnails: new Set(),
                    names: new Set()
                });
            }

            const album = albumsMap.get(row.album_id);
            if (row.thumbnailUrl) album.thumbnails.add(row.thumbnailUrl);
            if (row.artist_name) album.names.add(row.artist_name);
        });

        const formattedAlbums = Array.from(albumsMap.values()).map(album => ({
            id: album.id,
            title: album.title,
            thumbnails: Array.from(album.thumbnails),
            names: Array.from(album.names)
        }));

        await transaction.commit()
        resolve({
            err: 0,
            msg: 'Got albums and songs successfully',
            albums: formattedAlbums,
            artists
        });
    } catch (error) {
        console.log(JSON.stringify(error))
        await transaction.rollback();
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})

