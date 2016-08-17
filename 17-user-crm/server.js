// BASE SETUP
// ===========

// connect to our database (hosted on modulus.io)

var User 		= require('./app/models/user');
var Article		= require('./app/models/article');
var Task		= require('./app/models/task');

//CALL THE PACKAGES ----------------
var config 		= require('./config');
var express		= require('express'); //call express
var app			= express(); // define our app using express
var bodyParser	= require('body-parser'); // get body-parser
var morgan		= require('morgan'); // used to see requests
var mongoose	= require('mongoose'); // for working w/ our database
var path 		= require('path');

var port		= process.env.PORT || 8080; // set the port of our app
var jwt 		= require('jsonwebtoken');


// APP CONFIGURATION ---------------
//use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function (req,res,next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database (hosted on modulus.io)
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));
// app.use('static', express.static(__dirname + '/files'));
// app.use('static', express.directory(__dirname + '/files'));

// ROUTES FOR OUR API
// ======================

// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});



// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
