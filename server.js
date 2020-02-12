'use strict';

// DEPENDENCIES
const express       = require('express');
const bodyParser    = require('body-parser');
const fccTesting    = require('./freeCodeCamp/fcctesting.js');
const session       = require('express-session');
const passport      = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt        = require('bcrypt');
const ObjectID      = require('mongodb').ObjectID;
const mongo         = require('mongodb').MongoClient;

// MODULES
const routes        = require('./routes.js');
const auth          = require('./auth.js');

// CREATE APP
const app = express();

// MIDDLEWARES
fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// VIEW ENGINE
app.set('view engine', 'pug');

// -----------------------------------

// CONNECT DB
mongo.connect(process.env.MONGO_URI, (err, db) => {
  
  if(err) {
    console.log('Database error: ' + err);
  } else {
    console.log('Successful database connection');
    
    // AUTH
    auth(app, db);
    
    // ROUTES
    routes(app, db);

    // LISTEN
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server listening on port " + process.env.PORT);
    });
    
  }
  
});









