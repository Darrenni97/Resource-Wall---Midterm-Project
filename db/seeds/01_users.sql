INSERT INTO users (username, email, password, profile_picture, bio)
VALUES
(
  'Juliaj621',
  'email@email.com',
  '$2b$10$oK3otofSQZ1Sg88Hgk/1vej8WQBcl//jAIIFJIUbhdLEfG/u1Arjq',
  'https://i.pinimg.com/280x280_RS/dd/d9/d6/ddd9d686287d303adeb57da0f2f1a324.jpg',
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
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8G0uLiDM7-MZgSdmq-IX1ja1vt42zD-gupm-K7vC17D-__AOJ&s',
  'I like falcons'
);

INSERT INTO pins (creator_id, title, description, resource_url, photo_url, tag)
VALUES
(1, 'Fun Fun', 'Learing how to code.', 'https://www.youtube.com/watch?v=G2KV3YlvDFQ', 'https://i.ytimg.com/vi/iGBWyhiqBsk/maxresdefault.jpg', 'Technology'),
(2, 'Coding 101', 'Article on coding', 'https://www.bitdegree.org/tutorials/what-is-coding/', 'https://www.bitdegree.org/tutorials/wp-content/uploads/2018/08/what-is-coding.jpg', 'Technology'),
(3, 'Colouring 101', 'A guide on how to color within the lines', 'https://www.thecoloringbook.club/color-colored-pencils/', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPKz5vgY9NtIcrZ8F9TA4xdji65iKyiLJQ0r9RbKi9QyW61WHS', 'Arts'),
(2, 'How to Make Smores', 'A wiki how on how to make smores because I need it to earn my camping badge!', 'https://www.wikihow.com/Make-a-S%27more', 'https://www.wikihow.com/images/thumb/a/ac/Make-a-S%27more-Step-8.jpg/aid9849-v4-728px-Make-a-S%27more-Step-8.jpg.webp', 'Foods'),
(1, 'How to Build a Campfire', 'A website that shows you how to build a roaring campfire. This is for my camping badge', 'https://www.atlasandboots.com/how-to-build-a-campfire-a-step-by-step-guide/', 'https://www.atlasandboots.com/wp-content/uploads/2015/09/How-to-build-a-campfire-ring-1024x683.jpg', 'Miscellaneous'),
(2, 'Beginners Guide to Archery', 'A wiki how for how to get better at archery for my archery badge', 'https://www.wikihow.com/Start-Archery', 'https://www.wikihow.com/images/thumb/5/5f/Start-Archery-Step-12-Version-2.jpg/aid1617274-v4-728px-Start-Archery-Step-12-Version-2.jpg.webp', 'Sports'),
(3, 'How to Canoe', 'I need to learn how to canoe better because I keep flipping my canoe over!', 'https://shenandoahriveradventures.com/canoeing-101/', 'https://shenandoahriveradventures.com/wp-content/uploads/2013/12/dog-in-canoe-001.jpg', 'Sports'),
(1, 'How to Idenfity Poisonous Plants','A webpage that shows how to identify numerous poisonous plants for my in the wild badge','https://www.beprepared.com/blog/15808/how-to-identify-poisonous-plants/', 'https://www.beprepared.com/blog/wp-content/uploads/2014/06/iStock_000040576600Small_hemlock-300x300.jpg', 'Miscellaneous');

INSERT INTO comments (user_id, pin_id, body)
VALUES
(3, 1, 'Oh my, that is quite some hair!'),
(2, 2, 'Wow! What a cool and interesting link!'),
(2, 2, 'Wow! What a cool and interesting link!');

INSERT INTO ratings (user_id, pin_id, rating)
VALUES
(1, 1, 1),
(2, 2, 5);

INSERT INTO likes (user_id, pin_id)
VALUES
(3, 2),
(2, 1);

