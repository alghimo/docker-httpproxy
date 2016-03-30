var express = require('express');
var session = require('express-session');
var proxyMiddleware = require('http-proxy-middleware');

var app = express();
var basicAuth = require('basic-auth');

app.use(session({
    secret: 'proxy-server'
}));

var instances = require('./instances').instances;

var getAuth = function(instance) {
  return function (req, res, next) {
    if (!req.url.startsWith("/" + instance.url_prefix)) {
      return next();
    }
    function unauthorized(res) {
      res.set('WWW-Authenticate', 'Basic realm=Zeppelin' + instance.name);
      return res.send(401);
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
      return unauthorized(res);
    };

    if (user.name === instance.user && user.pass === instance.pass) {
      return next();
    } else {
      return unauthorized(res);
    };
  };
};

instances.forEach(function(instance) {
    if (!!instance.user) {
      var auth = getAuth(instance);
      app.use(auth);
      console.log("Added basic auth for instance '" + instance.name + "'");
    }

    var filter = function(path, req) {
      return path.match('^/' + instance.url_prefix) || path.match('^/assets');
    };
    var pathRewrite = {}
    pathRewrite['^/' + instance.url_prefix + '/'] = '/'
    var options = {
      target: instance.target,
      changeOrigin: true,
      ws:true,
      pathRewrite: pathRewrite
    }

    var proxy = proxyMiddleware(filter, options);
    app.use(proxy);
    console.log("Added proxy for instance '" + instance.name + "'");
});

console.log("listening on port 8080")
app.listen(8080);
