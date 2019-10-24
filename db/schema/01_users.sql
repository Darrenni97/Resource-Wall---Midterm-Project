DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255) NOT NULL DEFAULT 'https://static.thenounproject.com/png/538846-200.png',
  bio TEXT DEFAULT 'Go to Update Profile to write your own bio!'
);

DROP TABLE IF EXISTS pins CASCADE;

CREATE TABLE pins (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  resource_url TEXT,
  photo_url TEXT,
  tag VARCHAR (15)
);

DROP TABLE IF EXISTS comments CASCADE;
CREATE TABLE comments (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  pin_id INTEGER REFERENCES pins(id) ON DELETE CASCADE,
  body VARCHAR(139)
);

DROP TABLE IF EXISTS ratings CASCADE;
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  pin_id INTEGER REFERENCES pins(id) ON DELETE CASCADE,
  rating SMALLINT DEFAULT 0
);

DROP TABLE IF EXISTS likes CASCADE;
CREATE TABLE likes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  pin_id INTEGER REFERENCES pins(id) ON DELETE CASCADE
);
