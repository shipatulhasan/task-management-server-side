const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bubu from node");
});

const client = new MongoClient(process.env.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const tasksCollection = client.db("taskManager").collection("tasks");
    const commentsCollection = client.db("taskManager").collection("comments");
    const usersCollection = client.db("taskManager").collection("users");

    // apis

    // users

    app.post("/user",async(req,res)=>{
      const user = req.body
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    app.get('/jwt',async(req,res)=>{
      const email = req.query.email
      const filter = {email:email}
      const user = await usersCollection.findOne(filter)
      if(user){
        const token = jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'1d'})
        return res.send({token})
      }
  res.status(401).send({token:''})
    })

    // tasks

    app.get("/task/:email", async (req, res) => {
      const email = req.params.email
      const filter = {email:email}
      const result = await tasksCollection.find(filter).sort({_id:-1}).toArray();

      res.send(result);
      
    });
    app.post("/task", async (req, res) => {
      const task = req.body;

      const result = await tasksCollection.insertOne(task);
      setTimeout(() => {
        res.send(result);
      }, 200);
    });
 
    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const post = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: post,
      };
      const result = await tasksCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send({ result, id });
      
    });
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const find = { _id: ObjectId(id) };
      const result = await tasksCollection.deleteOne(find);
      res.send({ result, id });
    
    });

    // comments
    app.get("/comment/:id", async (req, res) => {
      const task = req.params.id
  
      const filter = {task:task}
      
      const result = await commentsCollection.find(filter).sort({_id:-1}).toArray();


      res.send(result);
      
    });
    app.post("/comment", async (req, res) => {
      const comment = req.body;

      const result = await commentsCollection.insertOne(comment);
      setTimeout(() => {
        res.send(result);
      }, 200);
    });



  } finally {
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`listing from ${port}`);
});
