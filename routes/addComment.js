const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const addCommentQuery = function(values) {
    return db.query(`
    INSERT INTO comments(user_id, pin_id, body)
    VALUES ($1, $2, $3) RETURNING *;
    `, values)
  };
  router.post("/:id", (req, res) => {
    console.log(req.body.text)
    const values = [req.session.user_id, req.params.id, req.body.text];
    addCommentQuery(values)
      // .then(data => {
      //   const comments = data.rows;
      //   res.json({ comments });
      // })
      // .catch(err => {
      //   res
      //     .status(500)
      //     .json({ error: err.message });
      // });
  });
  return router;
};
