// express
const express = require('express');
const app = express();


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


// router
app.use('/', require('./routes/state'));
app.use('/', require('./routes/auth'));


// start app
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening at ${port}`);
});


// home rendering 
app.get('/', (req, res) => {
  res.render('home');
});
