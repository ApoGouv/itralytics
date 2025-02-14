<h1 align="center">
  <br>
  <img src="https://github.com/ApoGouv/itralytics/blob/main/client/src/images/logos/logo-itralytics.png" alt="iTrAlytics" width="200">
  <br>
  Get to know your users!
  <br>
</h1>

![screenshot](https://github.com/ApoGouv/itralytics/blob/main/client/src/images/itralytics.gif)

> This project was part of my MSc thesis, entitled: "Interactive Web Analytics Reporting Dashboard for Enterprise Business - integrating Google's Web Tools to a one-stop reporting interface".
 
 With the support of my supervisor professor [Christos Berberidis][Christos Berberidis info link] and the [iTrust - Digital Strategy][iTrust-digital link] company.


## Project Status: Archived

This project is now archived and will no longer receive updates or maintenance. The repository is provided for historical reference and educational purposes only.

Please note that the information contained within this repository may be outdated or no longer secure. The project has been transitioned to a "read-only" status, and any further development or changes will not be made.

If you have any questions or need assistance with this project, please feel free to open an issue, though response times may be limited.

Thank you for your interest in iTrAlytics!

## Basic Overview

iTrAlytics is an Interactive Web Analytics Dashboard developed in node.js, express, React and more cutting-edge technologies (see Technologies section below).

It uses OAuth to sign in users with their Google account and uses their Google Analytics account data to present the charts in the dashboard and display the currently active users in real time (almost*).

<small>* Almost real time feedback, due to Google Real Time API limitations. We query the API every 15sec. There is a max quote limit for: 4000 queries / day</small>

## Demo
Here is a ~~working live demo~~:  ![Website](https://img.shields.io/website?url=https%3A%2F%2Fitralytics.herokuapp.com%2F&down_message=isDown&style=flat-square&label=iTrAlytics)


## How To Run It Locally

To clone and run this application, you'll need [Git](https://git-scm.com), [![node](https://img.shields.io/badge/node-%3E%3D8.4.0-brightgreen.svg?style=flat)](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [![yarn](https://img.shields.io/badge/yarn-%3E%3D1.3.2-brightgreen.svg?style=flat)](https://yarnpkg.com/en/docs/install)  installed on your computer.

From your command line:

```bash
# Clone this repository
$ git clone https://github.com/ApoGouv/itralytics.git

# Go into the repository
$ cd itralytics

# Install server dependencies
$ yarn install

# Go into the client folder
$ cd client

# Install client dependencies
$ yarn install

# Go back to server folder
$ cd ../

# Run the app
$ yarn dev
```


### Technologies

| Back-end          	| Front-end          	|
|:-----------------  	|:--------------------	|
| [Node.js]         	| [React]              	|
| [Express.js]      	| [React Router]    	|
| [Passport.js]        	| [Redux]              	|
| [Mongoose.js]        	| [react-spasklines]   	|
| [socket.io]         	| [axios]              	|
| [googleapis]        	| [Redux Form]         	|
| [Request]           	| [Moment.js]          	|
| [express-session]    	| [react-widgets]      	|
| [connect-mongo]      	| [socket.io-client]   	|
| [Lodash]          	| [MaterializeCSS]    	|
| [morgan]            	| [Font Awesome]       	|
| [Concurrently]      	| [jQuery]             	|
|                   	| [Lodash]             	|
|                   	| [Particle.js - React Component] 	|




[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [iTrust-digital link]: https://itrust-digital.com/ "iTrust - Digital Strategy"
   [Christos Berberidis info link]: https://www.ihu.gr/ucips/cv/christos-berberidis "Dr. Christos Berberidis"

   [Node.js]:  https://nodejs.org/en/download/ "Download nodejs"
   [Express.js]: http://expressjs.com/ "Express - web framework for Node.js"
   [Passport.js]: http://www.passportjs.org/ "Passport - authentication for Node.js"
   [Mongoose.js]: http://mongoosejs.com/ "mongoose - MongoDB ODM for Node.js"
   [socket.io]: https://socket.io/ "socket.io - Real-Time engine"
   [googleapis]: https://github.com/google/google-api-nodejs-client "Google Node.js client library for accessing Google APIs"
   [Request]: https://github.com/request/request "Request - Simplified HTTP client"
   [express-session]: https://github.com/expressjs/session "Simple session middleware for Express"
   [connect-mongo]: https://github.com/jdesboeufs/connect-mongo "MongoDB session store for Express"
   [Lodash]: https://lodash.com/ "A modern JavaScript utility library delivering modularity, performance & extras."
   [morgan]: https://github.com/expressjs/morgan "HTTP request logger middleware for node.js"
   [Concurrently]: https://github.com/kimmobrunfeldt/concurrently "Run commands concurrently"
   
   [React]: https://reactjs.org/ "A JavaScript library for building user interfaces"
   [React Router]: https://github.com/ReactTraining/react-router "Declarative routing for React"
   [Redux]: https://redux.js.org/ "Redux is a predictable state container for JavaScript apps."
   [react-spasklines]: https://github.com/borisyankov/react-sparklines "Beautiful and expressive Sparklines React component"
   [axios]: https://github.com/axios/axios "Promise based HTTP client for the browser and Node.js"
   [Redux Form]: https://redux-form.com/7.1.2/ "The best way to manage your form state in Redux."
   [Moment.js]: https://momentjs.com/ "Parse, validate, manipulate, and display dates and times in JavaScript."
   [react-widgets]: https://github.com/jquense/react-widgets "An à la carte set of polished, extensible, and accessible form inputs built for React."
   [socket.io-client]: https://github.com/socketio/socket.io-client "Realtime application framework (client)"
   [MaterializeCSS]: https://github.com/Dogfalo/materialize "Materialize, a CSS Framework based on material design."
   [Font Awesome]: https://github.com/FortAwesome/Font-Awesome "The iconic font and CSS toolkit"
   [jQuery]: https://jquery.com/ "jQuery - write less, do more JavaScript library"
   [Particle.js - React Component]: https://github.com/Wufe/react-particles-js "Particles.js component wrapper"
   