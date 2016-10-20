/*
* @Author: Administrator
* @Date:   2016-10-19 10:10:28
* @Last Modified by:   Administrator
* @Last Modified time: 2016-10-19 18:40:24
* @function:
*/

import User from '../../models/User.js';
import {GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET} from '../../config';
export default (passport)=>{
  User.findOne({ username: 'test' }, function (err, testUser) {
    if (!testUser) {
      console.log('test user did not exist; creating test user...')
      testUser = new User({
        username: 'test',
        password: 'test'
      })
      testUser.save();
    }
  })

  passport.serializeUser(function(user, done) {
    console.log('se:',user)
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    console.log('de:',obj);
    done(null, obj);
  });

  const LocalStrategy = require('passport-local').Strategy
  passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username, password: password }, done);
  }));


  const GitHubStrategy = require('passport-github2').Strategy;
  passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      //console.log(profile.id);
      process.nextTick(function () {
        
        // To keep the example simple, the user's GitHub profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the GitHub account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  ));
}

