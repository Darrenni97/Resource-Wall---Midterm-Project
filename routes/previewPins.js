const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const generateViewPinQuery = function(id) {
    return db.query(`
    SELECT pins.*, comments.user_id as user_id, comments.body,
    (SELECT count(likes) as num_likes FROM likes WHERE likes.pin_id = pins.id),
    round(avg(ratings.rating), 2) as average_rating,
    (SELECT count(ratings) as num_rating FROM ratings WHERE ratings.pin_id = pins.id)
    FROM pins
    LEFT JOIN comments ON pins.id = comments.pin_id
    LEFT JOIN ratings ON pins.id = ratings.pin_id
    WHERE pins.id = ${id}
    GROUP BY pins.id, comments.user_id, comments.body, ratings.pin_id;
    `)
  };

  router.get("/:id", (req, res) => {
    generateViewPinQuery(req.params.id)
      .then(data => {
        const pins = data.rows;
        res.json({ pins });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
