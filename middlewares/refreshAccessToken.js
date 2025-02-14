/**
 * File    : refreshAccessToken.js
 * Project : iTrAlytics
 */
const axios = require('axios');
const mongoose = require('mongoose');
const passport = require('passport');

const keys = require('../config/keys');

mongoose.Promise = global.Promise;
const User = mongoose.model('users');
/**
 * Refresh Token
 * POST url: https://www.googleapis.com/oauth2/v4/token?client_id=${c_id}&client_secret=${c_scrt}&refresh_token=${r_token}&grant_type=refresh_token
 * Sample response:
 { access_token: 'newAccessToken',
   token_type: 'Bearer',
   expires_in: 3600,
   id_token: 'newIdToken' }
 * Sample DB:
 {
  "_id": {
      "$oid": "someid"
  },
  "updatedAt": {
      "$date": "2017-10-23T21:13:38.058Z"
  },
  "createdAt": {
      "$date": "2017-10-23T21:13:38.058Z"
  },
  "googleId": "someID",
  "googleAccessToken": "AccessToken",
  "googleRefreshToken": "RefreshToken",
  "googleParams": {
      "id_token": "someIdToken",
      "expires_in": 3600,
      "token_type": "Bearer",
      "access_token": "AccessToken"
  },
  "name": "your name from google account",
  "email": "your gmail",
  "__v": 0
}
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<void>}
 */
module.exports = async (req, res, next) => {
  console.log('*** refreshAccessToken is Running...');
  try {
    let c_id = keys.google.clientID;
    let c_scrt = keys.google.clientSecret;
    let r_token = req.user.googleRefreshToken;

    const tokenRefresh = await axios({
      method: 'post',
      url: `https://www.googleapis.com/oauth2/v4/token?client_id=${c_id}&client_secret=${c_scrt}&refresh_token=${r_token}&grant_type=refresh_token`
    });

    if (tokenRefresh.data.access_token) {
      // Token successfully refreshed
      console.log(
        '/!\\ Your AccessToken has been refreshed. We will try to save it in the db now.'
      );
      /* DEBUG
       console.log('***********************');
       console.log(tokenRefresh.data);
       */
      try {
        // call the findByIdAndUpdate()
        const user = await User.findOneAndUpdate(
          { googleId: req.user.googleId },
          { $set:
            {
              googleAccessToken: tokenRefresh.data.access_token,
              googleParams : tokenRefresh.data
            }
          },
          { new: true }
        );

        // fail to update the user
        if (!user) {
          throw new Error('Error while trying to save the new AccessToken to the db.');
        }

        // we NEED to send the updated user somehow!!
        /* DEBUG
         console.log('~~~~~~~~~~~~~~~~~~~~');
         console.log('After update and save to DB:');
         console.log(user);
         console.log('~~~~~~~~~~~~~~~~~~~~');
         */

        req.login(user, function(err) {
          if (err) return next(err);
          //res.redirect('/api/analytics/accountSummary');
          next();
        });


      } finally {}

    } // End if (tokenRefresh.data.access_token)...
  } catch (err) {
    console.log('/!\\ An error occurred while trying to refresh the token:');
    console.log('Status Code: ', err.statusCode);
    console.log('Message: ', err.message);
    return next(err);
  }
};