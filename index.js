const express = require('express')
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express()

// Middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h88b4w7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const menuCollection = client.db("bistroDB").collection("menu")
    const cartCollection = client.db("bistroDB").collection("carts")

    // User related API
    app.post('users', async (req, res) => {

      const user = req.body

      const result = await cartCollection.insertOne(user)
      res.send(result)
    })

    // menu related API
    app.get('/menu', async (req, res) => {

      const result = await menuCollection.find().toArray()
      res.send(result)
    })

    // Add Cart API List
    app.get('/carts', async (req, res) => {

      const email = req.query.email
      if (!email) {
        return res.send([])
      }
      const query = { email };
      const cursor = await cartCollection.find(query).toArray();
      res.send(cursor)
    })

    app.post('/carts', async (req, res) => {

      const newItem = req.body

      const result = await cartCollection.insertOne(newItem)
      res.send(result)
    })

    app.delete('/carts', async (req, res) => {

      const email = req.query.email

      const query = { email }
      const result = await cartCollection.deleteMany(query)
      res.send(result)
    })

    app.delete('/carts/:_id', async (req, res) => {

      const _id = req.params._id

      const query = { _id: new ObjectId(_id) }
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})