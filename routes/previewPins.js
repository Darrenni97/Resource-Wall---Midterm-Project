const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const generateViewPinQuery = function(id) {
    return db.query(`
    SELECT pins.*, comments.*, count(likes.*), count(ratings.*) as rating_average
    FROM pins
    LEFT JOIN comments ON pins.id = comments.pin_id
    LEFT JOIN likes ON pins.id = likes.pin_id
    LEFT JOIN ratings ON pins.id = ratings.pin_id
    WHERE pins.id = ${id}
    GROUP BY likes.pin_id, pins.id, comments.id, ratings.id
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
