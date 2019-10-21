const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  const loadPins = function() {
    return db.query(`
    SELECT title, description, resource_url, photo_url
    FROM pins
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
