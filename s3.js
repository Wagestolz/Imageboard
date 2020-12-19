const aws = require('aws-sdk');
const fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3(
    // process.env.SESSION_SECRET ||
    {
        accessKeyId: secrets.AWS_KEY,
        secretAccessKey: secrets.AWS_SECRET,
    }
);

module.exports.delete = (req, res, next) => {
    const url = req.body.params.url;
    const filename = url.substring(url.length - 36, url.length);
    const promise = s3
        .deleteObject({
            Bucket: 'aloha.imageboard',
            Key: filename,
        })
        .promise();
    promise
        .then(() => {
            console.log('amazon deletion successful');
            next();
        })
        .catch((err) => {
            // uh oh
            console.log(
                'Something went wrong with the image upload to S3',
                err
            );
            res.sendStatus(500);
        });
};

module.exports.upload = (req, res, next) => {
    const { filename, mimetype, size, path } = req.file;

    // the putObject()-method does the upload magic
    const promise = s3
        .putObject({
            Bucket: 'aloha.imageboard',
            ACL: 'public-read', // sets public availability
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise(); // this makes it return a promise

    promise
        .then(() => {
            console.log('amazon upload complete');
            next();
            // Optionally delete image from server (/public):
            fs.unlink(path, () => {}); // noop function
        })
        .catch((err) => {
            // uh oh
            console.log(
                'Something went wrong with the image upload to S3',
                err
            );
            res.sendStatus(500);
        });
};

module.exports.uploadFromUrl = (req, res, next) => {
    const path = req.body.params.url;
    const url = req.body.params.url;
    const filename = url.substring(url.length - 36, url.length);
    // the putObject()-method does the upload magic
    const promise = s3
        .putObject({
            Bucket: 'aloha.imageboard',
            ACL: 'public-read', // sets public availability
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: 'image/png',
        })
        .promise(); // this makes it return a promise

    promise
        .then(() => {
            console.log('amazon upload complete');
            next();
            // Optionally delete image from server (/public):
            fs.unlink(path, () => {}); // noop function
        })
        .catch((err) => {
            // uh oh
            console.log(
                'Something went wrong with the image upload to S3',
                err
            );
            res.sendStatus(500);
        });
};
