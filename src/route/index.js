import authRoute from './auth'
import genreRoute from './genre'
import songRoute from './song'

const initRoute = (app) => {
    app.use('/api/v1/auth', authRoute)
    app.use('/api/v1/song', songRoute)
    app.use('/api/v1/genre', genreRoute)

    return app.use('/', (req, res) => {
        res.send('Server on')
    })
}

export default initRoute