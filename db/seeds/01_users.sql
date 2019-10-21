INSERT INTO users (username, email, password, profile_picture, bio)
VALUES
(
  'Juliaj621',
  'email@email.com',
  '$2b$10$oK3otofSQZ1Sg88Hgk/1vej8WQBcl//jAIIFJIUbhdLEfG/u1Arjq',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSOHBYH5MlqZjhBsNIZTm66VE7nCfsyuat9wUEi8wIgzlbVJ2E',
  'I like dogs'
),
(
  'Darrenni_',
  'gmail@gmail.com',
  '$2b$10$oK3otofSQZ1Sg88Hgk/1vej8WQBcl//jAIIFJIUbhdLEfG/u1Arjq',
  'https://twistedsifter.files.wordpress.com/2012/09/trippy-profile-pic-portrait-head-on-and-from-side-angle.jpg?w=800',
  'I like cats'
),
(
  'Bjam091',
  'apple@apple.com',
  '$2b$10$oK3otofSQZ1Sg88Hgk/1vej8WQBcl//jAIIFJIUbhdLEfG/u1Arjq',
  'https://cdn6.f-cdn.com/contestentries/1376995/30494909/5b566bc71d308_thumbCard.jpg',
  'I like falcons'
);

INSERT INTO pins (creator_id, title, description, resource_url, photo_url, tag)
VALUES
(1, 'Fun Fun', 'Learing how to code.', 'https://www.youtube.com/watch?v=G2KV3YlvDFQ', 'https://i.ytimg.com/vi/iGBWyhiqBsk/maxresdefault.jpg', 'coding'
),
(2, 'Coding 101', 'Article on coding', 'https://www.bitdegree.org/tutorials/what-is-coding/', 'https://www.bitdegree.org/tutorials/wp-content/uploads/2018/08/what-is-coding.jpg', 'coding');

INSERT INTO comments (user_id, pin_id, body)
VALUES
(3, 1, 'Oh my, that is quite some hair!'),
(2, 2, 'Wow! What a cool and interesting link!');

INSERT INTO ratings (user_id, pin_id, rating)
VALUES
(1, 1, 1),
(2, 2, 5);

INSERT INTO likes (user_id, pin_id)
VALUES
(3, 2),
(2, 1);

