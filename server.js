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


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  // if the user has a user_id coookie, look up the user and put their user data in some variable
  const current_user = undefined;   // TODO: not this
  res.render("index", {current_user});
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/create', (req, res) => {
  res.render('create');
});


const getUserWithEmail = function(email) {
  return db.query(`
  SELECT users.*
  FROM users
  WHERE email = $1
  `, [`${email}`])
    .then(res => res.rows[0])
    .catch(err => console.error('query error: user = null', err.stack));
}

const login = function(email, password) {
  return getUserWithEmail(email)
  .then(user => {
    if (password === user.password) {
      return user;
    }
    return null;
  });
}

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  login(email, password)
    .then(user => {
      console.log(user);
      if (!user) {
        res.send({error: "error"});
        return;
      }
      req.session.user_id = user.id;
      console.log(user.id)
      res.redirect('/');
    })
    .catch(e => res.send(e));
});

app.get('/whoami', (req, res) => {

})

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
