const express = require('express');
const { session } = require('passport');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  if(global.debug) {
    next();
  }
  else {
    console.log('/coin', 'Time: ', Date.now(),'/req.user', req.user);
  
    if(!global.checkLogin(req)) {
      console.log('/coin', 'login disconnected');
      res.redirect('/auth/login');
    }
    else {
      console.log('/coin', 'login connected');
      next();
    }
  }
});


router.post('/inc', (req, res) => {
  console.log('coin', 'inc', 'req.body', req.body);
  console.log('coin', 'inc', 'req.user', req.user);

    // // mongo db
    const { MongoClient } = require("mongodb");
    const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
    const dbName = 'nextbrainDB';
    const collName = 'user';

    async function run() {
      const mongoClient = new MongoClient(uri);
      try {
        const mongodb = mongoClient.db(dbName);
        const coll = mongodb.collection(collName);
        // create a document to insert
        let dbresult;
        let result = {"result":false};

        if( req.body.type == 'inc') {
          dbresult = await coll.updateOne(
            {"username":req.user.username},
            { $inc: { coin: req.body.coin}} 
          );

          if(dbresult.modifiedCount == 1) {
            // update session coin info
            req.user.coin += req.body.coin;  
            result = {"result":true,"coin":req.user.coin};
          }
        }
        else {
          dbresult = await coll.findOneAndUpdate(
            {"username":req.user.username, "coin":{$gte:req.body.coin}},
            { $inc: { coin: req.body.coin * -1} } 
          );

          if(dbresult.ok == 1 && dbresult.value != null) {
            // update session coin info
            req.user.coin -= req.body.coin;  
            result = {"result":true,"coin":req.user.coin};
          }          
        }
        console.log('coin','inc','dbresult',dbresult);
        console.log('coin','inc','result',result);

        res.send(result);
      } finally {
        await mongoClient.close();
      }
    }
    run().catch(console.dir); 
});

module.exports = router;