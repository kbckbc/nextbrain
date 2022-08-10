module.exports = (app) => {
  // passport
  const passport = require('passport');
  const session = require('express-session');
  const SQLiteStore = require('connect-sqlite3')(session);
  const sessionTime = 1000 * 1 * 30;

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: sessionTime }, // value of maxAge is defined in milliseconds. 
    store: new SQLiteStore({ db: 'sessions.db', dir: './' })
  }));
  app.use(passport.authenticate('session'));

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, user);
    });
  });

  passport.deserializeUser(function(user, cb) {
    // console.log('passport', 'deserial', user);
    process.nextTick(function() {
      return cb(null, user);
    });
  });

  const LocalStrategy = require('passport-local').Strategy;
  passport.use(new LocalStrategy(function verify(username, password, cb) {
    console.log('LocalStrategy', username, password);
    
    let MongoClient = require('mongodb').MongoClient;
    const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';

    MongoClient.connect(uri, function(err, db) {
      if (err) throw err;
      var dbo = db.db("nextbrainDB");
      dbo.collection("user").findOne({username:username}, function(err, result) {
        if (err) throw err;
        db.close();

        // console.log('passport', 'verify', 'result', result);
        if( result == null ) {
          return cb(null, false, { message: `There's no such user. Sign up if you're new here`});  
        }
        
        if(require('bcryptjs').compareSync(password, result.password)) {
          return cb(null, result);
        }
        else {
          return cb(null, false, { message: 'Incorrect username or password.' });  
        }
      });
    });
  }));


/* 비동기 방식 좀 더 공부하고 교체하자 
  async function checkUserAndPassword(id, password = '') {
    let result = {};

    const { MongoClient } = require("mongodb");
    const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
    const dbName = 'nextbrainDB';
    const collName = 'user';

    async function run() {
      const mongoClient = new MongoClient(uri);
      try {
          
          const mongodb = mongoClient.db(dbName);
          const coll = mongodb.collection(collName);

          // find code goes here
          result = await coll.findOne({username:id});
          console.log('passport.js', 'read db success', result, id, password);

          if(Object.keys(result).length != 0 && 
            result.username == id && result.password == password) {
            console.log('passport.js', 'checkuser success');
            return result;
          }
          else {
            console.log('passport.js', 'checkuser fail');
            return null;
          }
      } finally {
        await mongoClient.close();
      }
    }
    run().catch(console.dir); 
  } 
  */  

  return passport;

}
