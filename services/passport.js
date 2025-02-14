/**
 * File    : passport.js
 * Project : iTrAlytics
 */
/**
 * passport.use(): is like a generic register
 *                 we use it to tell/inform passport to use a new Strategy
 * new GoogleStrategy(): create a new GoogleStrategy instance
 * clientID and clientSecret: are our credentials from google to OAuth client
 * callbackURL: is the route path, the user will be sent to, after they grant permissions to our application
 */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const keys = require('../config/keys');
// Use native promises
mongoose.Promise = global.Promise;

// Create a Model Class by fetching the 'users' collection
// -quick reminder: A model class is used to access a single collection sitting inside of MongoDB
//                  and we will use this Model Class to make model instances which will represent our DB records
const User = mongoose.model('users');

/**
 * user: a user Model Instance (a mongoose model) which we turn it into an id
 * used to serialize the user for the session
 */
passport.serializeUser((user, done) => {
  // user.id != user.googleId (==profile.id)
  // user.id is the _id of the record, which is created by the MongoDB
  console.log('serializeUser: ' + user.id);
  done(null, user.id);
});

/**
 * id: takes an id, which we will turn it into a mongoose model instance
 * used to deserialize the user
 */
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    // DEBUG -> output user
    // console.log(user);
    done(null, user);
  });
});

// =========================================================================
// GOOGLE ==================================================================
// =========================================================================
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: keys.google.callbackURI,
      proxy: true
    },
    async (accessToken, refreshToken, params, profile, done) => {
      /** DEBUG */
      /*
      console.log('***********************');
      console.log('PROFILE: ', profile);
      console.log('***********************');
      console.log('accessToken: ', accessToken);
      console.log('***********************');
      console.log('refreshToken: ', refreshToken);
      console.log('***********************');
      console.log('params: ', params);
      console.log('***********************');
      */
      // make a query to our DB to see if a user with the same Google ID, already exists.
      const existingUser = await User.findOne({
        googleId: profile.id
      });
      if (existingUser) {
        // we already have a record with the given profile ID
        // inform passport that we are finished, without any error (null) and return the found user
        return done(null, existingUser);
      }
      // we don't have a user record with this ID, so make a new record to the DB
      // create a user Model Instance and save() it to the DB
      const user = await new User({
        googleId: profile.id,
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken,
        googleParams: params,
        name: profile.displayName,
        email: profile.emails[0].value
      }).save();
      console.log('saving user ...');
      done(null, user);
    }
  )
);
