/**
 * File    : validateAccessToken.js
 * Project : iTrAlytics
 */

const rp = require('request-promise-native');

const refreshToken = require('./refreshAccessToken');

/**
 * get Token Info
 * GET https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${access_token}
 * Sample response:
{
  issued_to: "someId.apps.googleusercontent.com",
  audience: "someId.apps.googleusercontent.com",
  user_id: "User ID",
  scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.edit",
  expires_in: 3057,
  email: "our gmail",
  verified_email: true,
  access_type: "offline"
}
 */

module.exports = async (req, res, next) => {
  console.log('*** validateAccessToken is Running...');
  if (!req.user || !req.isAuthenticated()) {
    return res.status(401).send({ error: 'You must log in!' });
  }
  try {
    const tokenInfo = await rp(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${req.user
        .googleAccessToken}`
    );

    console.log('/!\\ Your AccessToken is still valid.');
    next();
  } catch (error) {

    console.log('/!\\ Your AccessToken has expired, we will try to refresh it.');
    // call refresh token
    refreshToken(req, res, next);
  }
};