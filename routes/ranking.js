const express = require('express');
const router = express.Router();
const tools = require('../lib/tools');
const collName = 'ranking';

router.get('/nuguri', (req, res) => {
  tools.getDb(collName)
    .then((coll) => {
      coll.find({"game":"nuguri"}).sort({"score":-1,"timestamp":-1,"user":1}).toArray()
        .then(data => {
          let prettyData = tools.prettyData(data);
          res.render('ranking', {user:req.user, gamename:'Squirrel Math', ranking: prettyData});
        })
        .catch(err => console.log(err));
    })    
    .catch(err => console.log(err));
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

    // insert some information into the data object
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

    tools.getDb(collName)
      .then((coll) => {
        coll.insertOne(data)
          .then(result => {
            let msg = `Your score has been recorded!`;
            let retObj = {'result':'1', msg, 'insertid':result.insertedId};
            console.log('/ranking/state', retObj);
            res.json(retObj);
          })
          .catch(err => console.log(err));
      })    
      .catch(err => console.log(err));    
  }
});


router.get('/state', (req, res) => {
  console.log('Got a request : ranking, GET');

  tools.getDb(collName)
    .then((coll) => {
      coll.find({"game":"state"}).sort({"score":-1,"timestamp":-1,"user":1}).toArray()
        .then(data => {
          let prettyData = tools.prettyData(data);
          res.render('ranking', {user:req.user, gamename:'State Challenge', ranking: prettyData});
        })
        .catch(err => console.log(err));
    })    
    .catch(err => console.log(err));  
});


router.post('/state', (req, res) => {
  // console.log('/ranking/state','req.uesr', req.user);
  // console.log('/ranking/state','req.body', req.body);

  if( global.debug != true && !global.checkLogin(req) ) {
    let msg = `Due to disconnection, recording your score failed! Please login again!`;
    let retObj = {'result':'0', msg};
    res.json(retObj);
  }
  else {
    let data = req.body;

    // insert some information into the data object
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

    tools.getDb(collName)
      .then((coll) => {
        coll.insertOne(data)
          .then(result => {
            let msg = `Your score has been recorded!`;
            let retObj = {'result':'1', msg, 'insertid':result.insertedId};
            console.log('/ranking/state', retObj);
            res.json(retObj);
          })
          .catch(err => console.log(err));
      })    
      .catch(err => console.log(err));        
  }
});

module.exports = router;