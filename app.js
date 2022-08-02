// express
const express = require('express');
app = express();

// middleware
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

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
app.use('/game', require('./routes/game'));
app.use('/ranking', require('./routes/ranking'));
app.use('/auth', require('./routes/auth')(passport));


// start app
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening at ${port}`);
});

// home rendering 
app.get('/', (req, res) => {
  console.log('app', '/', req.user, 'req.session', req.session);
  res.render('home', {user: checkLogin(req) ? req.user : null});
  // if(checkLogin(req)) {
  //   console.log('app', '/', '1');
  //   res.render('home', {username:req.user.username});
  // }
  // else {
  //   console.log('app', '/', '2');
  //   res.render('home');
  // }
});

global.checkLogin = (req) => {
  if(req.user == undefined) {
    return false;
  }
  else {
    return true;
  }
}
