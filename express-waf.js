(function() {
    var modules = [];

    module.exports.addModule = function (moduleName, config, callback) {
        var firewallModule = require(moduleName);

        if (firewallModule.check && firewallModule.init) {
            firewallModule.init(config);
            modules.push(firewallModule);
        } else {
            callback(moduleName + ' does not define a check and an init function!');
        }
    };

    module.exports.check = function (req, res, cb) {
        recursiveCall(0, function () {
            cb();
        });

        /**
         * This iterates over all modules and run on them function check
         * @param i {int} iterator
         * @param callback {function} Callback after iteration ended
         */
        function recursiveCall(i, callback) {
            if(i >= modules.length) {
                callback();
            } else {
                modules[i].check(req, res, function () {
                    recursiveCall(++i, callback);
                })
            }
        }
    };
})();