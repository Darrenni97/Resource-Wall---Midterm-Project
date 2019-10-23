const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const queryCheck = function(values) {
    return db.query(`
    SELECT *
    FROM likes
    WHERE user_id = $1 AND pin_id = $2
    `, values)
    }
  router.get("/:id", (req, res) => {
    const values = [req.session.user_id, req.params.id];
    queryCheck(values)
      .then(res => {
        if (res.rows[0] === undefined) {
          db.query(`
          INSERT INTO likes(user_id, pin_id)
          VALUES ($1, $2) RETURNING *;
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
