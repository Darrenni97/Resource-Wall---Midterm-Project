const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const loadPins = function() {
    return db.query(`
    SELECT pins.*, (SELECT count(likes) as num_likes
    FROM likes WHERE likes.pin_id = pins.id), round(AVG(ratings.rating), 2) as rating_average
    FROM pins
    LEFT JOIN ratings ON ratings.pin_id = pins.id
    GROUP BY pins.id
    `)
  };
  router.get("/", (req, res) => {
    loadPins()
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
