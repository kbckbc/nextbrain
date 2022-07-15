var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var crypto = require('crypto');

passport.use(new LocalStrategy(function verify(username, password, cb) {
  console.log('LocalStrategy', username, password);
  // db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
  //   if (err) { return cb(err); }
  //   if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

  //   crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
  //     if (err) { return cb(err); }
  //     if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
  //       return cb(null, false, { message: 'Incorrect username or password.' });
  //     }
  //     return cb(null, row);
  //   });
  // });
}));


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;