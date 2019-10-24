const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const addCommentQuery = function(values) {
    return db.query(`
    INSERT INTO comments(user_id, pin_id, body)
    VALUES ($1, $2, $3);
    `, values)
  };

  const getCommentQuery = (values) => {
    return db.query(`
    SELECT body, users.username as username
    FROM comments
    JOIN users ON user_id = users.id
    WHERE user_id = $1 AND pin_id = $2 AND body = $3
    `, values)
  };

  router.post("/:id", (req, res) => {
    const values = [req.session.user_id, req.params.id, req.body.text];
    addCommentQuery(values)
      .then(() => {
        getCommentQuery(values)
        .then(data => {
        const comments = data.rows[0];
        res.json({comments})
       })
      })
  });
  return router;
};
