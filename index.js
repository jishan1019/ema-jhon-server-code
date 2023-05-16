const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


// -------------Middlewere---------
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Ema Jhon Server Running")
})

// -------------Server Connect Code---------

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q1ppz51.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-re8a3ak-shard-00-00.q1ppz51.mongodb.net:27017,ac-re8a3ak-shard-00-01.q1ppz51.mongodb.net:27017,ac-re8a3ak-shard-00-02.q1ppz51.mongodb.net:27017/?ssl=true&replicaSet=atlas-p2ax84-shard-0&authSource=admin&retryWrites=true&w=majority`


// const uri = "mongodb://localhost:27017";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
    try {
      
    const productCollection = client.db('emaJhonDb').collection('products');

    
    await client.connect();
    await client.db("admin").command({ ping: 1 });

      app.get('/products', async(req, res) => {
        
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit;
        console.log(skip);

        const result = await productCollection.find().skip(skip).limit(limit).toArray();
            res.send(result);
        })

      app.get('/totalProduct', async (req, res) => {
        const result = await productCollection.estimatedDocumentCount();
          res.send({totalProduct: result})
      })
      
      
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// -------------Port Ruiing Code Code---------

app.listen(port, () => {
    console.log("Server Running on port 5000");
})