(function() {
    var _modules = [];
    var _blocker;

    function ExpressWAF(blockerConfig) {
        this.addModule('./blocker', blockerConfig, function(error) {
           console.log(error);
        });
    };

    ExpressWAF.prototype.addModule = function (moduleName, config, callback) {
        var FirewallModuleClass = require(moduleName);
        var firewallModule;

        if (FirewallModuleClass.prototype.check) {
            firewallModule = new FirewallModuleClass(config);
            _modules.push(firewallModule);
        } else {
            callback(moduleName + ' does not define a check and an init function!');
        }
    };

    ExpressWAF.prototype.check = function (req, res, cb) {
        recursiveCall(0, function () {
            cb();
        });

        /**
         * This iterates over all modules and run on them function check
         * @param i {int} iterator
         * @param callback {function} Callback after iteration ended
         */
        function recursiveCall(i, callback) {
            if(i >= _modules.length) {
                callback();
            } else {
                _modules[i].check(req, res, function () {
                    recursiveCall(++i, callback);
                })
            }
        }
    };

    module.exports = ExpressWAF;
})();