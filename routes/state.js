const express = require('express');
const router = express.Router();
// mongo db
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'nextbrainDB';
const colName = 'state';

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('state.js, Time: ', Date.now());
  // console.log('port', port);
  next();
});

router.post('/ranking', (req, res) => {
  console.log('Got a request : ranking, POST');

    const data = req.body;

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
});

router.get('/ranking', (req, res) => {
    console.log('Got a request : ranking, GET');

    async function run() {
        const mongoClient = new MongoClient(uri);
        try {
            
            const mongodb = mongoClient.db(dbName);
            const coll = mongodb.collection(colName);

            // find code goes here
            let data = await coll.find().toArray();
            res.json(data);
        } finally {
          await mongoClient.close();
        }
    }
    run().catch(console.dir); 

});

module.exports = router;