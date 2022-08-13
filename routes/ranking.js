const express = require('express');
const router = express.Router();
const tools = require('../lib/tools');

// mongo db
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'nextbrainDB';
const collName = 'ranking';

router.get('/nuguri', (req, res) => {
  async function run() {
    const mongoClient = new MongoClient(uri);
    try {
        
        const mongodb = mongoClient.db(dbName);
        const coll = mongodb.collection(collName);

        // find code goes here
        let data = await coll.find({"game":"nuguri"}).sort({"score":-1,"timestamp":-1,"user":1}).toArray();
        // console.log('ranking.state', 'prettyData 1', data);
        let prettyData = tools.prettyData(data);
        // console.log('ranking.state', 'prettyData 2', prettyData);

        res.render('ranking', {gamename:'Nuguri Math', ranking: prettyData});

    } finally {
      await mongoClient.close();
    }
  }
  run().catch(console.dir);  

});

router.post('/nuguri', (req, res) => {
  // console.log('/ranking/state','req.uesr', req.user);
  // console.log('/ranking/state','req.body', req.body);
  

  if( global.debug != true && !global.checkLogin(req) ) {
    let msg = `Due to disconnection, recording your score failed! Please login again!`;
    let retObj = {'result':'0', msg};
    res.json(retObj);
  }
  else {
    let data = req.body;

    data.game = 'nuguri';
    data.timestamp = Date.now();
    if( global.debug ) {
      data.user = 'Guest';
      data.school = 'Nowhere';
    }
    else {
      data.user = req.user.username;
      data.school = req.user.school;
    }
  
    async function run() {
        const mongoClient = new MongoClient(uri);
        try {
          const mongodb = mongoClient.db(dbName);
          const coll = mongodb.collection(collName);
          // create a document to insert
          const result = await coll.insertOne(data);
          let msg = `Your score has been recorded!`;
          let retObj = {'result':'1', msg, 'insertid':result.insertedId};
          console.log('/ranking/state', retObj);
          res.json(retObj);
          
        } finally {
          await mongoClient.close();
        }
    }
    run().catch(console.dir); 
  }

});


router.get('/state', (req, res) => {
    console.log('Got a request : ranking, GET');

    async function run() {
        const mongoClient = new MongoClient(uri);
        try {
            
            const mongodb = mongoClient.db(dbName);
            const coll = mongodb.collection(collName);

            // find code goes here
            let data = await coll.find({"game":"state"}).sort({"score":-1,"timestamp":-1,"user":1}).toArray();
            // console.log('ranking.state', 'prettyData 1', data);
            let prettyData = tools.prettyData(data);
            // console.log('ranking.state', 'prettyData 2', prettyData);

            res.render('ranking', {gamename:'State Challenge', ranking: prettyData});

        } finally {
          await mongoClient.close();
        }
    }
    run().catch(console.dir); 

});


router.post('/state', (req, res) => {
  console.log('/ranking/state','req.uesr', req.user);
  console.log('/ranking/state','req.body', req.body);
  // res.send('hello, post');
  

  if( global.debug != true && !global.checkLogin(req) ) {
    let msg = `Due to disconnection, recording your score failed! Please login again!`;
    let retObj = {'result':'0', msg};
    res.json(retObj);
  }
  else {
    let data = req.body;

    data.game = 'state';
    data.timestamp = Date.now();
    if( global.debug ) {
      data.user = 'Guest';
      data.school = 'Nowhere';
    }
    else {
      data.user = req.user.username;
      data.school = req.user.school;
    }
  
    async function run() {
        const mongoClient = new MongoClient(uri);
        try {
          const mongodb = mongoClient.db(dbName);
          const coll = mongodb.collection(collName);
          // create a document to insert
          const result = await coll.insertOne(data);
          let msg = `Your score has been recorded!`;
          let retObj = {'result':'1', msg, 'insertid':result.insertedId};
          console.log('/ranking/state', retObj);
          res.json(retObj);
          
        } finally {
          await mongoClient.close();
        }
    }
    run().catch(console.dir); 
  }

});



module.exports = router;