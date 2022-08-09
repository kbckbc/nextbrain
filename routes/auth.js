const express = require('express');
const router = express.Router();

module.exports = function (passport) {
  router.get('/login', function(req, res, next) {
    res.render('login');
  });
  
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/game/state',
    failureRedirect: '/auth/login'
  }));
  
  router.get('/signup', function(req, res, next) {
    res.render('signup');
  });

  router.post('/signup', function(req, res, next) {
    console.log('auth', '/signup', 'req.body', req.body);

    // prepare user data
    let data = req.body;
    data.joindate = Date.now();
    data.coin = 0;
    

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

    res.redirect('/');
  });

  router.get('/logout', function(req, res, next) {
    console.log('auth', '/logout 1', req.user, 'req.session', req.session);
    if (req.session) {
      req.session.destroy();
    }
    console.log('auth', '/logout 2', req.user, 'req.session', req.session);
    res.redirect('/');
  });

  router.get('/mypage', function(req, res, next) {
    console.log('mypage1', req.body);
    console.log('mypage2', req.user);
    if(req.user != null ) {
      // req.user.joindate = new Date(req.user.joindate).toUTCString();
      req.user.joindate = new Date(req.user.joindate).toISOString().split('T')[0];
      switch ( req.user.grade ) {
        case '0':
          req.user.grade = 'Kindergarten';
          break;
        case '1':
          req.user.grade = 'Elementary';
          break;
        case '2':
          req.user.grade = 'Middle';
          break;
        case '3':
          req.user.grade = 'High';
          break;
        case '4':
          req.user.grade = 'Others';
          break;
      }
    }
    res.render('mypage', {user:req.user});
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