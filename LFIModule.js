(function() {
    //@todo app.use(express.static(__dirName+"/publicRootDir"))
    var fs = require('fs');
    var _patterns = ["\\.\\./"];
    var _blocker;
    var _routes = [];
    var _routerStack = [];

    function LFI(config, blocker) {
        _routerStack = config.router;
        _blocker = blocker;
    };

    LFI.prototype.check = function(req, res, cb) {
        var _host = req.ip;
        if (req.method === 'GET' || req.method === 'DELETE') {
            checkGetOrDeleteRequest(req, res, cb);
        } else if (req.method === 'POST' || req.method === 'PUT') {
            checkPostOrPutRequest(req, res, cb);
        }

        function checkGetOrDeleteRequest(req, res, cb){
            var validPattern = true;
            var _url = req.url;
            _patterns.forEach(function(pattern) {
                if (_url.match(pattern)&& _blocker.blockHost) {
                    validPattern = false;
                }
            });

            if(validPattern) {
                checkPath();
            } else{
                handleAttack(_host);
            }

        }

        function checkPostOrPutRequest(req, res, cb){
            var validPattern = true;

            if(req.body != null){
                for(var i in req.body){
                    _patterns.forEach(function(pattern) {
                        if (req.body[i].match(pattern) && _blocker.blockHost) {
                            validPattern = false;
//                            break;
                        }
                    });
                }
            }

            if(validPattern) {
                checkPath();
            } else{
                handleAttack(_host);
            }
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
            fs.exists(req.path,function(exists){
                callback(exists);
            });

        }

        function handleAttack(_host){
            _blocker.blockHost(_host);
            res.status(403).end();
        }

        function routeArray(){
            _routes = [];
            _routerStack._router.stack.forEach(function(route){
                if(route.route){
                    route.route.stack.forEach(function(r){
                        _routes.push({
                            method: r.method.toUpperCase(),
                            path: route.route.path
                        })
                    })
                }

            })
        }
    };

    module.exports = LFI;
})();
