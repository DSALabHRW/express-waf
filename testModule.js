(function() {

    var _config;

    function TestModule(config) {
        _config = config;
    };

    TestModule.prototype.check = function(req, res, cb) {
        console.log(req.url);
    };

    module.exports = TestModule;

})();
