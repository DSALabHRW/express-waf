(function() {
    var fs = require('fs');
    var _patterns = [/\.\.\//];
    var _blocker;
    var _logger;
    var _routes = [];
    var _app;
    var _publicPath;

    function LFI(config, blocker, logger) {
        _app = config.appInstance;
        _publicPath = config.publicPath;
        _blocker = blocker;
        _logger = logger;
    };

    LFI.prototype.check = function(req, res, cb) {
        var _host = req.ip;
        var _validPattern = true;
        if (req.method === 'GET' || req.method === 'DELETE') {
            _validPattern = checkGetOrDeleteRequest(req, res, cb);
        }

        if(_validPattern) {
            checkPath();
        } else{
            handleAttack(_host);
        }

        function checkGetOrDeleteRequest(req, res, cb){
            var valid = true;
            var _url = req.url;
            _patterns.forEach(function(pattern) {
                if (pattern.test(_url)&& _blocker.blockHost) {
                    valid = false;
                }
            });
            return valid;
        }

        function checkPath(){
            var validRoute = checkRoute(req.method);

            if(!validRoute){
                checkFileSystem(function (valid) {
                    if (!valid) {
                        handleAttack(_host);
                    } else if (cb) {
                        cb();
                    }
                });
            } else if (cb) {
                cb();
            }
        }

        function checkRoute(method){
            if (_routes.length == 0) {
                routeArray();
            }

            var valid = false;
            for (var i = 0; i < _routes.length; i++) {
                if (_routes[i].method === method && _routes[i].path === req.url) {
                    valid = true;
                    break;
                }
            }
            return valid;
        }

        function checkFileSystem(callback){
            fs.exists(_publicPath+req.originalUrl,function(exists){
                callback(exists);
            });

        }

        function handleAttack(_host){
            _blocker.blockHost(_host);
            _logger.logAttack('LFIAttack', _host);
            _blocker.blockHost(_host);
            res.status(403).end();
        }

        function routeArray(){
            _routes = [];
            _app._router.stack.forEach(function(route){
                if(route.route){
                    route.route.stack.forEach(function(r){
                        _routes.push({
                            method: r.method.toUpperCase(),
                            path: route.route.path
                        });
                        console.log(r.method.toUpperCase()+"->"+route.route.path);
                    })
                }

            })
        }
    };

    module.exports = LFI;
})();
