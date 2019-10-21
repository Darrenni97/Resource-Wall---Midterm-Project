const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/profile", (req, res) => {
    let cookie = req.session.user_id
    db.query(`
    SELECT title, description, resource_url, photo_url
    FROM pins
    LEFT JOIN likes ON pins.id = likes.pin_id
    WHERE creator_id = ${cookie} OR user_id = ${cookie}
    `)
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
