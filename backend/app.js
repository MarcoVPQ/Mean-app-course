const express = require('express');
const bodyParser = require('body-parser')
const path = require('path')

const app = express();

const cors = require('./middlewares/cors')
require('./db/db')

app.use(cors())
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join('backend/uploads')))

//Routes
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')

app.use('/api/posts', postRoutes)
app.use('/api/user', userRoutes)


module.exports = app
