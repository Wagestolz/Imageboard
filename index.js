const express = require('express');
const app = express();
const db = require('./db');
// const bodyParser = require('body-parser');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');

// boilerplate setup multer
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const upload = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152, //2mb
    },
});

//  pass the name of the input field! ("image") --> moved to post request
// app.use(upload.single('image'));

// bodyParser Middleware to encode req.body
// app.use(
//     bodyParser.urlencoded({
//         extended: true,
//     })
// );

app.get('/images', (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log('error in db.getImages: ', err);
        });
});

app.post('/upload', upload.single('image'), s3.upload, (req, res) => {
    console.log('req.body', req.body);
    console.log('req.file', req.file);
    // https://s3.amazonaws.com/aloha.imageboard/ + imagename = location of picture on s3 --> consturct from config.json and req or res.file.filename
    // insert into database
    // unshift() --> which time to update vue?
    if (req.file) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.use(express.static('public'));

app.listen(8080, () => {
    console.log('Imageboard up and running');
});
