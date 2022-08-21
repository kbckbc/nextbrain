module.exports = {
  prettyData: (data) => {
    let newData = [];
    let rank = 1;
    //console.log('scoreArr', scoreArr);  
    for( let i in data ) {
      let row = data[i];
      let date = new Date(row.timestamp).toISOString().split('T')[0];
      let name = row.user;
      let school = row.school;
      let score = row.score;
      let hit = row.hit;
      let wrong = row.wrong;
      
      name = name.charAt(0).toUpperCase() + name.slice(1);
      school = school.charAt(0).toUpperCase() + school.slice(1);
  
      newData.push({rank, name, school, date, score, hit, wrong});
  
      rank++;      
    }
      // console.log('tools', 'newData', newData);

    return newData;
  },

  // example of implicit Promise return
  getDb1: (collName) => {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';

    return require('mongodb').MongoClient.connect(uri)
      .then(db => db.db("nextbrainDB"))
      .then(db => db.collection(collName))
      .catch(error => console.log("error:", error))
  },
  
  // example of explicit Promise return
  getDb2: (collName) => {
    return new Promise((resolve, reject) => {
      const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
  
      require('mongodb').MongoClient.connect(uri, function(err, db) {
        if (err) reject(new Error(err));
        var dbo = db.db("nextbrainDB");
        let coll = dbo.collection(collName);

        resolve(coll);
      })
    });
  },

  // example of async/await function
  getDb: async (collName) => {
    // // mongo db
    const { MongoClient } = require("mongodb");
    const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
    const dbName = 'nextbrainDB';

    try {
      const mongoClient = new MongoClient(uri);
      const mongodb = await mongoClient.db(dbName);
      return await mongodb.collection(collName);
    }
    catch (err) {
      console.log('getDb2', 'async', err);
    }
  }
};