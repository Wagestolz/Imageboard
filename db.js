const spicedPg = require('spiced-pg');
const db = spicedPg(
    process.env.DATABASE_URL ||
        'postgres:postgres:postgres@localhost:5432/imageboard'
); //handles communication between node and sql

module.exports.getImages = () => {
    return db.query(`SELECT images.id, images.url, images.username, images.title, images.description, images.created_at, 
    imagetags.tag1, imagetags.tag2, imagetags.tag3, 
    (SELECT id FROM images ORDER BY id DESC LIMIT 1) 
    AS "newestId"
    FROM images 
    LEFT JOIN imagetags 
    on images.id = imagetags.image_id 
    ORDER BY id 
    DESC LIMIT 9`);
};

module.exports.getTaggdImages = (tag) => {
    return db.query(
        `SELECT images.id, images.url, images.username, images.title, images.description, images.created_at, 
        imagetags.tag1, imagetags.tag2, imagetags.tag3, 
        (SELECT id FROM images ORDER BY id DESC LIMIT 1) 
        AS "newestId"
        FROM images 
        LEFT JOIN imagetags 
        on images.id = imagetags.image_id 
        WHERE imagetags.tag1 = $1 
        OR imagetags.tag2 = $1 
        OR imagetags.tag3 = $1`,
        [tag]
    );
};

module.exports.getMoreImages = (lastId) => {
    return db.query(
        `SELECT images.id, images.url, images.username, images.title, images.description, images.created_at, 
        imagetags.tag1, imagetags.tag2, imagetags.tag3, 
        (SELECT id FROM images ORDER BY id DESC LIMIT 1) 
        AS "newestId", 
        (SELECT id FROM images ORDER BY id ASC LIMIT 1) 
        AS "lowestId"  
        FROM images 
        LEFT JOIN imagetags 
        on images.id = imagetags.image_id 
        WHERE images.id < $1 
        ORDER BY id 
        DESC LIMIT 9`,
        [lastId]
    );
};

// `SELECT *, (SELECT id FROM images ORDER BY id ASC LIMIT 1)
// AS "lowestId"
// FROM images
// WHERE id < $1
// ORDER BY id DESC
// LIMIT 9`,

module.exports.storeNewImage = (upUrl, upUser, UpTitle, UpDescription) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) 
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [upUrl, upUser, UpTitle, UpDescription]
    );
};

module.exports.getModalImage = (id) => {
    return db.query(
        `SELECT images.id, images.url, images.username, images.title, images.description, images.created_at,
        (SELECT id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 1)
        AS "prevId",
        (SELECT id FROM images WHERE id > $1 ORDER BY id ASC LIMIT 1)
        AS "nextId",
        imagetags.tag1, imagetags.tag2, imagetags.tag3 
        FROM images 
        LEFT JOIN imagetags 
        on images.id = imagetags.image_id 
        WHERE images.id = $1`,
        [id]
    );
};

module.exports.getComments = (imageId) => {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [imageId]);
};

module.exports.insertComment = (comment, username, imageId) => {
    return db.query(
        `INSERT INTO comments (comment, username, image_id) 
        VALUES ($1, $2, $3)
        RETURNING *`,
        [comment, username, imageId]
    );
};

module.exports.insertTags = (tag1, tag2, tag3, imageId) => {
    return db.query(
        `INSERT INTO imagetags (tag1, tag2, tag3, image_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
        [tag1, tag2, tag3, imageId]
    );
};

module.exports.checkUpdate = () => {
    return db.query(`SELECT id FROM images ORDER BY id DESC LIMIT 1`);
};

module.exports.deleteImage = (id) => {
    return db.query(`DELETE FROM images WHERE id = $1 RETURNING id`, [id]);
};
