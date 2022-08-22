const express = require('express');
const router = express.Router();
const tools = require('../lib/tools')

module.exports = function (passport) {
  router.get('/login', function(req, res, next) {
    // console.log('req', req.flash());
    res.render('login',{"errorMsg":req.flash().error});
  });
  
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash:true
  }));

  router.get('/logout', function(req, res, next) {
    // console.log('auth', '/logout 1', req.user, 'req.session', req.session);
    if (req.session) {
      req.session.destroy();
    }
    // console.log('auth', '/logout 2', req.user, 'req.session', req.session);
    res.redirect('/');
  });  
  
  router.get('/signup', function(req, res, next) {
    res.render('signup');
  });

  router.post('/signup', function(req, res, next) {
    // console.log('auth', '/signup', 'req.body', req.body);

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

    tools.getDb('user')
      .then((coll) => {
        coll.findOne({"username":req.body.username})
          .then(result => {
            if( result != null ) {
              res.render('signup_re', {"result":0, "msg":`The Username '${req.body.username}' is in use. Try another one again!`});
            }
            else {
              coll.insertOne(data)
                .then(result => {
                  console.log('insertOne', result);
                  res.render('signup_re', {"result":1, "msg":"Your account has been created!"});
                })
            }
          })
          .catch(err => console.log(err));
      })    
      .catch(err => console.log(err));     
  });



  router.get('/mypage', function(req, res, next) {
    if( req.user == null) {
      res.render('login');
    }
    else 
    {
      tools.getDb('user')
      .then((coll) => {
        coll.findOne({"username":req.user.username})
          .then(result => {
            console.log('result', result);

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
  
              res.render('mypage', {user:result});
            }

          })
          .catch(err => console.log(err));
      })    
      .catch(err => console.log(err)); 
    }
  });

  router.post('/delete', function(req, res, next) {

    tools.getDb('user')
      .then((coll) => {
        coll.deleteOne({"username":req.user.username})
          .then(result => {
            if (req.session) {
              req.session.destroy();
            }    
            res.render('delete');
          })
          .catch(err => console.log(err));
      })    
      .catch(err => console.log(err)); 

  });  

  return router;
};