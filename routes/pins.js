const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const loadPins = function() {
    return db.query(`
    SELECT pins.*, count(likes.*), round(AVG(ratings.rating), 2) as rating_average
    FROM pins
    LEFT JOIN likes ON likes.pin_id = pins.id
    LEFT JOIN ratings ON pins.id = ratings.pin_id
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
