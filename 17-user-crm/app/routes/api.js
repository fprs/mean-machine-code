//
var multer 	   = require('multer');
var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Article    = require('../models/article');
var Task    = require('../models/task');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('name username password').exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({ 
	      	success: false, 
	      	message: 'Nie znaleziono użytkownika o podanej nazwie'//'Authentication failed. User not found.' 
	    	});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({ 
	        	success: false, 
	        	message: 'Błędne hasło.'//'Authentication failed. Wrong password.' 
	      	});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username
	        }, superSecret, {
	          expiresIn: '24h' // expires in 24 hours
	        });	

	        user.createUserSession(req, null, user, function (err) {
        if (err) {
          console.log("Error saving session: " + err);
		        }
		    });

	        console.log("!@#$!@#!$#@!#!# req.session: "+req.session.user);

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	  });
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {      

	      if (err) {
	        res.status(403).send({ 
	        	success: false, 
	        	message: 'Failed to authenticate token.' 
	    	});  	   
	      } else { 
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;
	            
	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });

	  } else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({ 
   	 		success: false, 
   	 		message: 'No token provided.' 
   	 	});
	    
	  }
	});

	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)
			user.surname = req.body.surname;  // set the users username (comes from the request)
			user.email = req.body.email;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'Istnieje już użytkownik o podanej nazwie. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'Nowy użytkownik został utworzony pomyślnie.' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				if (req.body.surname) user.surname = req.body.surname;
				if (req.body.email) user.email = req.body.email;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Użytkownik został zedytowany.' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Usunięto użytkownika.' });
			});
		});

// on routes that end in /articles
	// ----------------------------------------------------
	apiRouter.route('/articles')

		// create a article (accessed at POST http://localhost:8080/articles)
		.post(function(req, res) {
			// User.findById(req.params.user_id, function(err, user){
			
			var article = new Article();		// create a new instance of the Article model
			article.title = req.body.title;  // set the articles name (comes from the request)
			article.content = req.body.content;  // set the articles articlename (comes from the request)
			// article.username = req.session.user.username;  // set the articles articlename (comes from the request)
			
			//article.user = req.main.user._id;	
			console.log("ID: "+req.session);		
			//article.password = req.body.password;  // set the articles password (comes from the request)


			article.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A article with that articlename already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'Grupa została utworzona.' });
			});
		// });
		})

		// get all the article (accessed at GET http://localhost:8080/api/articles)
		.get(function(req, res) {

			Article.find({}, function(err, articles) {
				if (err) res.send(err);

				// return the articles
				res.json(articles);
			});
		});

	// on routes that end in /articles/:article_id
	// ----------------------------------------------------
	apiRouter.route('/articles/:article_id')

		// get the article with that id
		.get(function(req, res) {
			Article.findById(req.params.article_id, function(err, article) {
				if (err) res.send(err);

				// return that article
				res.json(article);
			});
		})

		// update the article with this id
		.put(function(req, res) {
			Article.findById(req.params.article_id, function(err, article) {

				if (err) res.send(err);

				// set the new article information if it exists in the request
				if (req.body.title) article.title = req.body.title;
				if (req.body.content) article.content = req.body.content;
				//if (req.body.password) article.password = req.body.password;

				// save the article
				article.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Grupa została zedytowana.' });
				});

			});
		})

		// delete the article with this id
		.delete(function(req, res) {
			Article.remove({
				_id: req.params.article_id
			}, function(err, article) {
				if (err) res.send(err);

				res.json({ message: 'Grupa została usunięta.' });
			});
		});


// on routes that end in /tasks
	// ----------------------------------------------------
	apiRouter.route('/tasks')

		// create a task (accessed at POST http://localhost:8080/tasks)
		.post(function(req, res) {
			// User.findById(req.params.user_id, function(err, user){
			
			var task = new Task();		// create a new instance of the Task model
			task.content = req.body.content;  // set the tasks taskname (comes from the request)
			task.finished = false;
			// task.username = req.session.user.username;  // set the tasks taskname (comes from the request)
			
			//task.user = req.main.user._id;	
			console.log("ID: "+req.session);		
			//task.password = req.body.password;  // set the tasks password (comes from the request)


			task.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A task with that taskname already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'Task created!' });
			});
		// });
		})

		// get all the task (accessed at GET http://localhost:8080/api/tasks)
		.get(function(req, res) {

			Task.find({}, function(err, tasks) {
				if (err) res.send(err);

				// return the tasks
				res.json(tasks);
			});
		});

	// on routes that end in /tasks/:task_id
	// ----------------------------------------------------
	apiRouter.route('/tasks/:task_id')

		// get the task with that id
		.get(function(req, res) {
			Task.findById(req.params.task_id, function(err, task) {
				if (err) res.send(err);

				// return that task
				res.json(task);
			});
		})

		// update the task with this id
		.put(function(req, res) {
			Task.findById(req.params.task_id, function(err, task) {

				if (err) res.send(err);

				// set the new task information if it exists in the request
				if (req.body.content) task.content = req.body.content;
				//if (req.body.password) task.password = req.body.password;

				// save the task
				task.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Task updated!' });
				});

			});
		})

		// delete the task with this id
		.delete(function(req, res) {
			Task.remove({
				_id: req.params.task_id
			}, function(err, task) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return apiRouter;
};