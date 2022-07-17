const express = require('express');
const router = express.Router();
const currPath = '';

module.exports = function (passport) {
  router.get(currPath + '/login', function(req, res, next) {
    res.render('login');
  });
  
  router.post(currPath + '/login/password', passport.authenticate('local', {
    successRedirect: '/game/state',
    failureRedirect: '/auth/login'
  }));
  
  router.get(currPath + '/signup', function(req, res, next) {
    res.render('signup');
  });

  router.get(currPath + '/logout', function(req, res, next) {
    console.log('auth', '/logout 1', req.user, 'req.session', req.session);
    if (req.session) {
      req.session.destroy();
    }
    console.log('auth', '/logout 2', req.user, 'req.session', req.session);
    res.redirect('/');
  });


  return router;
};