var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  res.redirect('/', { user : req.user });
};

// Go to registration page
userController.register = function(req, res) {
  res.redirect('/register');
};

// Post registration
userController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
    if (err) {
      return res.json({
      message: err.message,
      error: err
    });
    }

    passport.authenticate('local')(req, res, function () {
      console.log(`New user registered. Username: ${req.username}`);
      res.redirect(req.get('referer'));
    });
  });
};

// Go to login page
userController.login = function(req, res) {
  res.redirect(req.get('referer'));
};

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    res.redirect(req.get('referer'));
  });
};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;