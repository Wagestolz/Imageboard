const spicedPg = require('spiced-pg');
const db = spicedPg(
    process.env.DATABASE_URL ||
        'postgres:postgres:postgres@localhost:5432/imageboard'
); //handles communication between node and sql

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 9`);
};

module.exports.getMoreImages = (lastId) => {
    return db.query(
        `SELECT *, (SELECT id FROM images ORDER BY id ASC LIMIT 1) 
        AS "lowestId" FROM images 
        WHERE id < $1 
        ORDER BY id DESC 
        LIMIT 9`,
        [lastId]
    );
};

module.exports.storeNewImage = (upUrl, upUser, UpTitle, UpDescription) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) 
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [upUrl, upUser, UpTitle, UpDescription]
    );
};

module.exports.getModalImage = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};
