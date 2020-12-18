-- DELETE FROM images WHERE id = 39;
-- DELETE FROM images WHERE username = 'discoduck';



-- DROP TABLE IF EXISTS imagetags;
-- DROP TABLE IF EXISTS comments;
-- DROP TABLE IF EXISTS images;

-- CREATE TABLE images(
--     id SERIAL PRIMARY KEY,
--     url VARCHAR NOT NULL,
--     username VARCHAR NOT NULL,
--     title VARCHAR NOT NULL,
--     description TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE comments(
--     id SERIAL PRIMARY KEY,
--     comment TEXT NOT NULL,
--     username VARCHAR NOT NULL,
--     image_id INTEGER NOT NULL REFERENCES images(id),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- CREATE TABLE imagetags(
--     id SERIAL PRIMARY KEY,
--     tag1 TEXT,
--     tag2 TEXT,
--     tag3 TEXT,
--     image_id INTEGER NOT NULL REFERENCES images(id),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );