import { testConnection } from './src/config/connect'
import initRoute from './src/route'

const express = require('express')
const cors = require('cors')

require('dotenv').config()

const app = express()

app.use(cors({
    origin: "*",
    methods: ['POST', 'GET', 'PUT', 'DELETE']
}))


app.use(express.json())

app.use(express.urlencoded({ extended: true }))

initRoute(app)

testConnection()

const listener = app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + listener.address().port);
})
