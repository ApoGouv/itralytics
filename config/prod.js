/**
 * File    : prod.js
 * Project : iTrAlytics
 */

// prod.js - production keys here!
module.exports = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURI: process.env.GOOGLE_CALLBACK_URI
  },
  mongo: {
    URI: process.env.MONGO_URI
  },
  cookieSecret: process.env.COOKIE_SECRET
};