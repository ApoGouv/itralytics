/**
 * File    : requireLogin.js
 * Project : iTrAlytics
 */
// route middleware to make sure a user is logged in
module.exports = (req, res, next) => {
  console.log('*** requireLogin is Running...');
  if (!req.user || !req.isAuthenticated()) {
    return res.status(401).send({ error: 'You must log in!' });
  }

  // there is a logged in user
  next();
};

/*
 // route middleware to make sure a user is logged in
 function isLoggedIn(req, res, next) {

 // if user is authenticated in the session, carry on
 if (req.isAuthenticated())
 return next();

 // if they aren't redirect them to the home page
 res.redirect('/');
 }
*/