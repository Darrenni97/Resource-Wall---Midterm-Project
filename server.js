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
const { setCurrentUser, findUserByEmail, login } = require('./helpers');

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
const usersRoutes = require("./routes/users");
const pinsRoutes = require("./routes/pins");
const likedPinsRoutes = require("./routes/liked-pins");
const previewPinsRoutes = require("./routes/previewPins");
const likeRoutes = require("./routes/likes");
const commentsRoutes = require('./routes/comments')
const addCommentRoutes = require('./routes/addComment')
const ratingRoutes = require('./routes/rating')
const extensionPins = require('./routes/extension')

// Mount all resource routes
app.use("/api/users", usersRoutes(db));
app.use("/api/pins", pinsRoutes(db));
app.use("/api/liked-pins", likedPinsRoutes(db));
app.use("/api/preview-pins", previewPinsRoutes(db));
app.use("/api/likes", likeRoutes(db));
app.use("/api/comments", commentsRoutes(db));
app.use("/api/addComment", addCommentRoutes(db));
app.use("/api/rating", ratingRoutes(db));
app.use("/api/extension", extensionPins(db));

// Note: mount other resources here, using the same pattern above

// Home page
app.get("/", async function (req, res) {
  const current_user = await setCurrentUser(req, res);
  res.render("index", { current_user });
});

// Get Login Page
app.get('/login', async function (req, res) {
  const current_user = await setCurrentUser(req, res);
  res.render('login', { current_user });
});

// Register
app.get('/register', async function (req, res) {
  const current_user = await setCurrentUser(req, res);
  res.render('register', { current_user });
});

// Profile
app.get('/profile', async function (req, res) {
  const current_user = await setCurrentUser(req, res);
  res.render('profile', { current_user });
});

// Create new pin
app.get('/create', async function (req, res) {
  const current_user = await setCurrentUser(req, res);
  res.render('create', { current_user });
});

// Update profile
app.get('/update', async function (req, res) {
  const current_user = await setCurrentUser(req, res);
  res.render('update', { current_user });
});

// Use login page to login as user
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

// Logout current user
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

//Submits register information into database
app.post('/register', async (req, res) => {
  const values = [req.body.username, req.body.email, bcrypt.hashSync(req.body.password, 10)];
  if (req.body.username === '' || req.body.username ===  '' || req.body.password === '') { //checks for empty fields
    res.status(400);
    res.send('400: Error');
  }
  if (await findUserByEmail(req.body.email)) { //checks database is email already exists
    console.log(await findUserByEmail(req.body.email))
    res.status(400).end();
    res.send('400: Email Taken');
  }
    return db.query(`
    INSERT INTO users(username, email, password)
    VALUES ($1, $2, $3) RETURNING *;
    `, values)
    .then(res => res.rows)
    .then(res.redirect('/login'))
    .catch(err => console.log(err.stack));
});

// Updates the user info
app.post('/update', async (req, res) => {
  let cookie = req.session.user_id;
  const queryParams = [];
  if (await findUserByEmail(req.body.email)) { //checks database is email already exists
    console.log(await findUserByEmail(req.body.email))
    res.status(400).end();
    res.send('400: Email Taken');
}
  let queryString = `
  UPDATE users
  `;
  if (req.body.username) {
    queryParams.push(`${req.body.username}`);
    queryString += `SET username = $${queryParams.length}`;
  }
  if (req.body.email) {
    if (queryParams.length > 0) {
      queryParams.push(`${req.body.email}`);
      queryString += `, email = $${queryParams.length}`;
    } else {
      queryParams.push(`${req.body.email}`);
      queryString += `SET email = $${queryParams.length}`;
    }
  }
  if (req.body.password) {
    if (queryParams.length > 0) {
      queryParams.push(bcrypt.hashSync(req.body.password, 10));
      queryString += `, password = $${queryParams.length}`;
    } else {
      queryParams.push(bcrypt.hashSync(req.body.password, 10));
      queryString += `SET password = $${queryParams.length}`;
    }
  }
  if (req.body.profile_picture) {
    if (queryParams.length > 0) {
      queryParams.push(req.body.profile_picture);
      queryString += `, profile_picture = $${queryParams.length}`;
    } else {
      queryParams.push(req.body.profile_picture);
      queryString += `SET profile_picture = $${queryParams.length}`;
    }
  }
  if (req.body.bio) {
    if (queryParams.length > 0) {
      queryParams.push(req.body.bio);
      queryString += `, bio = $${queryParams.length}`;
    } else {
      queryParams.push(req.body.bio);
      queryString += `SET bio = $${queryParams.length}`;
    }
  }
  queryString += `
  WHERE users.id = ${cookie};
  `;
  return db.query(queryString, queryParams)
  .then(res => res.rows)
  .then(res.redirect('/profile'))
  .catch(err => console.error('query error: failed to update user', err.stack));
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
