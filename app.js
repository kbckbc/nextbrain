// express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


// middleware
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

const state = require('./routes/state');
app.use('/state', state);

app.listen(port, () => {
    console.log(`listening at ${port}`);
});
