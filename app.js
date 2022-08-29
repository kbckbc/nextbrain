// express
const express = require('express');
app = express();
var flash = require('connect-flash');


// middleware
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(flash());

// handlebars
const hbs = require('express-handlebars');
app.engine( 'hbs', hbs.engine({
    extname: 'hbs',
    // defaultView: 'default',
    // layoutsDir: __dirname + '/views/layouts/',
    // partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'hbs');


// passport
const passport = require('./lib/passport.js')(app);


// router
app.use('/auth', require('./routes/auth')(passport));
app.use('/math', require('./routes/math'));
app.use('/game', require('./routes/game'));
app.use('/ranking', require('./routes/ranking'));
app.use('/coin', require('./routes/coin'));



// set null to MONGODB_URI_LOCAL when deploy.
global.MONGODB_URI_LOCAL = 'mongodb+srv://nextbrain:NsGzoib2VlmnKbTe@cluster0.swhee.mongodb.net/?retryWrites=true&w=majority';
global.debug = false;
global.port = 3000;
global.checkLogin = (req) => {
  if(req.user == undefined) {
    return false;
  }
  else {
    return true;
  }
}


// start app
const port = process.env.PORT || global.port;
app.listen(port, () => {
    console.log(`listening at ${port}`);
});

// home rendering 
app.get('/', (req, res) => {
  // console.log('app', '/', req.user, 'req.session', req.session);
  res.render('home', {user: req.user});
  // if(checkLogin(req)) {
  //   console.log('app', '/', '1');
  //   res.render('home', {username:req.user.username});
  // }
  // else {
  //   console.log('app', '/', '2');
  //   res.render('home');
  // }
});

app.get('/about', (req, res) => {
  res.render('about');
});