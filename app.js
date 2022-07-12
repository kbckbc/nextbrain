// express
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

// nedb
const nedb = require('nedb');
const nedbDB = new nedb('database.db');
nedbDB.loadDatabase();

// mongo db
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';

const dbName = 'nextbrainDB';
const colName = 'state';

app.listen(port, () => {
    console.log(`listening at ${port}`);
    console.log('uri', uri);
});

app.post('/state/ranking', (req, res) => {
    const data = req.body;
    console.log('Got a request : ranking, POST', data);
    // nedbDB.insert(data);

    async function run() {
        const mongoClient = new MongoClient(uri);
        try {
          const mongodb = mongoClient.db(dbName);
          const coll = mongodb.collection(colName);
          // create a document to insert
          const result = await coll.insertOne(data);
          console.log(`A document was inserted with the _id: ${result.insertedId}`);
        } finally {
          await mongoClient.close();
        }
    }
    run().catch(console.dir); 

    res.json(data);
});

app.get('/state/ranking', (req, res) => {
    console.log('Got a request : ranking, GET');
    // nedbDB.find({}, (err, data) => {
    //     res.json(data);
    // });

    async function run() {
        const mongoClient = new MongoClient(uri);
        try {
            
            const mongodb = mongoClient.db(dbName);
            const coll = mongodb.collection(colName);

            // find code goes here
            let data = await coll.find().toArray();
            console.log('data', data);
            res.json(data);
        } finally {
          await mongoClient.close();
        }
    }
    run().catch(console.dir); 

});




