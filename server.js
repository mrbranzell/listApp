require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const { port, mongoURI } = require('./config')
const itemRoutes = require('./routes/items')
const translationRoute = require('./routes/translate')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongoDB connected'))
  .catch((err) => console.log(err))

app.use('/api/items', itemRoutes)
app.use('/api/translation', translationRoute)

app.get('/', (req, res) => res.send('hello you'))

app.listen(port, () => console.log(`server running on port ${port}`))
