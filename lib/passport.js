module.exports = (app) => {
  // passport
  const passport = require('passport');
  const session = require('express-session');
  const SQLiteStore = require('connect-sqlite3')(session);
  const sessionTime = 1000 * 60 * 10; // 1000 is one second
  const tools = require('./tools');

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
    
    tools.getDb("user")
    .then((coll) => {
      coll.findOne({username:username})
        .then(result => {
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
        })
        .catch(err => console.log(err));
    })    
    .catch(err => console.log(err))
  }));

  return passport;
}
