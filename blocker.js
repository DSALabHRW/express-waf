(function() {

    function Blocker(config) {
        console.log('konfiguriere blocker!');
        console.log(config.blockTime);
    };

    Blocker.prototype.blockHost = function(host) {

    };

    Blocker.prototype.check = function(req, res, cb) {

    };

    module.exports = Blocker;

})();