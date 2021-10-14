const express = require('express');
const passport = require('passport');

const router = express.Router();

// Auth Functions
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect('/login');
};
const checkNotAuth = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  return res.redirect('/');
};

router.get('/', checkAuth, (req, res) => {
  res.render('index.ejs');
});

router.get('/login', checkNotAuth, (req, res) => {
  res.render('login.ejs');
});

router.post('/login', checkNotAuth, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.post('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

module.exports = router;
