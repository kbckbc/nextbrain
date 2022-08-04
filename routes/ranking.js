const express = require('express');
const router = express.Router();
const tools = require('../lib/tools');

// mongo db
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'nextbrainDB';
const collName = 'ranking';

router.get('/nuguri', (req, res) => {
  res.render('ranking', {caller:'nuguri'});
});


router.get('/state', (req, res) => {
    console.log('Got a request : ranking, GET');

    async function run() {
        const mongoClient = new MongoClient(uri);
        try {
            
            const mongodb = mongoClient.db(dbName);
            const coll = mongodb.collection(collName);

            // find code goes here
            let data = await coll.find().toArray();
            let prettyData = tools.prettyData(data);
            // console.log('ranking.state', 'prettyData', prettyData);

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
    const data = req.body;

    data.game = 'state';
    data.timestamp = Date.now();
    data.user = req.user.username;
    data.school = req.user.school;
  
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




function writeScore(data) {
  console.log('data length', data.length);

  let scoreStr = "<< Score Board >><br>";  

  if( data.length == 0) {
    scoreStr += "No one played yet!<br>";
    scoreStr += "Be the first student challenging this game!<br>";
  }
  else {
    let playerNum = data.length;
    scoreStr += `${playerNum} student(s) have challenged this game!<br><br>`;
    
    let sortbyNameAscend = data.slice().sort((a, b) => (a.name - b.name));
    let sortbyHitDescend = sortbyNameAscend.slice().sort((a, b) => b.hit - a.hit);

    let rank = 1;
    //console.log('scoreArr', scoreArr);  
    for( let i in sortbyHitDescend ) {
      let score = sortbyHitDescend[i];
      let timestamp = score.timestamp;
      let date = new Date(timestamp).toUTCString(); 
      let name = score.name;
      let school = score.school;
      let hit = score.hit;
      let wrong = score.wrong;
      
      name = name.charAt(0).toUpperCase() + name.slice(1);
      school = school.charAt(0).toUpperCase() + school.slice(1);

      let lineStr = `Rank #${rank} : ${hit} right answer(s), ${date}, ${name} from ${school}<br>`;
      
      scoreStr += lineStr;
      rank++;      
    }
  }

  return scoreStr;
}



module.exports = router;