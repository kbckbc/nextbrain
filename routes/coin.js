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
    // console.log('/coin', 'Time: ', Date.now(),'/req.user', req.user);
  
    if(!global.checkLogin(req)) {
      res.json({"result":false, "msg":"You should signup to get a coin."});
    }
    else {
      next();
    }
  }
});


router.post('/inc', (req, res) => {
  // console.log('coin', 'inc', 'req.body', req.body);
  // console.log('coin', 'inc', 'req.user', req.user);
  if(global.debug) {
    res.send({"result":true,"coin":999});
    return;
  }

  async function run() {
    try {
      const coll = await tools.getDb("user");
      let dbresult;
      let result = {"result":false,"coin":0, "msg":"Oh, there's some problem. Coin hasn't updated."};
      
      // increase coin
      if( req.body.type == 'inc') {
        dbresult = await coll.updateOne(
          {"username":req.user.username},
          { $inc: { coin: req.body.coin}} 
        );

        if(dbresult.modifiedCount == 1) {
          // update session coin info
          req.user.coin += req.body.coin;  
          result = {"result":true,"coin":req.user.coin,"msg":"success"};
        }
      }
      // decrease coin
      else {
        dbresult = await coll.findOneAndUpdate(
          {"username":req.user.username, "coin":{$gte:req.body.coin}},
          { $inc: { coin: req.body.coin * -1} } 
        );

        if(dbresult.ok == 1 && dbresult.value != null) {
          // update session coin info
          req.user.coin -= req.body.coin;  
          result = {"result":true,"coin":req.user.coin,"msg":"success"};
        }          
      }
      // console.log('coin','inc','dbresult',dbresult);
      // console.log('coin','inc','result',result);

      res.send(result);
    } catch(err) {
      console.log('coin.js','post',err);
    }
  }
  run().catch(console.dir); 
});

module.exports = router;