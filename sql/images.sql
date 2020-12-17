-- DELETE FROM images WHERE username = 'funkychicken';
-- DELETE FROM images WHERE username = 'discoduck';



DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS comments;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    username VARCHAR NOT NULL,
    image_id INTEGER NOT NULL REFERENCES images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

