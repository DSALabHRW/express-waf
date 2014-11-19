(function() {

    var _config;
    var _blocker;

    function TestModule(config, blocker) {
        _config = config;
        _blocker = blocker;
    };

    TestModule.prototype.check = function(req, res, cb) {
        console.log(req.url);
        if (cb) {
            cb();
        }
    };

    module.exports = TestModule;

})();
