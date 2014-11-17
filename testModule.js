(function() {

    var _config;

    module.exports.check = function(req, res, cb) {
        console.log(req.url);
    };

    module.exports.init = function(config) {
        _config = config;
    };

})();
