const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/profile", (req, res) => {
    let cookie = req.session.user_id
    db.query(`
    SELECT pins.*, (SELECT count(likes) as num_likes
    FROM likes WHERE likes.pin_id = pins.id),
    (SELECT count(ratings) as num_rating FROM ratings WHERE ratings.pin_id = pins.id),
    round(AVG(ratings.rating), 2) as rating_average
    FROM pins
    LEFT JOIN ratings ON ratings.pin_id = pins.id
    LEFT JOIN likes ON pins.id = likes.pin_id
    WHERE creator_id = ${cookie} OR likes.user_id = ${cookie}
    GROUP BY pins.id, ratings.pin_id
    ORDER BY pins.id
    `)
      .then(data => {
        const pins = data.rows;
        res.json({ pins });
      })
      .catch(err => {
        console.log(err)
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
