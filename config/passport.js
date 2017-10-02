var passport = require('passport');
var Strategy = require('passport-discord').Strategy;


var User = require('../models/User');

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
// passport.deserializeUser(function(id, done) {
//   new User({ id: id}).fetch().then(function(user) {
//     done(null, user);
//   });
// });


// Passport connection for login
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var scopes = ['identify', 'guilds'];

passport.use(new Strategy({
  clientID: process.env.DISCORD_CLIENT,
  clientSecret: process.env.DISCORD_SECRET,
  callbackURL: 'http://www.raidbot.io/callback',
  scope: scopes
  }, 
  function(accessToken, refreshToken, profile, done) {
    var guilds = profile.guilds;
    User
    .findOrCreate({where: {userid: profile.id}, defaults: {
      userid: profile.id,
      user: profile.username,
      avatar: profile.avatar
    }})
    .spread(function(profile, created) {
      console.log(created)
    })
    process.nextTick(function() {
        return done(null, profile);
    });
  })
);

// Sign in with Email and Password
// passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
//   new User({ email: email })
//     .fetch()
//     .then(function(user) {
//       if (!user) {
//         return done(null, false, { msg: 'The email address ' + email + ' is not associated with any account. ' +
//         'Double-check your email address and try again.' });
//       }
//       user.comparePassword(password, function(err, isMatch) {
//         if (!isMatch) {
//           return done(null, false, { msg: 'Invalid email or password' });
//         }
//         return done(null, user);
//       });
//     });
// }));
