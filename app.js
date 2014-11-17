var express = require('express');
var app = express();
var waf = require('./express-waf');

app.use(waf.check);
app.get('/', function(req, res) {
    res.status(200).end('Hello world!');
});

app.listen(8080);