import db from '../models'


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
            msg: `Interval server ${error}`
        })
    }
})
