import authRoute from './auth'
import commentRoute from './comment'
import genreRoute from './genre'
import newReleasesRoute from './newRelease'
import songRoute from './song'
import userRoute from './user'

const initRoute = (app) => {
    app.use('/api/v1/auth', authRoute)
    app.use('/api/v1/song', songRoute)
    app.use('/api/v1/genre', genreRoute)
    app.use('/api/v1/comment', commentRoute)
    app.use('/api/v1/new-release', newReleasesRoute)
    app.use('/api/v1/user', userRoute)

    return app.use('/', (req, res) => {
        res.send('Server on')
    })
}

export default initRoute