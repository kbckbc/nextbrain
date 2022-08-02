const express = require('express');
const router = express.Router();

// mongo db
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'nextbrainDB';
const collName = 'ranking';


router.get('/nuguri', (req, res) => {
  res.render('ranking', {caller:'nuguri'});
});

router.post('/state', (req, res) => {
  console.log('Got a request : ranking, POST', req.body);

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


router.get('/state', (req, res) => {
    console.log('Got a request : ranking, GET');

    async function run() {
        const mongoClient = new MongoClient(uri);
        try {
            
            const mongodb = mongoClient.db(dbName);
            const coll = mongodb.collection(collName);

            // find code goes here
            let data = await coll.find().toArray();
            // res.json(data);
            console.log('ranking.state', data);

            res.render('ranking', {caller:'state', ranking: data});

        } finally {
          await mongoClient.close();
        }
    }
    run().catch(console.dir); 

});

function refineData(data) {

}


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