const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port= process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.wxf5f5n.mongodb.net/?retryWrites=true&w=majority`;

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
    const usersCollection = client.db('admission-portal').collection('users');
    const collageCollection = client.db('admission-portal').collection('collages');
    const galleryCollection = client.db('admission-portal').collection('gallery');
    const reviewsCollection = client.db('admission-portal').collection('reviews');
    const myCollageCollection = client.db('admission-portal').collection('mycollage');


    // user API=================
    app.post('/user', async(req, res) =>{
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
    })
    app.get('/user/:email', async(req, res) =>{
        const email = req.params.email;
        const query = {email: email}
        const result = await usersCollection.findOne(query);
        res.send(result);
    })

    // collage API ============

    app.get('/collages', async(req, res) => {
      const result = await collageCollection.find().toArray();
      res.send(result);
    })
    app.get('/collages/:id', async(req, res) => { 
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await collageCollection.findOne(query);
      res.send(result);
    })

    //Search collage
    app.get('/search',async(req,res) => {
      const searchText = req.query.text;
      const filter = {collegeName: {$regex: searchText,$options: "i"}}
      const result = await collageCollection.find(filter).toArray();
      res.send(result);
    })

    
    // Gallery api

    app.get('/gallery',async(req,res) => {
      const result = await galleryCollection.find().toArray();
      res.send(result);
    })

    // Review API
    app.get('/reviews',async(req,res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    })

    app.post('/reviews',async(req,res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    })

    // MY collage API
    app.get('/myCollage',async(req,res) => {
      const email = req.query.email;
      const query = {email: email}
      const result = await myCollageCollection.findOne(query);
      res.send(result);
    })
    app.post('/myCollage',async(req,res) => {
      const collage = req.body;
      const result = await myCollageCollection.insertOne(collage);
      res.send(result);
    })

    app.put('/user/:email', async(req, res) =>{
      const email = req.params.email;
      const collage = req.body;
      const query = {email: email};
      const option = {upsert: true};
      const updatedDoc = {
        $set: {
           ...collage
        }
      } 
      const result = await usersCollection.updateOne(query,updatedDoc,option)
      res.send(result);
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


app.get('/', (req,res) => {
    res.send("Admission portal server running.......")
})
app.listen(port, () => {
    console.log("Admission portal server listening on port: localhost:" + port);
})