const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const generateViewPinQuery = function(id) {
    return db.query(`
    SELECT pins.*, comments.user_id as user_id, comments.body, count(likes.*), round(avg(ratings.rating), 2) as average_rating
    FROM pins
    LEFT JOIN comments ON pins.id = comments.pin_id
    LEFT JOIN likes ON pins.id = likes.pin_id
    LEFT JOIN ratings ON pins.id = ratings.pin_id
    WHERE pins.id = 7
    GROUP BY likes.pin_id, pins.id, comments.user_id, comments.body, ratings.pin_id;
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
