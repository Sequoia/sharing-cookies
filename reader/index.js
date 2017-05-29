const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const app = express();

const redisOptions = {
  url : process.env.REDIS_SESSION_URL
}

const sessionOptions = {
  store: new RedisStore(redisOptions),
  secret: process.env.SESSION_SECRET,
  logErrors: true
}
 
app.use(session(sessionOptions));

app.use(function checkSession(req, res, next){
  if(!req.session.user){
    //alternately, res.redirect('/increment'), res.redirect('/login'), etc.
    return res.json(403, {
      'message' : 'Please go "log in!" (set up your session)',
      'login': '/login'
    });
  }else{
    next();
  }
});

app.get('/', function displayCount(req, res){
  res.json({
    user : req.session.user,
    count: req.session.count
  })
});

app.listen(8080, function(){
  console.log('READ server listening on 8080');
})