const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const loadPins = function() {
    return db.query(`
    SELECT pins.*, count(likes.*)
    FROM pins
    LEFT JOIN likes ON likes.pin_id = pins.id
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
