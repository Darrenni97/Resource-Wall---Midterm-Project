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

    const averageRating = (values) => {
      return db.query(`
      SELECT round(AVG(ratings.rating), 2) as average_rating
      FROM ratings
      WHERE pin_id = $1
      `, values)
    }
  router.post("/:id", (req, res) => {
    const values1 = [req.session.user_id, req.params.id];
    const values2 = [req.session.user_id, req.params.id, req.body.rating];
    const values3 = [req.params.id];
    queryCheck(values1)
      .then(res => {
        console.log(res.rows)
        if (res.rows[0] === undefined) {
          db.query(`
          INSERT INTO ratings(user_id, pin_id, rating)
          VALUES ($1, $2, $3);
          `, values2)
        }
      })
      .then((ratingResponse) => {
        console.log('Rating response:',ratingResponse)
        averageRating(values3)
          .then(dbres => {
            console.log(dbres)
            console.log('$$$$$', dbres.rows)
            const rating = dbres.rows[0].average_rating;
            res.json({ rating });
        })
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });
  return router;
};
