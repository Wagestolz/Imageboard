const express = require('express');
const app = express();
const db = require('./db');
const multer = require('multer'); // middleware for handling multipart/form-data (for uploading files)
const uidSafe = require('uid-safe'); // generating unique names for uploaded files
const path = require('path');
const s3 = require('./s3');
const { s3Url } = require('./config.json');

// boilerplate setup multer
// multer needs to determin the PATH and FILENAME to use when saving files
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

// pass diskStorage to multer along with filesize limit
// "uploader" object now has middleware functions (= methods) on it like "uploader.single("filename")" --> only expecting one file --> pass the name of the input field to it here (= "image") from where it gets the filename --> gives us req.file!
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152, // = 2mb
    },
});

// Initial Rendering
app.get('/images', (req, res) => {
    console.log('GET request to /images');
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log('error in db.getImages: ', err);
        });
});

// Image Upload
app.post('/upload', uploader.single('image'), s3.upload, (req, res) => {
    const { title, user, description } = req.body;
    const url = `${s3Url}${req.file.filename}`;
    if (req.file) {
        db.storeNewImage(url, user, title, description)
            .then(() => {
                res.json({ url, user, title, description });
            })
            .catch((err) => {
                console.log('error in db.storeNewImage: ', err);
            });
    } else {
        res.json({ success: false });
    }
});

// Open Modal
app.get('/modal', (req, res) => {
    console.log('GET request to /modal');
    const id = req.query.id;
    db.getModalImage(id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log('error in db.getModalImage: ', err);
        });
});

app.use(express.static('public'));

app.listen(8080, () => {
    console.log('Imageboard up and running');
});
