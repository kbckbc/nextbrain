const express = require('express');
const { session } = require('passport');
const router = express.Router();
const tools = require('../lib/tools')

// middleware that is specific to this router
router.use((req, res, next) => {
  if(global.debug) {
    next();
  }
  else {
    console.log('/coin', 'Time: ', Date.now(),'/req.user', req.user);
  
    if(!global.checkLogin(req)) {
      res.json({"result":0});
    }
    else {
      console.log('/coin', 'login connected');
      next();
    }
  }
});


router.post('/inc', (req, res) => {
  // console.log('coin', 'inc', 'req.body', req.body);
  // console.log('coin', 'inc', 'req.user', req.user);
  if(global.debug) {
    console.log('here');
    res.send({"result":true,"coin":999});
    return;
  }

  async function run() {
    try {
      const coll = await tools.getDb("user");
      console.log('coll',coll);
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
    } catch(err) {
      console.log('coin.js','post',err);
    }
  }
  run().catch(console.dir); 
});

module.exports = router;