const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
const app = express()
const port = process.env.PROt || 3000
// 1Gi8RaLUWtnwHlxl
app.use(cors())
app.use(express.json())
const uri = "mongodb+srv://myassignmentDB:1Gi8RaLUWtnwHlxl@cluster0.8uqf12b.mongodb.net/?appName=Cluster0";
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
    await client.connect();
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



    app.get("/mygallry",async(req,res)=>{
      const email = req.query.email 
      const result = await products.find({created_by:email}).toArray()
      res.send(result)
    })

    //   app.get("/search", async(req, res) => {
    //   const search_text = req.query.search
    //   const result = await products.find({name: {$regex: search_text, $options: "i"}}).toArray()
    //   res.send(result)
    // })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
