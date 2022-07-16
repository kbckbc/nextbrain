const express = require('express');
const router = express.Router();
const currGame = '/state';

// mongo db
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'nextbrainDB';
const collName = 'state';

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('/game/state, Time: ', Date.now(),'/req.user', req.user);

  if(req.user == undefined) {
    res.redirect('/');
  }
  else {
    next();
  }
});



router.get(currGame, (req, res) => {
  res.render('state');
});


router.post(currGame + '/ranking', (req, res) => {
  console.log('Got a request : ranking, POST');

    const data = req.body;

    async function run() {
        const mongoClient = new MongoClient(uri);
        try {
          const mongodb = mongoClient.db(dbName);
          const coll = mongodb.collection(collName);
          // create a document to insert
          const result = await coll.insertOne(data);
          console.log(`A document was inserted with the _id: ${result.insertedId}`);
        } finally {
          await mongoClient.close();
        }
    }
    run().catch(console.dir); 
});


router.get(currGame + '/ranking', (req, res) => {
    console.log('Got a request : ranking, GET');

    async function run() {
        const mongoClient = new MongoClient(uri);
        try {
            
            const mongodb = mongoClient.db(dbName);
            const coll = mongodb.collection(collName);

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