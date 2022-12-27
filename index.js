const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Bubu from node')
})


const client = new MongoClient(process.env.uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async()=>{
    try{
        const tasksCollection = client.db("taskManager").collection("tasks");
        
        // apis
        
        app.get('/task',async(req,res)=>{
            const result = await tasksCollection.find({}).toArray()
            res.send(result)
        })
        app.post('/task',async(req,res)=>{
            const task = req.body
            const result = await tasksCollection.insertOne(task)
            res.send(result)
        })

    }
    finally{}
}
run().catch(console.dir)



app.listen(port,()=>{
    console.log(`listing from ${port}`)
})