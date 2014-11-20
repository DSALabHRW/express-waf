(function() {

    function Blocker(config) {
    };

    Blocker.prototype.blockHost = function(host) {

    };

    Blocker.prototype.check = function(req, res, cb) {
        cb();
    };

    module.exports = Blocker;

})();