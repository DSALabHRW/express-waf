var request = require('request');

exports.testGetApostropheSqlInj = function(test) {
    test.expect(1);

    request.get('http://localhost:8080/test?user=\'').on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: \' should return HTTP status code 403.');
        test.done();
    });
};

exports.testGetQuotatMarkSqlInj = function(test) {
    test.expect(1);

    request.get('http://localhost:8080/test?user="').on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: " should return HTTP status code 403.');
        test.done();
    });
};

exports.testGetSimpleSqlInj = function(test) {
    test.expect(1);

    request.get('http://localhost:8080/test?user=\' or 1 = \'1').on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: \' or 1 = \' should return HTTP status code 403.');
        test.done();
    });
};

exports.testGetLogicSqlInjection = function(test) {
    test.expect(1);

    request.get('http://localhost:8080/test?user=1 or 1 = \'1\'').on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: 1 or 1 = \'1; should return HTTP status code 403.');
        test.done();
    });
};

exports.testGetLogic2SqlInjection = function(test) {
    test.expect(1);

    request.get('http://localhost:8080/test?user=1 or 1 = (2-1)').on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: 1 or 1 = (2-1); should return HTTP status code 403.');
        test.done();
    });
};

exports.testGetCommentCrash1SqlInj = function(test) {
    test.expect(1);

    request.get('http://localhost:8080/test?user= --').on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: -- should return HTTP status code 403.');
        test.done();
    });
};

exports.testGetCommentCrash2SqlInjection = function(test) {
    test.expect(1);

    request.get('http://localhost:8080/test?user=/*').on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: /* should return HTTP status code 403.');
        test.done();
    });
};

exports.testGetCommentCrash3SqlInjection = function(test) {
    test.expect(1);

    request.get('http://localhost:8080/test?user=1;/*').on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: 1/* should return HTTP status code 403.');
        test.done();
    });
};

exports.testGetMultipleQuerySqlInjection = function(test) {
    test.expect(1);

    request.get('http://localhost:8080/test?user=1; INSERT INTO users').on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: 1; INSERT INTO users should return HTTP status code 403.');
        test.done();
    });
};

exports.testGetUnionSqlInjection = function(test) {
    test.expect(1);

    request.get('http://localhost:8080/test?user=1 UNION ALL SELECT creditCardNr FROM table').on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: 1 UNION ALL SELECT creditcardNr FROM table users should return HTTP status code 403.');
        test.done();
    });
};

exports.testPostSimpleSqlInj = function(test) {
    test.expect(1);

    request.post('http://localhost:8080/test', { form: { user: '1; INSERT INTO users' } }).on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: \' or 1 = \' should return HTTP status code 403.');
        test.done();
    });
};

exports.testPostLogicSqlInjection = function(test) {
    test.expect(1);

    request.post('http://localhost:8080/test', { form: { user: '1 or 1 = \'1\'' } }).on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: 1 or 1 = \'1; should return HTTP status code 403.');
        test.done();
    });
};

exports.testPostLogic2SqlInjection = function(test) {
    test.expect(1);

    request.post('http://localhost:8080/test', { form: { user: '1 or 1 = (2-1)' } }).on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: 1 or 1 = (2-1); should return HTTP status code 403.');
        test.done();
    });
};

exports.testPostCommentCrash1SqlInj = function(test) {
    test.expect(1);

    request.post('http://localhost:8080/test', { form: { user: '--' } }).on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: -- should return HTTP status code 403.');
        test.done();
    });
};

exports.testPostCommentCrash2SqlInjection = function(test) {
    test.expect(1);

    request.post('http://localhost:8080/test', { form: { user: '/*' } }).on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: /* should return HTTP status code 403.');
        test.done();
    });
};

exports.testPostCommentCrash3SqlInjection = function(test) {
    test.expect(1);

    request.post('http://localhost:8080/test', { form: { user: '1;/*' } }).on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: 1/* should return HTTP status code 403.');
        test.done();
    });
};

exports.testPostMultipleQuerySqlInjection = function(test) {
    test.expect(1);

    request.post('http://localhost:8080/test', { form: { user: '1; INSERT INTO users' } }).on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL get attack like: 1; INSERT INTO users should return HTTP status code 403.');
        test.done();
    });
};

exports.testPostUnionSqlInjection = function(test) {
    test.expect(1);

    request.post('http://localhost:8080/test', { form: { user: '1; INSERT INTO users' } }).on('response', function(res) {
        test.equals(403, res.statusCode, 'An SQL post attack like: "1; INSERT INTO" users should return HTTP status code 403.');
        test.done();
    });
};

//TODO Http Delete and Http Put tests



