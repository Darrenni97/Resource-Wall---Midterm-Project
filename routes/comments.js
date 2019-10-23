const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const generateCommentsQuery = function(id) {
    return db.query(`
    SELECT comments.*, users.username as username
    FROM comments
    LEFT JOIN pins ON pin_id = pins.id
    JOIN users ON user_id = users.id
    WHERE pins.id = ${id}
    `)
  };
  router.get("/:id", (req, res) => {
    generateCommentsQuery(req.params.id)
      .then(data => {
        const comments = data.rows;
        res.json({ comments });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
