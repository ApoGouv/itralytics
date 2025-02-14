/**
 * File    : dev.js
 * Project : iTrAlytics
 */

// DEV keys - Don't commit this!
module.exports = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID_DEV,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET_DEV,
    callbackURI: '/auth/google/callback'
  },
  mongo: {
    URI: process.env.MONGO_URI_DEV
  },
  cookieSecret: process.env.COOKIE_SECRET_DEV
};
