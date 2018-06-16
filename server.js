var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.use(function(req, res, next) {
  res.status(404).send
});

var server = app.listen(3000, function() {
  console.log('Listening on http://localhost:3000');
});
