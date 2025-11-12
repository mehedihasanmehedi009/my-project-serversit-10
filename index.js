const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
require("dotenv").config()
const app = express()
const port = process.env.PROT
 || 3000
// 1Gi8RaLUWtnwHlxl
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8uqf12b.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})
async function run() {
  try {
    // await client.connect();
    const main = client.db("maindb")
    const products = main.collection("product")
    const MyFavorites = main.collection("MyFavorites")

    
    app.post("/product",async(req,res)=>{
        const newproduct = req.body
        const result=await products.insertOne(newproduct)
        res.send(result)
    })



    app.post("/MyFavorites",async(req,res)=>{
      const data= req.body
      const result =await MyFavorites.insertOne(data)
      res.send(result)
    })

    app.get("/MyFavorites",async(req,res)=>{
      const cursor = MyFavorites.find()
       const  result = await cursor.toArray()
       res.send(result)
    })

    // all get
    app.get("/letst",async(req,res)=>{
        const  cursor = products.find().sort({  created_at: -1 }).limit(6);
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get("/product",async(req,res)=>{
      const cursor =products.find()
      const result = await cursor.toArray()
      res.send(result)
    })
       app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    });


     
    app.delete("/MyFavorites/:id",async(req,res)=>{
    const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await MyFavorites.deleteOne(query);
      res.send(result)
    }) 
    
 
  app.delete("/mygallry/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await products.deleteOne(query);
  res.send(result);
});

    app.get("/mygallry",async(req,res)=>{
      const email = req.query.email 
      const result = await products.find({created_by:email}).toArray()
      res.send(result)
    })

app.put("/mygallry/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const query = { _id: new ObjectId(id) };
  const update = {
    $set: updatedData
  };
  const result = await products.updateOne(query, update);
  res.send(result);
});
app.get("/mygallry/:id", async (req, res) => {
  const id = req.params.id;
  const result = await products.findOne({ _id: new ObjectId(id) });
    res.send(result);
});


    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
