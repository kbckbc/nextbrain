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

  return router;
};