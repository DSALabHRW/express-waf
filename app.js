var express = require('express');
var app = express();
var ExpressWAF = require('./express-waf');
var waf = new ExpressWAF({
    blockTime: 7200 * 1000
});

waf.addModule('./testModule', {}, function(error) {
    console.log(error);
});
waf.addModule('./XSSModule', {}, function(error) {
    console.log(error);
});

app.use(waf.check);
app.get('/', function(req, res) {
    res.status(200).end('Hello world!');
});

app.listen(8080);
