(function() {

    var _config;
    var _patterns = [];
    var _blocker;

    function XSSModule(config, blocker) {
        var _xemplar = require('xemplar');
        _patterns.push(_xemplar.security.xss.simple);
        _patterns.push(_xemplar.security.xss.img);
        _patterns.push(_xemplar.security.xss.paranoid);
        _blocker = blocker;
    };

    XSSModule.prototype.check = function(req, res, cb) {
        var _host = req.ip;

        if (req.method === 'GET' || req.method === 'DELETE') {
            checkGetOrDeleteRequest(req, res, cb);
        } else if (req.method === 'POST' || req.method === 'PUT') {
            checkPostOrPutRequest(req, res, cb);
        }
        
        function checkPostOrPutRequest(req, res, cb) {
            req.body.forEach(function(reqElement) {
                _patterns.forEach(function(pattern) {
                    if (pattern.test(reqElement) && _blocker.blockHost) {
                        _blocker.blockHost(_host);
                        res.status(403).end();
                    }
                });
            });
            if (cb) {
                cb();
            }
        }

        function checkGetOrDeleteRequest(req, res, cb) {
            var _url = req.url;
            _patterns.forEach(function(pattern) {
                if (pattern.test(_url) && _blocker.blockHost) {
                    _blocker.blockHost(_host);
                    res.status(403).end();
                }
            });
            if (cb) {
                cb();
            }
        };
    };

    module.exports = XSSModule;

})();