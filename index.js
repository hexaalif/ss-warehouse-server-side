const express = require('express');
const cors = require('cors')
// const jwt = require('jwtwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1lyg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const updateItemCollection = client.db('ss-warehouse').collection('updateProducts')
        
        // auth
        app.post('/login', async(req, res) =>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            })
            res.send({accessToken})
        })

        // add inventory
        app.get('/update/:updateId', async(req, res) =>{
            const id = req.params.updateId;
            const query = {_id: ObjectId(id)}
            const update = await updateItemCollection.findOne(query)
            res.send(update)
        })
        app.get('/update', async(req, res) =>{
            const query = {}
            const cursor = updateItemCollection.find(query)
            const update = await cursor.toArray()
            res.send(update)
        })
        
        // add item to inventory
        app.post("/additem", async (req, res) => {
        const newItem = req.body;
        const result = await updateItemCollection.insertOne(newItem);
        res.send(result);
      });   

        // update item detail
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const updateItem = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
            $set: {
                name: updateItem.name,
                suplier: updateItem.suplier,
                price: updateItem.price,
                quantity: updateItem.quantity,
                description: updateItem.description,
                image: updateItem.image,
            },
            };
            const result = await updateItemCollection.updateOne(
            filter,
            updateDoc,
            options
            );
            res.send(result);
        });

        // DELETE
        app.delete("/update/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await updateItemCollection.deleteOne(query);
        res.send(result);
      });
    }
    finally{
        // client close;
    }
}

run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('node ok')
})

app.listen( port, () =>{
    console.log('listening to port', port)
})