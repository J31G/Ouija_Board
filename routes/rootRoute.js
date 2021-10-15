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

// GET ROUTES
router.get('/', checkAuth, (req, res) => res.render('index.ejs', { name: req?.user?.name }));
router.get('/config', checkAuth, (req, res) => res.render('config.ejs', { name: req?.user?.name }));
router.get('/login', checkNotAuth, (req, res) => res.render('login.ejs'));

// POST ROUTES
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
