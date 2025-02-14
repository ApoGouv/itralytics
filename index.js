/**
 * File    : index.js
 * Project : iTrAlytics
 */
/* This is our root file - kind of the start up file inside of our node project */
const _ = require('lodash');
const axios = require('axios');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const requireLogin = require('./middlewares/requireLogin');


const keys = require('./config/keys');

// require googleapis for the socket.io communication
const google = require('googleapis');
const analytics = google.analytics('v3');
const OAuth2 = google.auth.OAuth2;


require('./models/User'); // load user model
require('./services/passport'); // Passport config file

// Connecting to MongoDB using mongoose to our application
// Use native promises
mongoose.Promise = global.Promise;
mongoose
  .connect(keys.mongo.URI, { useMongoClient: true })
  .then(() => console.log('Connection to MongoDB successful.'))
  .catch(err => console.error('Could not connect to the database: ', err));

/**
 * generate a new express application
 * @type {*}
 */
const app = express();

/**
 *  Use application-level middleware for common functionality
 */
// log every request to the console: REQUEST STATUS_CODE TIME
app.use(morgan('dev'));
// or set the x-powered-by entry in header to a custom one:
app.use(function(req, res, next) {
  res.header(
    'X-powered-by',
    'recursion(coffee && nerves) + code(nodeJS, Express, MongoDB)'
  );
  next();
});
// assign to req.body any request coming to our server | for parsing application/json
app.use(bodyParser.json());

/**
 * store session on our MongoDB
 * ttl: session cookie expiration date we set it to: 30 days * 24 hours * 60 minutes * 60 seconds === 30 days
 * saveUninitialized: false -> don't create session until something stored
 * resave: false -> don't save session if unmodified
 * touchAfter: 24 * 3600 -> time period in seconds. We are saying to the session be updated only one time in a period of 24 hours
 */
let sessionMiddleware = session({
  secret: keys.cookieSecret,
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 30 * 24 * 60 * 60,
    touchAfter: 24 * 3600
  })
});

// tell our server tou use the mongo db session
app.use(sessionMiddleware);

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// *Routes.js: returns a function, to which we pass the express app
require('./routes/authRoutes')(app);
require('./routes/analyticsRoutes')(app);

// config express to work in production env
if (process.env.NODE_ENV === 'production') {
  // *** the order we declare the below config plays big role!! ***
  // Express will serve up production assets. e.g. main.js, main.css
  app.use(express.static('client/build'));

  // Express will serve up the index.html file, if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

/**
 * Listen for incoming traffic at a specific port
 *  get the PORT from the environment variable 'PORT' if is defined. Else set PORT = 5000
 */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
 ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄`);
  console.log(`█   `, `Server listening on port: ${PORT}`, `   █`);
  if (PORT === 5000) {
    console.log(`█   `, `Visit: http://localhost:${PORT}/`, `    █`);
  }
  console.log(`▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀`);
  console.log('');
});

/**
 * SOCKET.IO START - REAL TIME DATA EXCHANGE
 *
 * setup the Socket.io server
 */
const io = require('socket.io').listen(server);

// fetch the users collection and make a User model
const User = mongoose.model('users');
const {findAndReturnClientUser} = require('./utils/dbHelpers');

/**
 * Listen when a client connects to our server
 */
io.use(function (socket, next){
  // wrap and use the express session middleware
  sessionMiddleware(socket.request, {}, next);
})
.on('connection', socket => {
  console.log(`
  <~~> Server: New user connected to Server.
  `);

  /**
   * Establish a room specific channel.
   * In our case when user navigate to RealTimeChart component
   * */
  // listen for 'getReal' events
  socket.on('getReal', async function(data) {
    console.log(`
    <~~ Server: Received a 'getReal' event.
    `);


    // get the connected user id
    let clientUserId = socket.request.session.passport.user;
    console.log(`UserId: ${clientUserId}`);

    // convert string Id to ObjectId
    let clientUserObjId = mongoose.Types.ObjectId(clientUserId);

    user = await findAndReturnClientUser(clientUserObjId);

    /** DEBUG */
    /*
    console.log(`UserObj:
    ${JSON.stringify(user, null, '\t')}
    `);
    */

    // join the 'Get Real' room, to establish a room-specific channel layered over our socket connection.
    socket.join(data.room);
    console.log(`~~> Server joined the room '${data.room}'`);

    /** DEBUG */
    /*
    console.log(`~~~~~~~~~~~~~~~~
    ${JSON.stringify(data.profilesData, null, '\t')}
    ~~~~~~~~~~~~~~~~~~~~~~~~`);
    */

    /** call API and emit every 30 sec */
    setInterval(
      () => getRealTimeDataApiAndEmit(socket),
      15000
    );

    /**
     * Make a call to Google Analytics Real Time Data API
     * e.g: https://www.googleapis.com/analytics/v3/data/realtime
     * ?ids=ga:154623183&dimensions=rt:deviceCategory&metrics=rt:activeUsers
     */
    let getRealTimeDataApiAndEmit = async (socket) => {

      console.log(`~~> Server: Will try to make a Real Time Data API call.`);

      // use googleapis OAouth
      const CLIENT_ID = keys.google.clientID;
      const CLIENT_SECRET = keys.google.clientSecret;
      const REDIRECT_URL = keys.google.callbackURI;

      let oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

      // set tokens from the user information
      oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken
      });


      /**
       *  Iterate through all profiles and for each one
       *  try to fetch Real Time Data
       */
      _.map(data.profilesData, async profile => {
        let realTimeData;
        try {
          console.log(`~~> Server: Making Real Time Data API call for: '${profile.name}'.`);

          analytics.data.realtime.get({
            ids: profile.id,
            metrics: "rt:activeUsers",
            dimensions: "rt:deviceCategory",
            auth: oauth2Client
          }, function (err, result) {
            //console.log(err, result);
            if (err){
              throw new Error('/!\\ Error on: get RealTimeAPI call');
            }
            /** DEBUG */
            /*
            console.log(`REAL TIME RESULT:
            ${JSON.stringify(result, null, '\t')}
            `);
            */

            // construct the object we will send to client with the Real Time Data and the Profile Name
            /* result ALREADY has the profile id, so we don't need to bundle with the profile.name
            realTimeDataProfileBundle = {
              profileName: profile.name,
              realTimeData: result
            };
            */
            realTimeData = result;

            /** DEBUG */
            /*
            console.log(`INSIDE getRealTimeDataAPIcall + profile name: '${profile.name}':
             ${JSON.stringify(realTimeData, null, '\t')}
           `);
            */
            // sending to sender client, only if they are in 'data.room' ('Get Real') room(channel)
            console.log(`--> Server: emitting 'TheRealDeal' event + VALID data`);
            // socket.to(data.room).emit('TheRealDeal', { realTimeData });
            io.sockets.in(data.room).emit('TheRealDeal', { realTimeData });

          });// End analytics.data.realtime.get

        } catch (err) {
          console.log(`Error msg: ${err.message}`);
          realTimeData = {
            error: err
          };
          // sending to sender client, only if they are in 'data.room' ('Get Real') room(channel)
          console.log(`--> Server: emitting 'TheRealDeal' event + ERROR data`);
          // socket.to(data.room).emit('TheRealDeal', { realTimeData });
          io.sockets.in(data.room).emit('TheRealDeal', { realTimeData });
        }// End try..catch block

      });// End _.map()
    };// End getRealTimeDataApiAndEmit()

    // listen for 'UnReal' events
    socket.on('UnReal', data => {
      console.log(`~~> Server: Client left the room, so end the subscription to that room.`);
      // end the client subscription to that room
      socket.leave(data.room);
    });

  });// End socket.on('getReal'...)


  /**
   * Listen for clients that disconnect
   */
  socket.on('disconnect', () => {
    console.log('~~> Server: User disconnected.');
  });
});
