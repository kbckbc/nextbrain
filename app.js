const express = require('express');
const nedb = require('nedb');

const app = express();
const port = process.env.PORT || 3000;
// const uri = process.env.MONGODB_URI;
app.listen(port, () => {
    console.log(`listening at ${port}`);
    // console.log('uri', uri);
});

app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

const db = new nedb('database.db');
db.loadDatabase();

app.post('/state/ranking', (req, res) => {
    const data = req.body;
    console.log('Got a request : ranking, POST', data);
    db.insert(data);
    res.json(data);
});

app.get('/state/ranking', (req, res) => {
    console.log('Got a request : ranking, GET');
    db.find({}, (err, data) => {
        res.json(data);
    });
});

