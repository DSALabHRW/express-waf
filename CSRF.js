(function() {

    var _config;
    var _blocker;
    var _logger;

    function CSRF(config, blocker, logger) {
        _config = config;
        _blocker = blocker;
        _logger = logger;
    }

    /**
     * This method is default called method by express-waf
     * @param req
     * @param res
     * @param next
     */
    CSRF.prototype.check = function (req, res, next) {
        //if url is whitelisted or user-agent is undefined, this is request without a browser, like java or curl
        if(filterByUrls(req.url) || req.headers["user-agent"] === undefined) {
            next();
        } else {
            var headers = req.headers;

            if(headers.referer && headers.referer.indexOf(headers.host) > 0 && filterByMethods(req)) {
                next();
            } else {
                handleAttack(req.ip);
            }
        }

        /**
         * This method checks by configured whitelist, if the url is in the list of allowed urls without a
         * referer in the header
         * @param url
         * @returns {boolean}
         */
        function filterByUrls(url) {
            if(_config.refererIndependentUrls) {
                var isRefererIndependend = false;
                for(var i in _config.refererIndependentUrls) {
                    if(new RegExp(_config.refererIndependentUrls[i]).test(url.split('?')[0])) {
                        isRefererIndependend = true;
						break;
                    }
                }
                return isRefererIndependend;
            } else {
                return url === '/';
            }
        }

        /**
         * This Method checks by configured black or whitelist, if the REST-Method is allowed or not
         * If no black or whitelist exists it allows method by default
         * @param req
         * @returns {boolean}
         */
        function filterByMethods(req) {
            if(_config.allowedMethods) {
                return _config.allowedMethods.indexOf(req.method) > -1;
            } else if(_config.blockedMethods){
                return !(_config.blockedMethods.indexOf(req.method) > -1);
            } else {
                return true;
            }
        }

        /**
         * This Method handle attack by user
         * @param _host
         */
        function handleAttack(_host) {
            _logger.logAttack('CSRF', _host)
            _blocker.blockHost(_host);
            res.status(403).end();
        }


    };



    module.exports = CSRF;
})();