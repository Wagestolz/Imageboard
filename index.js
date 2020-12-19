const express = require('express');
const app = express();
const db = require('./db');
const multer = require('multer'); // middleware for handling multipart/form-data (for uploading files)
const uidSafe = require('uid-safe'); // generating unique names for uploaded files
const path = require('path');
const s3 = require('./s3');
const { s3Url } = require('./config.json');

app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

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
            .then(({ rows }) => {
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log('error in db.storeNewImage: ', err);
            });
    } else {
        res.json({ success: false });
    }
});

// load more images
app.get('/more', (req, res) => {
    console.log('GET request to /more');
    const lastid = req.query.lastid;
    db.getMoreImages(lastid)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log('error in db.getMoreImages: ', err);
        });
});

// Open Modal
app.get('/modal', (req, res) => {
    console.log('GET request to /modal');
    const id = req.query.id;
    console.log('id: ', id);
    db.getModalImage(id)
        .then(({ rows }) => {
            console.log('rows: ', rows);
            if (rows.length == 0) {
                res.send({ notfound: true });
            } else {
                res.json(rows);
            }
        })
        .catch((err) => {
            console.log('error in db.getModalImage: ', err);
        });
});

// Get comments
app.get('/comments/:imageId', (req, res) => {
    console.log('GET request to /comments/:imageId');
    db.getComments(req.query.imageId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log('error in db.getComments: ', err);
        });
});

// Post a comment
app.post('/comment', (req, res) => {
    const { comment, username, imageId } = req.body;
    db.insertComment(comment, username, imageId)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log('error in db.insertComment: ', err);
        });
});

// Post Tags
app.post('/tags', (req, res) => {
    const { tags, id } = req.body;
    let tag1,
        tag2,
        tag3 = null;
    if (tags[0]) {
        tag1 = tags[0].toLowerCase();
    }
    if (tags[1]) {
        tag2 = tags[1].toLowerCase();
    }
    if (tags[2]) {
        tag3 = tags[2].toLowerCase();
    }
    db.insertTags(tag1, tag2, tag3, id)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log('error in db.insertTags: ', err);
        });
});

// Get Imagess filtered by Tag
app.get('/images/:tag', (req, res) => {
    console.log('GET request to /comments/:tag');
    if (!req.query.tag) {
        db.getImages()
            .then(({ rows }) => {
                res.json(rows);
            })
            .catch((err) => {
                console.log('error in db.getImages: ', err);
            });
    } else {
        db.getTaggdImages(req.query.tag)
            .then(({ rows }) => {
                res.json(rows);
            })
            .catch((err) => {
                console.log('error in db.getTaggdImages: ', err);
            });
    }
});

app.get('/update', (req, res) => {
    db.checkUpdate()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log('error in db.checkUpdate: ', err);
        });
});

app.use(express.static('public'));

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () => {
        console.log('Imageboard up and running');
    });
}
