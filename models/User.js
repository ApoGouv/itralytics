/**
 * File    : User.js
 * Project : iTrAlytics
 */
const mongoose = require('mongoose');
/*
 * const Schema = mongoose.Schema; the below line is identical.
 * we can use destructuring as below, meaning: The mongoose obj has a property called: Schema.
 * Take that property and assign it to a new variable schema.
 */
const { Schema } = mongoose;

/**
 * Define our User schema.
 * - We can add/remove properties to our schema at any time
 * @type {*}
 * index: true options to email to optimize queries that use this field
 * {timestamps: true} option creates a createdAt and updatedAt field on our models that contain timestamps which
 *                    will get automatically updated when our model changes.
 */
const userSchema = new Schema({
  googleId: String,
  googleAccessToken: String,
  googleRefreshToken: String,
  googleParams: Object,
  email: {type: String, lowercase: true, match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  name: String
}, {timestamps: true});

/**
 * Load our userSchema into mongoose, by
 * creating a 'users' collection if it is not already exists
 * and assign it a schema
 */
mongoose.model('users', userSchema);
