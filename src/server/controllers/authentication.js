const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const config = require('../../config/main');

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

// Set user info from request
function setUserInfo(request) {
  return {
    _id: request._id,
    name: request.name,
    email: request.email,
    role: request.role
  };
}

//========================================
// Login Route
//========================================
module.exports.login = function(req, res, next) {

  var userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo
  });
}


//========================================
// Registration Route
//========================================
module.exports.register = function(req, res, next) {
  // Check for registration errors
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.'});
  }

  // Return error if  name not provided
  //if (!name) {
  //  return res.status(422).send({ error: 'You must enter your name.'});
  //}

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  User.findOne({ email: email }, function(err, existingUser) {
      if (err) { console.log(err); return next(err); }

      // If user is not unique, return error
      if (existingUser) {
        return res.status(422).send({ error: 'That email address is already in use.' });
      }

      // If email is unique and password was provided, create account
      var user = new User({
        email: email,
        password: password,
        name: name || email.replace(/@.+/,'')
      });
      user.save(function(err, user) {
        if (err) { return next(err); }

        // Respond with JWT if user was created
        var userInfo = setUserInfo(user);

        res.status(201).json({
          token: 'JWT ' + generateToken(userInfo),
          user: userInfo
        });
      });
  });
return;
}

//========================================
// Authorization Middleware
//========================================

// Role authorization check
module.exports.roleAuthorization = function(role) {
  return function(req, res, next) {
    const user = req.user;

    User.findById(user._id, function(err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      // If user is found, check role.
      if (foundUser.role == role) {
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    })
  }
}
