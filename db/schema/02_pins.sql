DROP TABLE IF EXISTS pins CASCADE;

CREATE TABLE pins (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT DEFAULT 'A great resource!',
  resource_url TEXT,
  photo_url TEXT DEFAULT 'https://i.ibb.co/QKchrpP/pinmintlogo.jpg',
  tag VARCHAR (15) DEFAULT 'Miscellaneous'
);
