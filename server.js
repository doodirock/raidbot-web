var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var redis   = require("redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var nunjucks = require('nunjucks');
var passport = require('passport');

// Controllers
var HomeController = require('./controllers/home');
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');

// Passport OAuth strategies
require('./config/passport');

var scopes = ['identify', 'guilds'];

var app = express();

// view engine setup
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'html');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'I like a do da chacha',
  store: new redisStore({ host: process.env.REDISCLOUD_URL, port: 16523, pass: process.env.REDISCLOUD_PASS, ttl: 604800}),
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// Need to figure out how I want to handle requests to make sure user is logged in all all pages.
// app.use(function(req, res, next) {
//   res.locals.user = req.user ? req.user.toJSON() : null;
//   next();
// });
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', HomeController.index);
app.get('/contact', contactController.contactGet);
app.post('/contact', contactController.contactPost);
app.get('/account', userController.ensureAuthenticated, userController.accountGet);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);
// auth start
app.get('/login', passport.authenticate('discord', { scope: scopes }), function(req, res) {});
app.get('/callback',
    passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { 
		res.redirect('/profile') 
	} // auth success
);
// app.get('/login', userController.loginGet);
// app.post('/login', userController.loginPost);
app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);
app.get('/reset/:token', userController.resetGet);
app.post('/reset/:token', userController.resetPost);
app.get('/logout', userController.logout);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
