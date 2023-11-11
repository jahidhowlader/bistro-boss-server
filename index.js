const express = require('express')
const app = express()
// const cors = require('cors')
const port = process.env.PORT || 3000


// MIDDLEWARE
// app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {

    res.send('Hello world H ')
})

app.listen(port, () => {
    console.log('Server is running on,', port);
})