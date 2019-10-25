const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post('/', (req, res) => {
    const values = [req.body.title, req.body.resource];
    return db.query(`
    INSERT INTO pins(creator_id, title, resource_url)
    VALUES (3, $1, $2) RETURNING *;
    `, values)
    .then(res => res.rows[0])
    .then(res.redirect('/'))
    .catch(err => console.log(err.stack));
  });

  return router;
};

