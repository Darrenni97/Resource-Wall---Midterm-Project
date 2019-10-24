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
