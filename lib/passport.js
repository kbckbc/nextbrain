

module.exports = (app) => {
  // passport
  const passport = require('passport');
  const session = require('express-session');
  const SQLiteStore = require('connect-sqlite3')(session);
  const sessionTime = 1000 * 1 * 10;
  const userdb = [
    {username:"jisung",  password:"jisung", nickname:'jiji'},
    {username:"chan",  password:"chan", nickname:'chacha'},
  ];

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
    console.log('deserial', user);
    process.nextTick(function() {
      return cb(null, user);
    });
  });

  function checkUserAndPassword(id, password = '') {
    if(id != '' && password == '') {
      for(row of userdb) {
        if(row.username == id) {
          return row;
        }
      }
    }
    else if(id != '' && password != '') {
      for(row of userdb) {
        if(row.username == id && row.password == password) {
          return row;
        }
      }
    }
    console.log('checkUser failed');
    return null;
  } 

  const LocalStrategy = require('passport-local').Strategy;
  passport.use(new LocalStrategy(function verify(username, password, cb) {
    console.log('LocalStrategy', username, password);
    
    if(checkUserAndPassword(username) != null) {
      let findUser = checkUserAndPassword(username, password);
      if( findUser != null) {
        console.log('login success session', session.Cookie);
        return cb(null, findUser);
      }
      else {
        return cb(null, false, { message: 'Incorrect username or password.' });  
      }
    } else {
      return cb(null, false, { message: 'Incorrect username or password.' });
    }
    
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

  return passport;

}
