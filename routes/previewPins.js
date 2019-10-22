const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const viewPin = function() {
    return db.query(`
    SELECT pins.*, comments.*, likes.*, ratings.*
    FROM pins
    JOIN comments ON pins.id = comments.pin_id
    JOIN likes ON pins.id = likes.pin_id
    JOIN ratings ON pins.id = ratings.pin_id
    WHERE pins.id = 1
    `)
  };
  router.get("/", (req, res) => {
    viewPin()
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
