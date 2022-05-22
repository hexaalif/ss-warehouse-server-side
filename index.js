const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1lyg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const updateItemCollection = client.db('ss-warehouse').collection('updateProducts')
        
        app.get('/update', async(req, res) =>{
            const query = {}
            const cursor = updateItemCollection.find(query)
            const update = await cursor.toArray()
            res.send(update)
        })

        app.get('/update/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const update = await updateItemCollection.findOne(query)
            res.send(update)
        })
    }
    finally{

    }
}

run().catch(console.dir)


// middleware
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('node ok')
})

app.listen( port, () =>{
    console.log('listening to port', port)
})