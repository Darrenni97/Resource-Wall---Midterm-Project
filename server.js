// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// This encrypts the cookies
app.use(cookieSession({
  name: 'user_id',
  keys: ["boop"],
  maxAge: 24 * 60 * 60 * 1000
}));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above


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
}

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", async function (req, res) {
  const current_user = await setCurrentUser(req, res);

  res.render("index", { current_user });
});

app.get('/login', async function (req, res) {
  const current_user = await setCurrentUser(req, res);
  res.render('login', { current_user });
});

app.get('/register', async function (req, res) {
  const current_user = await setCurrentUser(req, res);
  res.render('register', { current_user });
});

app.get('/profile', async function (req, res) {
  const current_user = await setCurrentUser(req, res);
  res.render('profile', { current_user });
});

app.get('/create', async function (req, res) {
  const current_user = await setCurrentUser(req, res);
  res.render('create', { current_user });
});

const findUserByEmail = (email) => {
  return db.query(`
  SELECT users.*
  FROM users
  WHERE email = $1
  `,
  [`${email}`])
  .then(res => res.rows[0])
  .catch(err => console.error('query error: user = null', err.stack));
}

const login = (email, password) => {
  return findUserByEmail(email)
  .then((user) => {
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  });
}

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  login(email, password)
    .then(user => {
      if (!user) {
        res.send({error: "error: user not found"});
        return;
      }

      req.session["user_id"] = user.id;
      res.redirect('/');
    })
    .catch(e => res.send(e));
});

// app.get('/whoami', (req, res) => {

// })

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

//Submits pins data from form into database
app.post('/create', (req, res) => {
  const values = [req.session.user_id, req.body.title, req.body.description, req.body.resource, req.body.photo, req.body.tags];
  return db.query(`
  INSERT INTO pins(creator_id, title, description, resource_url, photo_url, tag)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `, values)
  .then(res => res.rows[0])
  .then(res.redirect('/'))
  .catch(err => console.log(err.stack));
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
