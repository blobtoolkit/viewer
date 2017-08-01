const AuthenticationController = require('../controllers/authentication');
const express = require('express');
const passportService = require('../../config/passport');
const passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports.requireAuth = requireAuth;
module.exports.requireLogin = requireLogin;

//=========================
// Auth Routes
//=========================

const authRoutes = express.Router();
// Registration route
authRoutes.post('/register', AuthenticationController.register);

// Login route
authRoutes.post('/login', requireLogin, AuthenticationController.login);

module.exports.authRoutes = authRoutes;
