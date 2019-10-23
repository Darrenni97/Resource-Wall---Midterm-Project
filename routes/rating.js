const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const queryCheck = function(values) {
    return db.query(`
    SELECT *
    FROM ratings
    WHERE user_id = $1 AND pin_id = $2
    `, values)
    }
  router.get("/:id", (req, res) => {
    const values = [req.session.user_id, req.params.id, req..rating];
    queryCheck(values)
      .then(res => {
        if (res.rows[0] === undefined) {
          db.query(`
          INSERT INTO ratings(user_id, pin_id, rating)
          VALUES ($1, $2, $3) RETURNING *;
          `, values)
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
