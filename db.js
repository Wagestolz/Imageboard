const spicedPg = require('spiced-pg');
const db = spicedPg(
    process.env.DATABASE_URL ||
        'postgres:postgres:postgres@localhost:5432/imageboard'
); //handles communication between node and sql

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images ORDER BY created_at ASC;`);
};
