var express = require('express');
var bodyParser = require('body-parser')
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
waf.addModule('./LFIModule', {appInstance: app, publicPath: __dirname+"/test"}, function(error) {
    console.log(error);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(waf.check);
app.get('/', function(req, res) {
    res.status(200).end('Hello world!');
});
app.delete('/', function(req, res) {
    res.status(200).end('Hello world!');
});
app.post('/', function(req, res) {
    res.status(200).end('Hello world!');
});
app.put('/', function(req, res) {
    res.status(200).end('Hello world!');
});

app.listen(8080);
