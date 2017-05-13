var express = require('express');
var router = express.Router();
var passport = require('passport');
var config = require('../config');
var userService = require('../services/user-service');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET /users/create */
router.get('/create', function(req, res, next) {
  var vm = {
    title: 'Create an account'
  };
  res.render('users/create', vm);
});

router.post('/create', function(req, res, next) {
  userService.addUser(req.body, function(err) {
    if (err) {
      console.log(err);
      var vm = {
        title: 'Create an account',
        input: req.body,
        error: err
      };
      delete vm.input.password;
      return res.render('users/create', vm);
    }
    req.login(req.body, function(err) {
      res.redirect('/orders');
    });
  });
});

//we will simplyfy the route by
//adding an options object to passport.authenticate containg a failureRedirect url
// and a successRedirect url and failureFlash
//to use failureFlash we need to install a flash module (i.e : connect flash)
/*router.post('/login', passport.authenticate('local', function(req, res, next) {
  res.redirect('/orders');
});*/

router.post('/login', 
function(req, res, next){
  req.session.orderId = 12345;
  if (req.body.rememberMe){
    req.session.cookie.maxAge = config.cookieMaxAge;
  }
  next();
},
  passport.authenticate('local', {
    failureRedirect: '/', 
    successRedirect: '/orders',
    failureFlash: 'Invalid credentials'//if set to 'true' passport will choose the error msg depending on the reason
  }));

router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
