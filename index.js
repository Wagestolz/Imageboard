const express = require('express');
const app = express();
const db = require('./db');

app.use(
    express.urlencoded({
        extended: false,
    })
); // Middleware to encode req.body

app.use(express.static('public'));

app.get('/images', (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log('error in db.getImages: ', err);
        });
});

app.listen(8080, () => {
    console.log('Imageboard up and running');
});
