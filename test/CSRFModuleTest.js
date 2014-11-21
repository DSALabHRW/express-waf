var express = require('express');
var app = express();
var request = require('request');

var ExpressWAF = require('./../express-waf');
var waf = new ExpressWAF({
    blockTime: 7200 * 1000
});
waf.addModule('./CSRF', {
    allowedMethods:['GET', 'POST'],
    refererIndependentUrls: ['/']
}, function (error) {

});
app.use(waf.check);


app.get('/', function(req, res) {
    res.status(200).end('<a href="/test2">link</a>');
});
app.get('/test', function(req, res) {
    res.status(200).end('Hello world!');
});
app.post('/test', function(req, res) {
    res.status(200).end('Hello world!');
});

var server = app.listen(8080);



/**
 * This test checks, if the referer independent Urls, that not need a referer header works and the status code is 200
 * If not the independent urls were ignored in module
 * @param test
 */
exports.testRefererIndependentUrl = function(test) {
    request.get('http://localhost:8080', function (err, r) {
        test.equals(r.statusCode, 200, 'The referer independent Urls were ignored!');
        test.done();
    })
};

/**
 * This test checks, if a not in "referer independent Urls" listed URL is not allowed
 * If it is allowed there is an Error in Check
 * @param test
 */
exports.textNotAllowedWithoutRefererInHeader = function (test) {
    request.get('http://localhost:8080/test', function (err, r) {
        test.equals(r.statusCode, 403, 'This URL is normally not allowed without a referer in header');
        test.done();
    });
};

/**
 * This test checks, if a Request with a referer header is accepted
 * If not there is an Error in Check
 * @param test
 */
exports.testWithRefererInHeader = function (test) {
    var headers = {
        'Referer': 'http://localhost:8080/'
    };
    request.get({
        url: 'http://localhost:8080/test',
        headers: headers
    }, function (err, r) {
        test.equals(r.statusCode, 200, 'This URL is normally allowed, when sending a referer in header!');
        test.done();
    })
};

/**
 * This test checks, if a Request with a referer header and a blacklisted Method will be refused
 * If not the blacklist of Methods will be ignored
 * @param test
 */
exports.testNotAllowedMethod = function (test) {
    var headers = {
        'Referer': 'http://localhost:8080/'
    };
    request.put({
        url: 'http://localhost:8080/test',
        headers: headers
    }, function (err, r) {
        test.equals(r.statusCode, 403, 'This URL is normally not allowed, when sending a referer but method is blacklisted!');
        test.done();
    });
};

/**
 * This test checks, if a Request with a referer header and a not blacklisted Method will be allowed
 * It not there is an error in check of blacklisted methods
 * @param test
 */
exports.testAllowedMethod = function (test) {
    var headers = {
        'Referer': 'http://localhost:8080/'
    };
    request.post({
        url: 'http://localhost:8080/test',
        headers: headers
    }, function (err, r) {
        test.equals(r.statusCode, 200, 'This URL is normally allowed, when sending a referer and a whitelisted method');
        test.done();
    });
};

exports.closeServer = function (test) {
    server.close();
    test.done();
};