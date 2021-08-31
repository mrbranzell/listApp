require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const { port, mongoURI } = require('./config')
const itemRoutes = require('./routes/items')
const translationRoute = require('./routes/translate')
const path = require('path')

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

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/public'))
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'))
  })
}

app.listen(port, () => console.log(`server running on port ${port}`))


app.listen(port, () => console.log(`server running on port ${port}`))
