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
let passport = require('./lib/passport.js')(app);


// router
app.use('/game', require('./routes/game'));
app.use('/auth', require('./routes/auth')(passport));


// start app
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening at ${port}`);
});

// home rendering 
app.get('/', (req, res) => {
  console.log('app', '/', req.user, 'req.session', req.session);
  if(checkLogin(req)) {
    res.render('home', {username:req.user.username});
  }
  else {
    res.render('home');
  }
});

function checkLogin(req) {
  if(req.user == undefined) {
    return false;
  }
  else {
    return true;
  }
}
