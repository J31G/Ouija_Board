const express = require('express');
const passport = require('passport');
const db = require('../modules/initDatabase');
const {
  getCharacters, saveConfig, getDelay, setDelay,
} = require('../modules/dbQueries');

const router = express.Router();

// Delay between letters in ms

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};
const checkNotAuth = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  return res.redirect('/');
};

// GET ROUTES
router.get('/', checkAuth, async (req, res) => res.render('index.ejs', { name: req?.user?.NAME, users: await db.initDB() }));
router.get('/config', checkAuth, async (req, res) => res.render('config.ejs', {
  name: req?.user?.NAME,
  users: await db.initDB(),
  allChars: await getCharacters(),
  delay: await getDelay(),
}));
router.get('/how-to', checkAuth, async (req, res) => res.render('how-to.ejs', { name: req?.user?.NAME, users: await db.initDB() }));
router.get('/manual-input', checkAuth, async (req, res) => res.render('manual-input.ejs', { name: req?.user?.NAME, users: await db.initDB() }));
router.get('/pre-selected', checkAuth, async (req, res) => res.render('pre-selected.ejs', { name: req?.user?.NAME, users: await db.initDB() }));
router.get('/users', checkAuth, async (req, res) => res.render('other-users.ejs', { name: req?.user?.NAME, users: await db.initDB() }));
router.get('/login', checkNotAuth, (req, res) => res.render('login.ejs'));

// POST ROUTES
router.post('/login', checkNotAuth, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));
router.post('/logout', checkAuth, (req, res) => {
  req.logOut();
  res.redirect('/login');
});
router.post('/config', checkAuth, (req, res) => {
  // Save changes to DB
  saveConfig(req?.body?.data);

  // Save Letter delay to DB
  setDelay(req?.body?.extra?.delay);

  // 200 - All good!
  res.status(200);
  res.send({
    statusCode: 200,
    statusMessage: 'Success',
  });
});

module.exports = router;
