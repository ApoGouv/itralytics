/**
 * File    : dbHelpers.js
 * Project : iTrAlytics
 */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// fetch the users collection and make a User model
const User = mongoose.model('users');

/**
 * Try to fetch a user by passing an ID
 * @param someObjId: ObjectID
 * @returns {Promise.<*>}
 */
const findAndReturnClientUser = async (someObjId) => {
  try {
    let user = await User.findById(someObjId);

    if (!user) {
      console.log(`/!\\ NO User found in the DB`);
      return undefined;
    } else {
      /** DEBUG */
      /*
       console.log(`/!\\ USER:
       ${JSON.stringify(user, null, '\t')}
       `);
       */

      return user;
    }
  } catch(err) {
    console.log(`/!\\ Error trying to fetch User: 
        ${err.message}
        `);
    return undefined;
  }
};


module.exports = {findAndReturnClientUser};