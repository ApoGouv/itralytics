/**
 * File    : authRoutes.js
 * Project : iTrAlytics
 */
const _ = require('lodash');
const passport = require('passport');

module.exports = app => {
  /**
   * GET /auth/google
   * we want to kick them into our OAuth flow which is being entirely managed by passport.
   * So we are saying: Hey passport, attempt to authenticate the user who is coming to this
   * route and use the strategy called 'google'.
   * The second argument we pass is an object, with a 'scope' property.
   * scope: specifies to google what access we want to have inside of this user's profile.
   * - full list for google scope
   * - https://developers.google.com/identity/protocols/googlescopes#adexchangesellerv2.0
   */
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/analytics',
        'https://www.googleapis.com/auth/analytics.edit'
      ],
      accessType: 'offline',
      approvalPrompt: 'force'
    })
  );

  /**
   * GET /auth/google/callback
   * We have the 'code'. so call passport with 'google' strategy to
   * handle the last request exchange with google servers
   */
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/'
    }),
    (req, res) => {
      res.redirect('/');
    }
  );

  /**
   * GET /api/logout
   */
  app.get('/api/logout', (req, res) => {
    // kills the cookie
    req.logout();
    res.redirect('/');
  });

  /**
   * GET /api/currentUser
   * req: incoming Request
   * res: outgoing Response
   */
  app.get('/api/currentUser', (req, res) => {
    // allow only a subset of User model to be accessible by a user
    let forUser;
    if (req.user) {
      forUser = _.pick(req.user, ['email', 'name']);
    } else {
      forUser = false;
    }
    /** DEBUG */
    /*
    console.log(req.session);
     */
    res.send(forUser || req.user);
  });
};
