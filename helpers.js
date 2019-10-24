// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

const bcrypt = require('bcrypt');

// We need this to fetch the user from the database using the COOKIE ID!!!!
async function setCurrentUser(req, res) {
  const user_id = req.session["user_id"];
    try {
      const query = await db.query(`
      SELECT users.*
      FROM users
      WHERE id = $1
      `,
      [`${user_id}`]
    )
    const user = query.rows[0];
    return user;

    }
    catch(e) {
      console.log('error in setCurrentUser', e);
    }
};

const findUserByEmail = (email) => {
  return db.query(`
  SELECT users.*
  FROM users
  WHERE email = $1
  `,
  [`${email}`])
  .then(res => res.rows[0])
  .catch(err => console.error('query error: user = null', err.stack));
};

const login = (email, password) => {
  return findUserByEmail(email)
  .then((user) => {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
};

module.exports = { setCurrentUser, findUserByEmail, login };
