const express = require('express');
const router = express.Router();

module.exports = function (passport) {
  router.get('/login', function(req, res, next) {
    res.render('login');
  });
  
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }));

  router.get('/logout', function(req, res, next) {
    console.log('auth', '/logout 1', req.user, 'req.session', req.session);
    if (req.session) {
      req.session.destroy();
    }
    console.log('auth', '/logout 2', req.user, 'req.session', req.session);
    res.redirect('/');
  });  
  
  router.get('/signup', function(req, res, next) {
    res.render('signup');
  });

  router.post('/signup', function(req, res, next) {
    console.log('auth', '/signup', 'req.body', req.body);

    // prepare user data
    let data = req.body;
    data.joindate = Date.now();
    data.coin = 10;
    

    var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(data.password, salt, function(err, hash) {
            data.password = hash;
            delete data.password2;
        });
    });


    // // mongo db
    const { MongoClient } = require("mongodb");
    const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
    const dbName = 'nextbrainDB';
    const collName = 'user';

    console.log('111');

    async function run() {
      const mongoClient = new MongoClient(uri);
      try {
        const mongodb = mongoClient.db(dbName);
        const coll = mongodb.collection(collName);
        // create a document to insert
        let result = await coll.findOne({"username":req.body.username});

        console.log('222');
        console.log('findOne', result);
        if( result != null ) {
          console.log('333-1');          
          res.render('signup_re', {"result":0, "msg":`The Username '${req.body.username}' is in use. Try another one again!`});
        }
        else {
          console.log('333-2');
          result = await coll.insertOne(data);
          console.log('insertOne', result);
          res.render('signup_re', {"result":1, "msg":"Your account has been created!"});
        }
      } finally {
        await mongoClient.close();
      }
    }
    run().catch(console.dir); 
    
    console.log('444');
  });



  router.get('/mypage', function(req, res, next) {
    if( req.user == null) {
      res.render('login');
    }
    else 
    {
      let MongoClient = require('mongodb').MongoClient;
      const uri = process.env.MONGODB_URI || 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
  
      MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("nextbrainDB");
        dbo.collection("user").findOne({username:req.user.username}, function(err, result) {
          if (err) throw err;
          db.close();

          if(req.user.password == result.password) {
  
            if(req.user != null ) {
              // req.user.joindate = new Date(req.user.joindate).toUTCString();
              result.joindate = new Date(req.user.joindate).toISOString().split('T')[0];
              switch ( req.user.grade ) {
                case '0':
                  result.grade = 'Kindergarten';
                  break;
                case '1':
                  result.grade = 'Elementary';
                  break;
                case '2':
                  result.grade = 'Middle School';
                  break;
                case '3':
                  result.grade = 'High School';
                  break;
                case '4':
                  result.grade = 'Others';
                  break;
              }
            }

            console.log('aaaaaa',result);

            res.render('mypage', {user:result});
          }
        });
      });
    }
  });

  router.post('/delete', function(req, res, next) {
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
        const result = await coll.deleteOne({"username":req.user.username});
        
      } finally {
        await mongoClient.close();
      }
    }
    run().catch(console.dir); 

    if (req.session) {
      req.session.destroy();
    }    
    res.render('delete');
  });  

  return router;
};